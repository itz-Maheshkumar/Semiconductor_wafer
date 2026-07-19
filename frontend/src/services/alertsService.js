// For now, alerts are static. In production, these would come from backend
// via WebSocket or polling. This can be replaced with an API call.

export const getAlerts = () => {
  // This would normally come from: api.get("/api/v1/alerts")
  // For MVP, returning empty array - can be updated when backend alerts are implemented
  return [];
};

export const getAlert = (id) => {
  // Single alert getter for future use
  return null;
};
