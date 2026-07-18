import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function KpiCard({ title, value, change, trend }) {
  const isPositive = trend === "up";

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg hover:border-blue-500 hover:-translate-y-1 hover:shadow-blue-500/20 transition-all duration-300">
      <p className="text-slate-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>

      <div
        className={`flex items-center mt-4 text-sm font-medium ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight size={18} />
        ) : (
          <ArrowDownRight size={18} />
        )}

        <span className="ml-1">{change}</span>
      </div>
    </div>
  );
}

export default KpiCard;
