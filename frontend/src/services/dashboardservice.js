import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/analytics/summary");
  const { class_distribution, predictions_over_time, total_predictions } = response.data;

  return {
    total_predictions,
    defectDistribution: Object.entries(class_distribution).map(([name, value]) => ({
      name,
      value,
    })),
    detectionTrend: predictions_over_time.map((item) => ({
      day: item.date,
      defects: item.count,
    })),
  };
};