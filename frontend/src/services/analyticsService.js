import { getDashboardStats } from "./dashboardservice";

export const getAnalytics = async () => {
  const data = await getDashboardStats();

  return {
    dashboardStats: [
      { id: 1, title: "Total Predictions", value: data.total_predictions, change: "+12%", trend: "up" },
      { id: 2, title: "Defect Classes", value: data.defectDistribution.length, change: "+3%", trend: "up" },
      { id: 3, title: "Peak Defect", value: data.defectDistribution[0]?.name || "None", change: "+8%", trend: "up" },
      { id: 4, title: "Daily Trend", value: data.detectionTrend[data.detectionTrend.length - 1]?.defects || 0, change: "+5%", trend: "up" },
    ],
    detectionTrend: data.detectionTrend,
    defectDistribution: data.defectDistribution,
  };
};