import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params } : { params: { marcaId: string } }
) {
  try {

    if( !params.marcaId ) {
      return new NextResponse("Id de la marca es requerido", { status: 400});
    }

    const marca = await prismadb.marca.deleteMany({
      where: {
        id: params.marcaId,
      }
    });

    return NextResponse.json(marca);

  } catch (error) {
    console.log('[MARCA_GET]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function PATCH (
  req: Request,
  { params } : { params: { storeId: string, marcaId: string } }
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { nombre, valor } = body;

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if(!nombre) {
      return new NextResponse("Etiqueta requerido", { status: 400 });
    }

    if(!valor) {
      return new NextResponse("El valor es requerido", { status: 400 });
    }

    if( !params.marcaId ) {
      return new NextResponse("Id de la marca es requerido", { status: 400});
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

    const marca = await prismadb.marca.updateMany({
      where: {
        id: params.marcaId,
      },
      data: {
        nombre,
        valor
      }
    });

    return NextResponse.json(marca);

  } catch (error) {
    console.log('[MARCA_PATCH]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function DELETE (
  req: Request,
  { params } : { params: { storeId: string, marcaId: string } }
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if( !params.marcaId ) {
      return new NextResponse("Id de la marca es requerido", { status: 400});
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

    const marca = await prismadb.marca.deleteMany({
      where: {
        id: params.marcaId,
      }
    });

    return NextResponse.json(marca);

  } catch (error) {
    console.log('[MARCA_DELETE]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};