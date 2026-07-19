import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;