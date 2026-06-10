"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect, createContext, useContext } from "react";

// Context that child pages use to inject actions into the shell header
export const PortalHeaderActionsContext = createContext<(el: React.ReactNode) => void>(() => {});
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  FolderOpen,
  Bell,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/portal/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portal/projects", icon: FolderKanban, label: "Projects" },
  { href: "/portal/invoices", icon: Receipt, label: "Invoices" },
  { href: "/portal/files", icon: FolderOpen, label: "Files" },
  { href: "/portal/chat", icon: MessageSquare, label: "Messages" },
  { href: "/portal/notifications", icon: Bell, label: "Notifications" },
  { label: "—", divider: true },
  { href: "/portal/settings", icon: Settings, label: "Settings" },
];

export function PortalShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  // Portal client presence heartbeat
  useEffect(() => {
    const beat = () => fetch("/api/portal/presence", { method: "POST" }).catch(() => {});
    beat();
    const interval = setInterval(beat, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCount = () => {
      fetch("/api/portal/notifications/count")
        .then((r) => r.ok ? r.json() : null)
        .then((data: { unread: number } | null) => {
          if (data && typeof data.unread === "number") setUnreadCount(data.unread);
        })
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
      {NAV.map((item, i) => {
        if ("divider" in item)
          return !mobile && collapsed ? null : (
            <div key={i} className="my-1 border-t border-border/50" />
          );
        const { href, icon: Icon, label } = item as {
          href: string;
          icon: React.ElementType;
          label: string;
        };
        const active = pathname === href || pathname.startsWith(href + "/");
        const isCollapsed = !mobile && collapsed;
        return (
          <Link
            key={href}
            href={href}
            title={isCollapsed ? label : undefined}
            onClick={() => mobile && setMobileOpen(false)}
            className={`flex items-center gap-2.5 py-2 rounded-lg text-sm transition-colors ${
              isCollapsed ? "justify-center px-2" : "px-3"
            } ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <div className="relative shrink-0">
              <Icon className="w-4 h-4" />
              {href === "/portal/notifications" && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
            {!isCollapsed && label}
            {href === "/portal/notifications" && !isCollapsed && unreadCount > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const BottomActions = ({ mobile = false }: { mobile?: boolean }) => {
    const isCollapsed = !mobile && collapsed;
    return (
      <div className="p-2 border-t border-border space-y-0.5">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={isCollapsed ? "Toggle theme" : undefined}
          className={`flex items-center gap-2.5 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            isCollapsed ? "justify-center px-2" : "px-3"
          }`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          {!isCollapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/portal/login" })}
          title={isCollapsed ? "Sign out" : undefined}
          className={`flex items-center gap-2.5 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            isCollapsed ? "justify-center px-2" : "px-3"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && "Sign out"}
        </button>
      </div>
    );
  };

  return (
    <PortalHeaderActionsContext.Provider value={setHeaderActions}>
    <div className="flex bg-background text-foreground overflow-hidden" style={{ height: "100dvh" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-background border-r border-border transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[57px]">
          <div className="flex items-center gap-2 min-w-0">
            <Image src={logo} alt="CiroStack" width={22} height={22} className="object-contain shrink-0" />
            <span className="font-semibold text-sm truncate">Client Portal</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks mobile />
        <BottomActions mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex ${
          collapsed ? "w-14" : "w-56"
        } shrink-0 border-r border-border flex-col bg-muted/30 transition-[width] duration-200`}
      >
        {/* Desktop sidebar header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[57px]">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <Image src={logo} alt="CiroStack" width={22} height={22} className="object-contain shrink-0" />
                <span className="font-semibold text-sm truncate">Client Portal</span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="shrink-0 ml-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        <NavLinks />
        <BottomActions />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 border-b border-border shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {title && <h1 className="text-base font-semibold truncate flex-1">{title}</h1>}
          {headerActions && <div className="flex items-center gap-1.5 shrink-0">{headerActions}</div>}
        </div>

        {/* Desktop title bar */}
        {title && (
          <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <h1 className="text-lg font-semibold">{title}</h1>
            {headerActions && <div className="flex items-center gap-1.5">{headerActions}</div>}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
    </PortalHeaderActionsContext.Provider>
  );
}
