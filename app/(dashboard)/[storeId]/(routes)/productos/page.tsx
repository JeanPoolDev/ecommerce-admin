import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import ProductoClient from "./components/client";
import { ProductoColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductosPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const productos = await prismadb.producto.findMany({
    where: {
      tiendaId: params.storeId
    },
    include:{
      categoria: true,
      marca: true,
      color: true,
      dimension: true,
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });

  const formattedProductos: ProductoColumn[] = productos.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    esDestacado: item.esDestacado,
    esArchivado: item.esArchivado,
    precio: formatter.format(item.precio.toNumber()),
    categoria: item.categoria.name,
    marca: item.marca.nombre,
    color: item.color.valor,
    dimension: item.dimension.nombre,
    creadoEn: format(item.creadoEn, "d 'de' MMMM 'de' yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <ProductoClient data={formattedProductos}/>
      </div>
    </div>
   );
}
 
export default ProductosPage;