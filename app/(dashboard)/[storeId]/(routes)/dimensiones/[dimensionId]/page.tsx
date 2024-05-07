import prismadb from "@/lib/prismadb";
import { DimensionForm } from "./components/dimension-form"

const DimensionPage = async ({
  params
}:{
  params: { dimensionId: string,  }
}) => {

  const dimension = await prismadb.dimension.findUnique({
    where: {
      id: params.dimensionId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DimensionForm initialData={dimension} />
      </div>
    </div>
   );
}
 
export default DimensionPage;