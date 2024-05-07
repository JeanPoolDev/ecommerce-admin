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

    const { nombre, valor } = body;

    if(!userId){
      return new NextResponse("No requerido", { status: 401 });
    }

    if(!nombre){
      return new NextResponse("La etiqueta es requerido", { status: 400 });
    }

    if(!valor){
      return new NextResponse("El valor es requerido", { status: 400 });
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

    const dimension = await prismadb.dimension.create({
      data: {
        nombre,
        valor,
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(dimension);

  } catch (error) {
    console.log('[DIMENSION_POST]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}


export async function GET(
  req: Request,
  { params } : { params: { storeId: string }}
) {
  try{

    if(!params.storeId){
      return new NextResponse("ID de tienda es requerido", { status: 400 });
    }

    const dimensiones = await prismadb.dimension.findFirst({
      where: {
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(dimensiones);

  } catch (error) {
    console.log('[DIMENSIONES_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}