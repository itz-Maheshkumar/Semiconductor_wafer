import KpiCard from "../components/dashboard/KpiCard";
import DetectionTrend from "../components/dashboard/DetectionTrend";
import DefectPieChart from "../components/dashboard/DefectPieChart";

import {
  getDashboardStats,
  getDetectionTrend,
  getDefectDistribution,
} from "../services/dashboardService";

function Dashboard() {
  const dashboardStats = getDashboardStats();
  const detectionTrend = getDetectionTrend();
  const defectDistribution = getDefectDistribution();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Real-time monitoring of semiconductor wafer inspection.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardStats.map((item) => (
          <KpiCard key={item.id} {...item} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DetectionTrend data={detectionTrend} />
        <DefectPieChart data={defectDistribution} />
      </div>
    </div>
  );
}

export default Dashboard;