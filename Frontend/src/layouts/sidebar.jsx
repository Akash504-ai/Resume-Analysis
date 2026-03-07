import React from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Zap,
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Sidebar() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl z-50 flex flex-col items-center md:items-stretch py-8 px-4">
      {/* Logo */}
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

      {/* Navigation */}
      <nav className="flex-1 space-y-2 w-full">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          onClick={() => navigate("/dashboard")}
          active={location.pathname === "/dashboard"}
        />

        <SidebarItem
          icon={<FileText size={20} />}
          label="My Plans"
          onClick={() => navigate("/plans")}
          active={location.pathname === "/plans"}
        />

        <SidebarItem
          icon={<Plus size={20} />}
          label="New Strategy"
          onClick={() => navigate("/app")}
          active={location.pathname === "/app"}
          highlight
        />

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          onClick={() => navigate("/settings")}
          active={location.pathname === "/settings"}
        />
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300 w-full group"
      >
        <LogOut
          size={20}
          className="group-hover:rotate-12 transition-transform mb-1"
        />

        <span className="hidden md:block font-bold text-sm">Log out</span>
      </button>
    </aside>
  );
}

/* Sidebar Item Component */

function SidebarItem({
  icon,
  label,
  active = false,
  highlight = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
        active
          ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      } ${highlight ? "text-pink-500" : ""}`}
    >
      <span
        className={`${
          active
            ? "text-pink-500"
            : "group-hover:scale-110 transition-transform"
        }`}
      >
        {icon}
      </span>

      <span className="hidden md:block text-sm font-bold tracking-tight">
        {label}
      </span>
    </button>
  );
}
