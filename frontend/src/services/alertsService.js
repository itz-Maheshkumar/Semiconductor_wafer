const alerts = [
  {
    id: 1,
    title: "High defect rate detected",
    severity: "High",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Model accuracy dropped below 98%",
    severity: "Medium",
    time: "30 min ago",
  },
  {
    id: 3,
    title: "Batch-002 processing completed",
    severity: "Low",
    time: "1 hour ago",
  },
];

export const getAlerts = () => alerts;