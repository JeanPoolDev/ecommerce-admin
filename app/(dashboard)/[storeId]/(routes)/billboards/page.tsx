import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const billbords = await prismadb.billbord.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billbords.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "d 'de' MMMM 'de' yyyy")
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
   );
}
 
export default BillboardsPage;