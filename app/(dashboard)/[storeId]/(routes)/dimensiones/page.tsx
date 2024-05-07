import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { DimensionesClient } from "./components/client";
import { DimensionColumn } from "./components/columns";

const DimensionesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const dimensiones = await prismadb.dimension.findMany({
    where: {
      tiendaId: params.storeId
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });

  const formattedDimensiones: DimensionColumn[] = dimensiones.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    valor: item.valor,
    creadoEn: format(item.creadoEn, "d 'de' MMMM 'de' yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <DimensionesClient data={formattedDimensiones}/>
      </div>
    </div>
   );
}
 
export default DimensionesPage;