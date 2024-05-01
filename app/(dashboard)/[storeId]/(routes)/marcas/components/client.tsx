"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { MarcaColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface MarcasClientProps {
  data: MarcaColumn[]
}

export const MarcasClient: React.FC<MarcasClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();


  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Marcas (${data.length})`}
          description="Gestiona tus Marcas para tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/marcas/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Agregar Nuevo
        </Button> 
      </div>
      <Separator />
      <DataTable searchKey="nombre" columns={columns} data={data} />
      
      <Heading title="API" description="Llamado de API para Marcas"/>
      <Separator />
      <ApiList entityName="marcas" entityIdName="marcaId"/> 
    </>
   );
}

export default MarcasClient;