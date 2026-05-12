"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
} from "lucide-react";

const NAV = [
  { href: "/admin/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/admin/submissions", icon: FileText, label: "Submissions" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { label: "—", divider: true },
  { href: "/admin/cms/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/cms/jobs", icon: Briefcase, label: "Jobs" },
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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border flex flex-col bg-muted/30">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((item) => {
            if ("divider" in item) return <div key={Math.random()} className="my-1 border-t border-border/50" />;
            const { href, icon: Icon, label } = item as { href: string; icon: React.ElementType; label: string };
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
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
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
