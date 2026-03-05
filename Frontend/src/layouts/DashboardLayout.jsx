import { Outlet, useNavigate } from "react-router";
import { Plus, LogOut, LayoutDashboard, FileText, Zap } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 font-sans">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl z-50 flex flex-col items-center md:items-stretch py-8 px-4">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-2 mb-12 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.4)]">
            <Zap size={22} className="text-white fill-white" />
          </div>

          <span className="hidden md:block text-xl font-black tracking-tighter text-white uppercase">
            Nexus<span className="text-pink-500">.</span>
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 w-full">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<FileText size={20} />}
            label="My Plans"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Plus size={20} />}
            label="New Strategy"
            highlight
            onClick={() => navigate("/app")}
          />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300 w-full group"
        >
          <LogOut size={20} />
          <span className="hidden md:block font-bold text-sm">Log out</span>
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 ml-20 md:ml-64">
        <Outlet />
      </main>

    </div>
  );
}

function SidebarItem({ icon, label, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
      ${highlight ? "text-pink-500" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
    >
      {icon}
      <span className="hidden md:block text-sm font-bold tracking-tight">
        {label}
      </span>
    </button>
  );
}