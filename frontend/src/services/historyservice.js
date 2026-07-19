import api from "./api";

export const getHistory = async (params = {}) => {
  const response = await api.get("/predictions", { params });
  return response.data.items.map((item) => ({
    id: item.id,
    date: new Date(item.created_at).toLocaleDateString(),
    defect: item.predicted_class,
    confidence: `${Math.round(item.confidence * 100)}%`,
    status: item.feedback ? "Reviewed" : "Pending",
    imageUrl: item.image_url,
    feedback: item.feedback,
  }));
};