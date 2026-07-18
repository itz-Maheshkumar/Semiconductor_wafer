import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  Layers,
  History,
  BarChart3,
  Bell,
  Settings,
  Cpu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Inspect Wafer", icon: ScanSearch, path: "/inspect" },
  { name: "Batch Processing", icon: Layers, path: "/batch" },
  { name: "History", icon: History, path: "/history" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Alerts", icon: Bell, path: "/alerts" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-slate-800">
        <Cpu className="text-blue-400" size={32} />
        <div>
          <h1 className="text-lg font-bold">WaferVision AI</h1>
          <p className="text-xs text-slate-400">
            Semiconductor Inspection
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;