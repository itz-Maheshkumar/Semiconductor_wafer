import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold">
          Semiconductor Wafer Defect Detection
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        <Bell className="cursor-pointer hover:text-blue-400" />

        <UserCircle size={32} className="cursor-pointer" />
      </div>
    </header>
  );
}

export default Navbar;