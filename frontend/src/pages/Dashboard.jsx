import { useEffect, useState } from "react";
import KpiCard from "../components/dashboard/KpiCard";
import DetectionTrend from "../components/dashboard/DetectionTrend";
import DefectPieChart from "../components/dashboard/DefectPieChart";

import { getDashboardStats } from "../services/dashboardservice";

function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [detectionTrend, setDetectionTrend] = useState([]);
  const [defectDistribution, setDefectDistribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getDashboardStats();
      setDashboardStats([
        { id: 1, title: "Total Predictions", value: data.total_predictions, change: "+12%", trend: "up" },
        { id: 2, title: "Defect Classes", value: data.defectDistribution.length, change: "+3%", trend: "up" },
        { id: 3, title: "Peak Defect", value: data.defectDistribution[0]?.name || "None", change: "+8%", trend: "up" },
        { id: 4, title: "Daily Trend", value: data.detectionTrend[data.detectionTrend.length - 1]?.defects || 0, change: "+5%", trend: "up" },
      ]);
      setDetectionTrend(data.detectionTrend);
      setDefectDistribution(data.defectDistribution);
    };

    loadData();
  }, []);

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