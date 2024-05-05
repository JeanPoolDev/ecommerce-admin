import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params } : { params: { colorId: string } }
) {
  try {

    if( !params.colorId ) {
      return new NextResponse("Id del color es requerido", { status: 400});
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function PATCH (
  req: Request,
  { params } : { params: { storeId: string, colorId: string } }
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

    if( !params.colorId ) {
      return new NextResponse("Id del color es requerido", { status: 400});
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        nombre,
        valor
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function DELETE (
  req: Request,
  { params } : { params: { storeId: string, colorId: string } }
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if( !params.colorId ) {
      return new NextResponse("Id del color es requerido", { status: 400});
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};