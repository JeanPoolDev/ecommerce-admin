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

    const marca = await prismadb.marca.create({
      data: {
        nombre,
        valor,
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(marca);

  } catch (error) {
    console.log('[MARCAS_POST]', error);
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

    const marcas = await prismadb.marca.findFirst({
      where: {
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(marcas);

  } catch (error) {
    console.log('[MARCAS_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}