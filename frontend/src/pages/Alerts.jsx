import { getAlerts } from "../services/alertsService";

function Alerts() {
  const alerts = getAlerts();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-slate-400">
          System notifications and production alerts.
        </p>
      </div>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">{alert.title}</h3>
            <p className="text-slate-400">{alert.time}</p>
          </div>

          <span
            className={`px-4 py-2 rounded-full ${
              alert.severity === "High"
                ? "bg-red-600"
                : alert.severity === "Medium"
                ? "bg-yellow-600"
                : "bg-green-600"
            }`}
          >
            {alert.severity}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Alerts;