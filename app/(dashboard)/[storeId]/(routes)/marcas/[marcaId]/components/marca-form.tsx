'use client'

import * as z from "zod";
import { useState } from "react";
import { Marca } from "@prisma/client";
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
  valor: z.string().min(1),
});

type MarcaFormValues = z.infer<typeof formSchema>;

interface MarcaFormProps {
  initialData: Marca | null;
}

export const MarcaForm: React.FC<MarcaFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar Marcas" : "Crear una Marca";
  const description = initialData ? "Editar una Marca" : "Agregar una nueva Marca";
  const toastMessage = initialData ? "Actualizar una Marca" : "Crear Marca";
  const action = initialData ? "Guardar Cambios" : "Crear";

  const form = useForm<MarcaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: '',
      valor: '',
    }
  });

  const onSumit = async (data: MarcaFormValues) => {
    try{
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/marcas/${params.marcaId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/marcas`, data);
      }
      router.push(`/${params.storeId}/marcas`)
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
      await axios.delete(`/api/${params.storeId}/marcas/${params.marcaId}`)
      router.push(`/${params.storeId}/marcas`)
      toast.success("Marca Eliminada")
      router.refresh();
    } catch(error){
      toast.error("Asegúrese de eliminar todos las Marcas primero")
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
                  <FormLabel>Nombre de Marca: </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre de Marca.." {...field}/>
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
                  <FormLabel>Acronimo de Marca:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre de Marca.." {...field}/>
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