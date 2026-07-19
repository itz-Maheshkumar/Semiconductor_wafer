import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertsService";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getAlerts();
        setAlerts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load alerts:", err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-slate-400">
          System notifications and production alerts.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No alerts at this time</p>
          <p className="text-slate-500 text-sm mt-2">
            You're all caught up! Alerts will appear here when important events occur.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-between items-center hover:border-slate-600 transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <p className="text-slate-400">{alert.time}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ml-4 ${
                  alert.severity === "High"
                    ? "bg-red-600 text-white"
                    : alert.severity === "Medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;