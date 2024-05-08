import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import PedidoClient from "./components/client";
import { PedidoColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const PedidosPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const pedidos = await prismadb.pedido.findMany({
    where: {
      tiendaId: params.storeId
    },
    include: {
      ordenPedidos: {
        include: {
          producto: true
        }
      }
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });

  const formattedPedidos: PedidoColumn[] = pedidos.map((item) => ({
    id: item.id,
    telefono: item.telefono,
    direccion: item.direccion,
    productos: item.ordenPedidos.map((ordenPedido) => ordenPedido.producto.nombre).join(', '),
    precioTotal: formatter.format(item.ordenPedidos.reduce((total, item) => {
      return total + Number(item.producto.precio)
    }, 0)),
    pagado: item.pagado,
    creadoEn: format(item.creadoEn, "d 'de' MMMM 'de' yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <PedidoClient data={formattedPedidos}/>
      </div>
    </div>
   );
}
 
export default PedidosPage;