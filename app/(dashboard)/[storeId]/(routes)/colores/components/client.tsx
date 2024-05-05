"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { ColorColumn, columns } from "./columns";

interface ColorsClientProps {
  data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();


  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Colores (${data.length})`}
          description="Gestiona tus Colores para tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/colores/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Agregar Nuevo
        </Button> 
      </div>
      <Separator />
      <DataTable searchKey="nombre" columns={columns} data={data} />
      
      <Heading title="API" description="Llamado de API para Colores"/>
      <Separator />
      <ApiList entityName="colores" entityIdName="colorId"/> 
    </>
   );
}

export default ColorsClient;