"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { CategoryColumn, columns } from "./columns";

interface CategoryClientProps {
  data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();


  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Categorias (${data.length})`}
          description="Gestiona las categorias para tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Agregar Nuevo
        </Button> 
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Llamado de API para Categorias"/>
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/> 
    </>
   );
}

export default CategoryClient;