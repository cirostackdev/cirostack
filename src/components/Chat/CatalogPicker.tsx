"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Check } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  vertical: string;
  service: string;
  slug: string;
}

interface CatalogPickerProps {
  onSend: (body: string) => void;
  onClose: () => void;
}

export function CatalogPicker({ onSend, onClose }: CatalogPickerProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms/portfolio")
      .then((r) => r.ok ? r.json() : [])
      .then((data: PortfolioItem[]) => { setItems(data.filter((p: any) => p.published)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    const chosen = items.filter((i) => selected.has(i.id));
    if (!chosen.length) return;
    const lines = chosen.map((p) =>
      `📁 *${p.title}*\n${p.service} · ${p.vertical}\nhttps://cirostack.com/portfolio/${p.slug}`
    );
    onSend(`📂 *Catalog — Selected Projects*\n\n${lines.join("\n\n")}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="font-semibold text-sm">Select Portfolio Projects</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
          {!loading && items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No published projects found.</p>}
          {items.map((item) => {
            const active = selected.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? "border-primary bg-primary" : "border-muted-foreground/40"
                }`}>
                  {active && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.service} · {item.vertical}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <button
            onClick={handleSend}
            disabled={selected.size === 0}
            className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Send Catalog ({selected.size} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
