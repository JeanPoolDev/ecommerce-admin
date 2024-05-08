"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PedidoColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface PedidoClientProps {
  data: PedidoColumn[]
}

export const PedidoClient: React.FC<PedidoClientProps> = ({
  data
}) => {

  return ( 
    <>
      <Heading 
        title={`Pedidos (${data.length})`}
        description="Gestiona tus Pedidos para tu tienda."
      />

      <Separator />
      <DataTable searchKey="productos" columns={columns} data={data} />
      <Separator />
    </>
   );
}

export default PedidoClient;