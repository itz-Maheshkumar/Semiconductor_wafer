import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Inspect from "../pages/Inspect";
import Batch from "../pages/Batch";
import History from "../pages/History";
import Analytics from "../pages/Analytics";
import Alerts from "../pages/Alerts";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inspect" element={<Inspect />} />
        <Route path="/batch" element={<Batch />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;