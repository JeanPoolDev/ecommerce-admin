'use client';

import * as Z from "zod";
import { useForm } from "react-hook-form";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = Z.object({
  name: Z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<Z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      name: "",
    },
  });

  const onSumit = async (values: Z.infer<typeof formSchema>) => {
    try{
      setLoading(true);

      const response = await axios.post('/api/stores', values);

      window.location.assign(`${response.data.id}`);

      toast.success("Tienda Creada.")
    } catch (error) {
      toast.error("Algo salío mal.")
    }finally{
      setLoading(false);
    } 

  }

  return (
    <Modal 
      title="Crear Tienda"
      description="agregar una nueva tienda para administrar productos y categorías"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSumit)}>
                <FormField 
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="E-commerce" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button disabled={loading} variant={"outline"} onClick={storeModal.onClose}>
                      Cancelar
                    </Button>
                    <Button disabled={loading} type="submit">Continuar</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
    </Modal>
  );
};