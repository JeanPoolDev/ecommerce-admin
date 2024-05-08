import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params } : { params: { storeId: string }}
) {
  try{
    const { userId } = auth();
    const body = await req.json();

    const { 
      nombre,
      precio,
      categoriaId,
      colorId,
      marcaId,
      dimensionId,
      imagenes,
      esDestacado,
      esArchivado
     } = body;

    if(!userId){
      return new NextResponse("No requerido", { status: 401 });
    }

    if(!nombre){
      return new NextResponse("El nombre es requerido", { status: 400 });
    }

    if(!precio){
      return new NextResponse("El precio es requerido", { status: 400 });
    }
    
    if(!categoriaId){
      return new NextResponse("La cateogira es requerido", { status: 400 });
    }

    if(!colorId){
      return new NextResponse("El color es requerido", { status: 400 });
    }
    
    if(!marcaId){
      return new NextResponse("La marca es requerido", { status: 400 });
    }

    if(!dimensionId){
      return new NextResponse("La dimension requerido", { status: 400 });
    }

    if(!imagenes || !imagenes.length){
      return new NextResponse("La imagen es requerido", { status: 400 });
    }

    if(!params.storeId){
      return new NextResponse("ID de tienda es requerido", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if ( !storeByUserId ) {
      return new NextResponse("Inautorizado", { status: 403 });
    }

    const producto = await prismadb.producto.create({
      data: {
        nombre,
        precio,
        esArchivado,
        esDestacado,
        categoriaId,
        colorId,
        marcaId,
        dimensionId, 
        tiendaId: params.storeId,
        imagenes: {
          createMany: {
            data: [
              ...imagenes.map((imagen:{url: string}) => imagen)
            ]
          }
        }
      }
    });

    return NextResponse.json(producto);

  } catch (error) {
    console.log('[PRODUCTOS_POST]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}


export async function GET(
  req: Request,
  { params } : { params: { storeId: string }}
) {
  try{

    const { searchParams } = new URL(req.url)
    const categoriaId = searchParams.get("categoriaId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const marcaId = searchParams.get("marcaId") || undefined;
    const dimensionId = searchParams.get("dimensionId") || undefined;
    const esDestacado = searchParams.get("esDestacado") || undefined;

    if(!params.storeId){
      return new NextResponse("ID de tienda es requerido", { status: 400 });
    }

    const productos = await prismadb.producto.findFirst({
      where: {
        tiendaId: params.storeId,
        categoriaId,
        colorId,
        marcaId,
        dimensionId,
        esDestacado: esDestacado ? true : undefined,
        esArchivado: false
      },
      include: {
        imagenes: true,
        categoria: true,
        color: true,
        marca: true,
        dimension: true,
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });

    return NextResponse.json(productos);

  } catch (error) {
    console.log('[PRODUCTOS_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}