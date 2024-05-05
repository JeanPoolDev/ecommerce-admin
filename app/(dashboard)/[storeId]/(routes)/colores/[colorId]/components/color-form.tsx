'use client'

import * as z from "zod";
import { useState } from "react";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  nombre: z.string().min(1),
  valor: z.string().min(4).regex(/^#/,{
    message: 'La cadena debe ser un código hexadecimal válido',
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar Color" : "Crear un Color";
  const description = initialData ? "Editar un Color" : "Agregar una nuevo Color";
  const toastMessage = initialData ? "Color Actualizado" : "Color Creado";
  const action = initialData ? "Guardar Cambios" : "Crear";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: '',
      valor: '',
    }
  });

  const onSumit = async (data: ColorFormValues) => {
    try{
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/colores/${params.colorId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/colores`, data);
      }
      router.push(`/${params.storeId}/colores`)
      toast.success(toastMessage);
      router.refresh();
    } catch(error){
      toast.error("Algo salió mal.");
    } finally{
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try{
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colores/${params.colorId}`)
      router.push(`/${params.storeId}/colores`)
      toast.success("Color Eliminado")
      router.refresh();
    } catch(error){
      toast.error("Asegúrese de eliminar todos los colores primero")
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return(
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
    <div className="flex items-center justify-between">
      <Heading 
        title = {title}
        description = {description}
      />
      {initialData && (
        <Button
        disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      )}
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">

            <FormField 
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Color: </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre del Color.." {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Hexagecimal: </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input type="color" disabled={loading} {...field}/> 
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
    </Form>
    <Separator />
    </>
  );
};