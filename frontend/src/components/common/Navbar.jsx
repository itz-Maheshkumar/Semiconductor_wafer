import { useState } from "react";
import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout as logoutUser } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const pages = [
    { name: "Dashboard", path: "/" },
    { name: "Inspect", path: "/inspect" },
    { name: "Batch", path: "/batch" },
    { name: "History", path: "/history" },
    { name: "Analytics", path: "/analytics" },
    { name: "Alerts", path: "/alerts" },
    { name: "Settings", path: "/settings" },
  ];

  const filtered = pages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 relative">

      <h2 className="text-xl font-semibold">
        Semiconductor Wafer Defect Detection
      </h2>

      <div className="flex items-center gap-4">

        {/* SEARCH */}

        <div className="relative">
          <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
            <Search size={18} className="text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 text-sm"
            />
          </div>

          {search && (
            <div className="absolute right-0 mt-2 bg-slate-800 rounded-lg w-52 shadow-lg z-50">
              {filtered.map((page) => (
                <div
                  key={page.name}
                  className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                  onClick={() => {
                    navigate(page.path);
                    setSearch("");
                  }}
                >
                  {page.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* THEME - DISABLED: Theme will be managed globally in future */}

        {/* ALERTS */}

        <div className="relative">

          <button 
          onClick={() => setShowAlerts(!showAlerts)}
          className="relative"
          >

            <div className="relative">

              <Bell className="cursor-pointer hover:text-blue-400" />

              <span className="absolute -top-2 -right-2 bg-slate-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>

            </div>

          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-800 rounded-lg shadow-lg p-4 z-50">

              <h3 className="font-bold mb-3">
                Notifications
              </h3>

              <p className="text-slate-400 text-sm">
                No new alerts
              </p>

            </div>
          )}

        </div>

        {/* PROFILE */}

        <div className="relative">

          <button onClick={() => setShowProfile(!showProfile)}>
            <UserCircle size={32} className="cursor-pointer" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-slate-800 rounded-lg shadow-lg p-4 z-50">

              <h3 className="font-bold text-lg">
                {localStorage.getItem("userName") || "User"}
              </h3>

              <p className="text-sm text-slate-400">
                {localStorage.getItem("userEmail") || "user@example.com"}
              </p>

              <hr className="my-3 border-slate-600" />

              <button
                onClick={() => {
                  navigate("/profile");
                  setShowProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-700 mb-2"
              >
                View Profile
              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-700 mb-2"
              >
                Settings
              </button>

              <button
                onClick={logout}
                className="w-full bg-red-600 rounded-lg py-2 hover:bg-red-700"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;