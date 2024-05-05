import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";

const ColoresPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const colores = await prismadb.color.findMany({
    where: {
      tiendaId: params.storeId
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });

  const formateedColores: ColorColumn[] = colores.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    valor: item.valor,
    creadoEn: format(item.creadoEn, "d 'de' MMMM 'de' yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <ColorsClient data={formateedColores}/>
      </div>
    </div>
   );
}
 
export default ColoresPage;