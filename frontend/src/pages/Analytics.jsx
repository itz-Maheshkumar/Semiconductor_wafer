import KpiCard from "../components/dashboard/KpiCard";
import DetectionTrend from "../components/dashboard/DetectionTrend";
import DefectPieChart from "../components/dashboard/DefectPieChart";

import {
  dashboardStats,
  detectionTrend,
  defectDistribution,
} from "../mock/dashboardData";

function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-slate-400">
          Performance insights and defect statistics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardStats.map((item) => (
          <KpiCard key={item.id} {...item} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DetectionTrend data={detectionTrend} />
        <DefectPieChart data={defectDistribution} />
      </div>
    </div>
  );
}

export default Analytics;