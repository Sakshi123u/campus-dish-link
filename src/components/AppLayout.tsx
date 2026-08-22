import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Home,
  UtensilsCrossed,
  ClipboardList,
  MapPin,
  User as UserIcon,
  LayoutDashboard,
  Bell,
  ChefHat,
  CheckCircle2,
  Archive,
  Store,
  Activity,
  MessageSquare,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { Brand } from "./Brand";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/data";

type NavItem = { label: string; to: string; icon: typeof Home };

const STUDENT_NAV: NavItem[] = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Menu", to: "/menu", icon: UtensilsCrossed },
  { label: "My Orders", to: "/my-orders", icon: ClipboardList },
  { label: "Track Order", to: "/track", icon: MapPin },
  { label: "Profile", to: "/profile", icon: UserIcon },
];

const STAFF_NAV: NavItem[] = [
  { label: "Dashboard", to: "/stall", icon: LayoutDashboard },
  { label: "New Orders", to: "/stall/new", icon: Bell },
  { label: "Preparing", to: "/stall/preparing", icon: ChefHat },
  { label: "Ready", to: "/stall/ready", icon: CheckCircle2 },
  { label: "Completed", to: "/stall/completed", icon: Archive },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Stalls", to: "/admin/stalls", icon: Store },
  { label: "System Monitor", to: "/admin/monitor", icon: Activity },
  { label: "P2P Communication", to: "/admin/p2p", icon: MessageSquare },
];

const NAV: Record<Role, NavItem[]> = {
  student: STUDENT_NAV,
  staff: STAFF_NAV,
  admin: ADMIN_NAV,
};

export function AppLayout({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: ReactNode;
}) {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (user && user.role !== role) navigate({ to: "/" });
  }, [user, role, navigate]);

  const items = NAV[role];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border px-5 py-4">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="m-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            {role === "student" && (
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 md:hidden"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 md:hidden">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${
                pathname === item.to
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
