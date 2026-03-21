import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, FileText, Plus, User } from "lucide-react";

export default function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#030014]/90 backdrop-blur-xl border-t border-white/10 flex justify-around py-3 z-50 md:hidden">

      <NavItem
        icon={<LayoutDashboard size={20} />}
        active={path === "/dashboard"}
        onClick={() => navigate("/dashboard")}
      />

      <NavItem
        icon={<FileText size={20} />}
        active={path === "/plans"}
        onClick={() => navigate("/plans")}
      />

      <NavItem
        icon={<Plus size={22} />}
        active={path === "/app"}
        onClick={() => navigate("/app")}
      />

      <NavItem
        icon={<User size={20} />}
        active={path === "/profile"}
        onClick={() => navigate("/profile")}
      />
    </div>
  );
}

function NavItem({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center ${
        active ? "text-pink-500" : "text-gray-500"
      }`}
    >
      {icon}
    </button>
  );
}