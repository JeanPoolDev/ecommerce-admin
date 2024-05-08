'use client'

import * as z from "zod";
import { useState } from "react";
import { Category, Color, Dimension, Imagen, Marca, Producto } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  nombre: z.string().min(1),
  imagenes: z.object( { url: z.string() } ).array(),
  precio : z.coerce.number().min(1),
  categoriaId: z.string().min(1),
  colorId: z.string().min(1),
  marcaId: z.string().min(1),
  dimensionId: z.string().min(1),
  esDestacado: z.boolean().default(false).optional(),
  esArchivado: z.boolean().default(false).optional(),
});

type ProductoFormValues = z.infer<typeof formSchema>;

interface ProductoFormProps {
  initialData: Producto & {
    imagenes: Imagen[]
  } | null;
  categorias: Category[];
  colores: Color[];
  marcas: Marca[];
  dimensiones: Dimension[];
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  initialData,
  categorias,
  colores,
  marcas,
  dimensiones
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar Producto" : "Crear Producto";
  const description = initialData ? "Editar un Producto" : "Agregar un nuevo Producto";
  const toastMessage = initialData ? "Producto Actulizado" : "Producto Creado";
  const action = initialData ? "Guardar Cambios" : "Crear ";

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      precio: parseFloat(String(initialData?.precio)),
    } : {
      nombre: '',
      imagenes: [],
      precio: 0,
      categoriaId: '',
      colorId: '',
      marcaId: '',
      dimensionId: '',
      esDestacado: false,
      esArchivado: false,
    }
  });

  const onSumit = async (data: ProductoFormValues) => {
    try{
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/productos/${params.productoId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/productos`, data);
      }
      router.push(`/${params.storeId}/productos`)
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
      await axios.delete(`/api/${params.storeId}/productos/${params.productoId}`)
      router.push(`/${params.storeId}/productos`)
      toast.success("Producto Eliminado")
      router.refresh();
    } catch(error){
      toast.error("Algo salió mal")
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
              name="imagenes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagenes</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) => field.onChange([...field.value, {url}])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    /> 
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre: </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre del Producto" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precío: </FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="10.00" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria: </FormLabel>
                    <Select 
                      disabled={loading} 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecciona una Categoria" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map( (category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="marcaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marcas: </FormLabel>
                    <Select 
                      disabled={loading} 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecciona una Marca" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcas.map( (marca) => (
                          <SelectItem
                            key={marca.id}
                            value={marca.id}
                          >
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colores: </FormLabel>
                    <Select 
                      disabled={loading} 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecciona un Color" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colores.map( (color) => (
                          <SelectItem
                            key={color.id}
                            value={color.id}
                          >
                            {color.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="dimensionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensiones: </FormLabel>
                    <Select 
                      disabled={loading} 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecciona una Dimensión" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dimensiones.map( (dimension) => (
                          <SelectItem
                            key={dimension.id}
                            value={dimension.id}
                          >
                            {dimension.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="esDestacado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />  
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Destacado
                    </FormLabel>
                    <FormDescription>
                      Este producto aparecera en la pagina principal.
                    </FormDescription>
                  </div>                  
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="esArchivado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />  
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archivado
                    </FormLabel>
                    <FormDescription>
                      Este producto no aparecera en ningun lugar de la tienda. (producto en revisión)
                    </FormDescription>
                  </div>                  
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