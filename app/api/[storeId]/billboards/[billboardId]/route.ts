import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params } : { params: { billboardId: string } }
) {
  try {

    if( !params.billboardId ) {
      return new NextResponse("Id de tienda es requerido", { status: 400});
    }

    const billboard = await prismadb.billbord.findUnique({
      where: {
        id: params.billboardId,
      }
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function PATCH (
  req: Request,
  { params } : { params: { storeId: string, billboardId: string } }
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if(!label) {
      return new NextResponse("Etiqueta requerido", { status: 400 });
    }

    if(!imageUrl) {
      return new NextResponse("Imagen Url es requerido", { status: 400 });
    }

    if( !params.storeId ) {
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

    const billboard = await prismadb.billbord.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl
      }
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};


export async function DELETE (
  req: Request,
  { params } : { params: { storeId: string, billboardId: string } }
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    if( !params.billboardId ) {
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

    const billboard = await prismadb.billbord.deleteMany({
      where: {
        id: params.billboardId,
      }
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse("Error Interno", {status: 500});
  }
};