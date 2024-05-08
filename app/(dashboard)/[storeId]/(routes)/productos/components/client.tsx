"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductoColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductoClientProps {
  data: ProductoColumn[]
}

export const ProductoClient: React.FC<ProductoClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();


  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Productos (${data.length})`}
          description="Gestiona tus Productos para tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/productos/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Agregar Nuevo
        </Button> 
      </div>
      <Separator />
      <DataTable searchKey="nombre" columns={columns} data={data} />
      
      <Heading title="API" description="Llamado de API para producto"/>
      <Separator />
      <ApiList entityName="productos" entityIdName="productoId"/> 
    </>
   );
}

export default ProductoClient;