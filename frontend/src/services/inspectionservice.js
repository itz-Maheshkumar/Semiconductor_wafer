import api from "./api";

export const uploadInspectionImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/predictions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const submitFeedback = async (predictionId, payload) => {
  const response = await api.post(`/predictions/${predictionId}/feedback`, payload);
  return response.data;
};