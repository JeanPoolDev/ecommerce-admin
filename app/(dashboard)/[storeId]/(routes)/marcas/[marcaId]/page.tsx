import prismadb from "@/lib/prismadb";
import { MarcaForm } from "./components/marca-form"

const MarcaPage = async ({
  params
}:{
  params: { marcaId: string,  }
}) => {

  const marca = await prismadb.marca.findUnique({
    where: {
      id: params.marcaId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MarcaForm initialData={marca} />
      </div>
    </div>
   );
}
 
export default MarcaPage;