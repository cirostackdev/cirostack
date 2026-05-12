import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { format } from "date-fns";
import { Mail, Tag } from "lucide-react";

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <AdminShell title="Leads">
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          {leads.length} total lead{leads.length !== 1 ? "s" : ""}
        </p>

        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Email</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Source</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Tags</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Added</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-xs">
                    No leads yet.
                  </td>
                </tr>
              )}
              {leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{lead.name || "—"}</td>
                  <td className="px-4 py-2.5">
                    {lead.source ? (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                        {lead.source}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.length > 0 ? (
                        lead.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {format(new Date(lead.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
