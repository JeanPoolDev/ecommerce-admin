import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params } : { params: { productoId: string } }
) {
  try {

    if( !params.productoId ) {
      return new NextResponse("Id de tienda es requerido", { status: 400});
    }

    const producto = await prismadb.producto.findUnique({
      where: {
        id: params.productoId,
      },
      include: {
        imagenes: true,
        categoria: true,
        marca: true,
        color: true,
        dimension: true,
      }
    });

    return NextResponse.json(producto);

  } catch (error) {
    console.log('[PRODUCTO_GET]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function PATCH (
  req: Request,
  { params } : { params: { storeId: string, productoId: string } }
) {
  try {
    const {userId} = auth();
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

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
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

    if( !params.productoId ) {
      return new NextResponse("Id de tienda es requerido", { status: 400});
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

    await prismadb.producto.update({
      where: {
        id: params.productoId,
      },
      data: {
        nombre,
        precio,
        categoriaId,
        colorId,
        marcaId,
        dimensionId,
        imagenes: {
          deleteMany: {}
        },
        esArchivado,
        esDestacado,
      }
    });
    
    const producto = await prismadb.producto.update({
      where: {
        id: params.productoId
      },
      data: {
        imagenes: {
          createMany: {
            data: [
              ...imagenes.map((imagen: {url:string}) => imagen)
            ]
          }
        }
      }
    })

    return NextResponse.json(producto);

  } catch (error) {
    console.log('[PRODUCTO_PATCH]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function DELETE (
  req: Request,
  { params } : { params: { storeId: string, productoId: string } }
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if( !params.productoId ) {
      return new NextResponse("Id de tienda es requerido", { status: 400});
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

    const producto = await prismadb.producto.deleteMany({
      where: {
        id: params.productoId,
      }
    });

    return NextResponse.json(producto);

  } catch (error) {
    console.log('[PRODUCTO_DELETE]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};