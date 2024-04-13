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

    const { label, imageUrl } = body;

    if(!userId){
      return new NextResponse("No requerido", { status: 401 });
    }

    if(!label){
      return new NextResponse("La etiqueta es requerido", { status: 400 });
    }

    if(!imageUrl){
      return new NextResponse("La URL es requerido", { status: 400 });
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

    const billboard = await prismadb.billbord.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
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

    const billboards = await prismadb.billbord.findFirst({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboards);

  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}