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

    const { name, billboardId } = body;

    if(!userId){
      return new NextResponse("No requerido", { status: 401 });
    }

    if(!name){
      return new NextResponse("Nombre es requerido", { status: 400 });
    }

    if(!billboardId){
      return new NextResponse("El banner id es requerido", { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    });

    return NextResponse.json(category);

  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
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

    const categories = await prismadb.category.findFirst({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Error Interno", {status: 500})
  }
}