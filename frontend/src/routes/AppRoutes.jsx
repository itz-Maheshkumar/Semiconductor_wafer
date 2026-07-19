import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Inspect from "../pages/Inspect";
import Batch from "../pages/Batch";
import History from "../pages/History";
import HistoryDetail from "../pages/HistoryDetail";
import Analytics from "../pages/Analytics";
import Alerts from "../pages/Alerts";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

import SplashScreen from "../components/common/SplashScreen";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  const [loading, setLoading] = useState(
  !sessionStorage.getItem("splashShown")
);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");

    if (splashShown) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem("splashShown", "true");
          setLoading(false);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inspect" element={<Inspect />} />
          <Route path="/batch" element={<Batch />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:predictionId" element={<HistoryDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;