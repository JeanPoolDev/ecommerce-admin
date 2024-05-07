import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params } : { params: { dimensionId: string } }
) {
  try {

    if( !params.dimensionId ) {
      return new NextResponse("Id de la dimensión es requerido", { status: 400});
    }

    const dimension = await prismadb.dimension.findUnique({
      where: {
        id: params.dimensionId,
      }
    });

    return NextResponse.json(dimension);

  } catch (error) {
    console.log('[DIMENSION_GET]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function PATCH (
  req: Request,
  { params } : { params: { storeId: string, dimensionId: string } }
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

    if( !params.dimensionId ) {
      return new NextResponse("Id de la dimensión es requerido", { status: 400});
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

    const dimension = await prismadb.dimension.updateMany({
      where: {
        id: params.dimensionId,
      },
      data: {
        nombre,
        valor
      }
    });

    return NextResponse.json(dimension);

  } catch (error) {
    console.log('[DIMENSION_PATCH]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function DELETE (
  req: Request,
  { params } : { params: { storeId: string, dimensionId: string } }
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if( !params.dimensionId ) {
      return new NextResponse("Id de la dimensión es requerido", { status: 400});
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

    const dimension = await prismadb.dimension.deleteMany({
      where: {
        id: params.dimensionId,
      }
    });

    return NextResponse.json(dimension);

  } catch (error) {
    console.log('[DIMENSION_DELETE]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};