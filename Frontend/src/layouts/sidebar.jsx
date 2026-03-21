import React from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Zap,
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
  Settings,
  User,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const path = location.pathname;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl z-50 flex-col py-8 px-4">
        
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-2 mb-12 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center">
            <Zap size={22} className="text-white fill-white" />
          </div>

          <span className="text-xl font-black text-white uppercase">
            Nexus<span className="text-pink-500">.</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 w-full">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={path === "/dashboard"} onClick={() => navigate("/dashboard")} />
          <SidebarItem icon={<FileText size={20} />} label="My Plans" active={path === "/plans"} onClick={() => navigate("/plans")} />
          <SidebarItem icon={<MessageCircle size={20} />} label="Community" active={path === "/community"} onClick={() => navigate("/community")} />
          <SidebarItem icon={<Plus size={20} />} label="New Strategy" highlight active={path === "/app"} onClick={() => navigate("/app")} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={path === "/settings"} onClick={() => navigate("/settings")} />
        </nav>

        {/* Profile */}
        <SidebarItem icon={<User size={20} />} label="Profile" active={path === "/profile"} onClick={() => navigate("/profile")} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 w-full"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Log out</span>
        </button>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#030014]/80 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around py-2">

        <MobileItem icon={<LayoutDashboard size={20} />} active={path === "/dashboard"} onClick={() => navigate("/dashboard")} />
        <MobileItem icon={<FileText size={20} />} active={path === "/plans"} onClick={() => navigate("/plans")} />
        {/* <MobileItem icon={<FileText size={20} />} active={path === "/plans"} onClick={() => navigate("/plans")} /> */}
        {/* Center Button */}
        <button
          onClick={() => navigate("/app")}
          className="bg-gradient-to-tr from-pink-600 to-indigo-600 p-4 rounded-full -mt-6 shadow-lg"
        >
          <Plus size={22} className="text-white" />
        </button>
        <MobileItem icon={<MessageCircle size={20} />} active={path === "/community"} onClick={() => navigate("/community")} />
        <MobileItem icon={<User size={20} />} active={path === "/profile"} onClick={() => navigate("/profile")} />
        {/* <MobileItem icon={<FileText size={20} />} active={path === "/plans"} onClick={() => navigate("/plans")} /> */}
      </div>
    </>
  );
}

/* Desktop Item */
function SidebarItem({ icon, label, active, highlight, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
        ${active ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}
        ${highlight ? "text-pink-500" : ""}
      `}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

/* Mobile Item */
function MobileItem({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2
        ${active ? "text-pink-500" : "text-gray-400"}
      `}
    >
      {icon}
    </button>
  );
}