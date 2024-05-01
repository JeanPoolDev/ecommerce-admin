import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { MarcasClient } from "./components/client";
import { MarcaColumn } from "./components/columns";

const MarcasPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const marcas = await prismadb.marca.findMany({
    where: {
      tiendaId: params.storeId
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });

  const formattedMarcas: MarcaColumn[] = marcas.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    valor: item.valor,
    creadoEn: format(item.creadoEn, "MMMM do, yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <MarcasClient data={formattedMarcas}/>
      </div>
    </div>
   );
}
 
export default MarcasPage;