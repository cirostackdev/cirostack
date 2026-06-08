"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  BookOpen,
  Briefcase,
  FolderKanban,
  Receipt,
  ImageIcon,
  Calendar,
  Download,
  Megaphone,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/admin/submissions", icon: FileText, label: "Submissions" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { label: "—", divider: true },
  { href: "/admin/cms/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/cms/portfolio", icon: ImageIcon, label: "Portfolio" },
  { href: "/admin/cms/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/admin/cms/events", icon: Calendar, label: "Events" },
  { href: "/admin/cms/resources", icon: Download, label: "Resources" },
  { href: "/admin/cms/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/cms/news", icon: Newspaper, label: "News" },
  { label: "—", divider: true },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/invoices", icon: Receipt, label: "Invoices" },
  { label: "—", divider: true },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminShell({
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

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[57px]">
        {mobile ? (
          <>
            <div className="flex items-center gap-2">
              <Image src={logo} alt="CiroStack" width={22} height={22} className="object-contain shrink-0" />
              <span className="font-semibold text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : collapsed ? (
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
              <span className="font-semibold text-sm truncate">Admin Panel</span>
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
          const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
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
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border space-y-0.5">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={!mobile && collapsed ? "Toggle theme" : undefined}
          className={`flex items-center gap-2.5 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            !mobile && collapsed ? "justify-center px-2" : "px-3"
          }`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          {(mobile || !collapsed) && (theme === "dark" ? "Light mode" : "Dark mode")}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={!mobile && collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-2.5 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            !mobile && collapsed ? "justify-center px-2" : "px-3"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {(mobile || !collapsed) && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
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
        <SidebarContent mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex ${
          collapsed ? "w-14" : "w-56"
        } shrink-0 border-r border-border flex-col bg-muted/30 transition-[width] duration-200`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {title && <h1 className="text-base font-semibold truncate">{title}</h1>}
        </div>

        {/* Desktop title bar */}
        {title && (
          <div className="hidden lg:block px-6 py-4 border-b border-border">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
