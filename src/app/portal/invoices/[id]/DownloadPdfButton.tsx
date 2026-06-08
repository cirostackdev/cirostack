"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DownloadPdfButton({ invoiceId, invoiceNumber }: { invoiceId: string; invoiceNumber: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/invoices/${invoiceId}/pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.detail || data?.error || "Failed to generate PDF. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={loading}>
      <Download className="w-4 h-4 mr-1.5" />
      {loading ? "Generating…" : "Download PDF"}
    </Button>
  );
}
