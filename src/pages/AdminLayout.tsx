import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Tag, ClipboardList, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "DASHBOARD", path: "/admin", icon: LayoutDashboard },
  { label: "PRODUTOS", path: "/admin/produtos", icon: Package },
  { label: "CATEGORIAS", path: "/admin/categorias", icon: Tag },
  { label: "PEDIDOS", path: "/admin/pedidos", icon: ClipboardList },
  { label: "CONFIGURAÇÕES", path: "/admin/configuracoes", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-100 linear ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="font-heading text-lg uppercase text-sidebar-foreground">AÇAÍ EXPRESS</h1>
          <p className="text-xs text-sidebar-foreground/60 font-body mt-1">Painel Admin</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 px-6 py-3 font-heading text-xs uppercase tracking-wider transition-all duration-100 ${
                  isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}>
                <item.icon className="h-4 w-4" fill={isActive ? "currentColor" : "none"} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 px-2 py-2 font-heading text-xs uppercase text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" /> SAIR
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b-2 border-border flex items-center px-4 gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-heading text-sm uppercase">
            {NAV_ITEMS.find((i) => i.path === location.pathname)?.label || "ADMIN"}
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
