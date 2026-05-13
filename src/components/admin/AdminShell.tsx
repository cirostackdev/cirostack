"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  MessageSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  FolderKanban,
  Receipt,
  Image,
  Calendar,
  Download,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV = [
  // Inbox
  { href: "/admin/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/admin/submissions", icon: FileText, label: "Submissions" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { label: "—", divider: true },
  // CMS
  { href: "/admin/cms/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/cms/portfolio", icon: Image, label: "Portfolio" },
  { href: "/admin/cms/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/admin/cms/events", icon: Calendar, label: "Events" },
  { href: "/admin/cms/resources", icon: Download, label: "Resources" },
  { href: "/admin/cms/announcements", icon: Megaphone, label: "Announcements" },
  { label: "—", divider: true },
  // Client Portal
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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-14" : "w-56"
        } shrink-0 border-r border-border flex flex-col bg-muted/30 transition-[width] duration-200`}
      >
        {/* Header */}
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
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                </div>
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
              return collapsed ? null : (
                <div key={i} className="my-1 border-t border-border/50" />
              );
            const { href, icon: Icon, label } = item as {
              href: string;
              icon: React.ElementType;
              label: string;
            };
            const active =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-2.5 py-2 rounded-lg text-sm transition-colors ${
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
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title={collapsed ? "Sign out" : undefined}
            className={`flex items-center gap-2.5 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
              collapsed ? "justify-center px-2" : "px-3"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {title && (
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
