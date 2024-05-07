"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DimensionColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface DimensionesClientProps {
  data: DimensionColumn[]
}

export const DimensionesClient: React.FC<DimensionesClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();


  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Dimensiones (${data.length})`}
          description="Gestiona tus Dimensiones para tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/dimensiones/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Agregar Nuevo
        </Button> 
      </div>
      <Separator />
      <DataTable searchKey="nombre" columns={columns} data={data} />
      
      <Heading title="API" description="Llamado de API para dimensiones"/>
      <Separator />
      <ApiList entityName="dimensiones" entityIdName="dimensionId"/> 
    </>
   );
}

export default DimensionesClient;