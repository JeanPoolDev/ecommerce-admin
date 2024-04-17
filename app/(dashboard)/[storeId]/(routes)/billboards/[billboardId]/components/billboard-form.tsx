'use client'

import * as z from "zod";
import { useState } from "react";
import { Billbord } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billbord | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar Banner" : "Crear Banner";
  const description = initialData ? "Editar un Banner" : "Agregar un nuevo Banner";
  const toastMessage = initialData ? "Actualizar Banner" : "Crear Banner";
  const action = initialData ? "Guardar Cambios" : "Crear";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    }
  });

  const onSumit = async (data: BillboardFormValues) => {
    try{
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/
      ${params.billboardId}`)
      router.refresh();
      router.push("/")
      toast.success("Banner Eliminado")
    } catch(error){
      toast.error("Asegúrese de eliminar todos los banner primero")
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
        <FormField 
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fondo de Banner</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    /> 
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiqueta</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Etiqueta de Banner" {...field}/>
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