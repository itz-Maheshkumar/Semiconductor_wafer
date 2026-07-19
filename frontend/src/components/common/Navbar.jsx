import { useState } from "react";
import {
  Bell,
  Search,
  UserCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark");
  const [showAlerts,setShowAlerts]=useState(false);
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      document.body.classList.remove("bg-slate-900");
      document.body.classList.add("bg-white");
      document.body.style.background = "#ffffff";
      document.body.style.color = "#111";
      setTheme("light");
    } else {
      document.body.classList.remove("bg-white");
      document.body.classList.add("bg-slate-900");
      document.body.style.background = "#0f172a";
      document.body.style.color = "white";
      setTheme("dark");
    }
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

        {/* THEME */}

        <button onClick={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>

        {/* ALERTS */}

        <div className="relative">

          <button 
          onClick={() => setShowAlerts(!showAlerts)}
          >

            <div className="relative">

              <Bell className="cursor-pointer hover:text-blue-400" />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>

            </div>

          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-800 rounded-lg shadow-lg p-4 z-50">

              <h3 className="font-bold mb-3">
                Notifications
              </h3>

              <div className="mb-3">
                🔴 High defect rate detected
              </div>

              <div className="mb-3">
                🟠 Accuracy dropped below 98%
              </div>

              <div>
                🟢 Batch Completed
              </div>

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
                Sathya Keerthi
              </h3>

              <p className="text-sm text-slate-400">
                AI Engineer
              </p>

              <hr className="my-3 border-slate-600" />

              <p>
                <b>Email:</b>
              </p>

              <p className="text-sm mb-3">
                {localStorage.getItem("userEmail")}
              </p>

              <p>
                <b>Model</b>
              </p>

              <p className="mb-4">
                CNN v2.0
              </p>

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