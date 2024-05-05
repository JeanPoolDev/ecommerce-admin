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

    const color = await prismadb.color.create({
      data: {
        nombre,
        valor,
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLORES_POST]', error);
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

    const colores = await prismadb.color.findFirst({
      where: {
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(colores);

  } catch (error) {
    console.log('[COLORES_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}