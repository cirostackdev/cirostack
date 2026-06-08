"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV = [
  { href: "/portal/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portal/projects", icon: FolderKanban, label: "Projects" },
  { href: "/portal/invoices", icon: Receipt, label: "Invoices" },
  { href: "/portal/chat", icon: MessageSquare, label: "Messages" },
  { label: "—", divider: true },
  { href: "/portal/settings", icon: Settings, label: "Settings" },
];

// Nav items shown in the mobile bottom bar (main 4 only)
const BOTTOM_NAV = [
  { href: "/portal/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/portal/projects", icon: FolderKanban, label: "Projects" },
  { href: "/portal/invoices", icon: Receipt, label: "Invoices" },
  { href: "/portal/chat", icon: MessageSquare, label: "Messages" },
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

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[57px]">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
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
              className="shrink-0 ml-1 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item, i) => {
          if ("divider" in item)
            return collapsed ? null : (
              <div key={i} className="my-1 border-t border-border/50" />
            );
          const { href, icon: Icon, label } = item as {
            href: string;
            icon: React.ElementType;
            label: string;
          };
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                collapsed ? "justify-center px-2" : "px-3"
              } ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/portal/login" })}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-2.5 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[44px] ${
            collapsed ? "justify-center px-2" : "px-3"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar only */}
      <aside
        className={`hidden lg:flex ${
          collapsed ? "w-14" : "w-56"
        } shrink-0 border-r border-border flex-col bg-muted/30 transition-[width] duration-200`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Image src={logo} alt="CiroStack" width={22} height={22} className="object-contain shrink-0" />
            <span className="font-semibold text-sm truncate">Client Portal</span>
          </div>
          {title && (
            <h1 className="text-sm lg:text-base font-medium text-muted-foreground truncate ml-4">{title}</h1>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6">{children}</div>
      </main>

      {/* Mobile bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border flex items-stretch safe-bottom">
        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
