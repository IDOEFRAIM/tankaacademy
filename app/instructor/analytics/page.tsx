import { redirect } from "next/navigation";

import { AuthService } from "@/services";
import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const {
    dataByCourse,
    dataByDate,
    totalRevenue,
    totalSales,
  } = await getAnalytics(user.id);

  return ( 
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Performances</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Revenu Total"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Ventes Totales"
          value={totalSales}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Évolution des Revenus</h2>
          <Chart data={dataByDate} />
        </div>
        
        {dataByCourse.length > 0 && (
          <div>
             <h2 className="text-lg font-semibold mb-2">Répartition par Cours</h2>
             <Chart data={dataByCourse} />
          </div>
        )}
      </div>
    </div>
   );
}
 
export default AnalyticsPage;
