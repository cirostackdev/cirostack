import Link from "next/link";
import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { clientSignOut } from "@/auth-client";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await clientAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/portal/dashboard" className="font-semibold text-foreground text-sm">
            CiroStack Portal
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {session?.user ? (
              <>
                <Link href="/portal/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link href="/portal/invoices" className="text-muted-foreground hover:text-foreground transition-colors">Invoices</Link>
                <Link href="/portal/settings" className="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
                <form action={async () => {
                  "use server";
                  await clientSignOut({ redirectTo: "/portal/login" });
                }}>
                  <button type="submit" className="text-muted-foreground hover:text-foreground transition-colors">Sign out</button>
                </form>
              </>
            ) : (
              <Link href="/portal/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
