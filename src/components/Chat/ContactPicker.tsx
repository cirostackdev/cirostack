"use client";

import { useEffect, useState } from "react";
import { X, Check, User, Globe, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from "lucide-react";

interface Client {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
}

interface ContactPickerProps {
  onSend: (body: string) => void;
  onClose: () => void;
}

const SOCIAL_LINKS = [
  { id: "website", label: "Website", handle: "cirostack.com", url: "https://cirostack.com", icon: Globe, color: "text-blue-500" },
  { id: "instagram", label: "Instagram", handle: "@cirostack", url: "https://instagram.com/cirostack", icon: Instagram, color: "text-pink-500" },
  { id: "twitter", label: "Twitter / X", handle: "@cirostack", url: "https://twitter.com/cirostack", icon: Twitter, color: "text-sky-500" },
  { id: "linkedin", label: "LinkedIn", handle: "CiroStack", url: "https://linkedin.com/company/cirostack", icon: Linkedin, color: "text-blue-600" },
  { id: "youtube", label: "YouTube", handle: "CiroStack", url: "https://youtube.com/@cirostack", icon: Youtube, color: "text-red-500" },
  { id: "whatsapp", label: "WhatsApp", handle: "+1 (800) CIRO", url: "https://wa.me/cirostack", icon: MessageCircle, color: "text-green-500" },
];

export function ContactPicker({ onSend, onClose }: ContactPickerProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"social" | "clients">("social");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => {
        setClients(Array.isArray(data) ? data : data.clients ?? []);
        setLoading(false);
      })
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
    const social = SOCIAL_LINKS.filter((s) => selected.has(s.id)).map((s) => ({ id: s.id, label: s.label, handle: s.handle, url: s.url }));
    const clientItems = clients.filter((c) => selected.has(c.id)).map((c) => ({ name: c.name, email: c.email, company: c.company }));
    if (!social.length && !clientItems.length) return;
    onSend(`__CONTACT__${JSON.stringify({ social, clients: clientItems })}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="font-semibold text-sm">Select Contacts</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          {(["social", "clients"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors ${
                tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "social" ? "Social Media" : "Clients"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tab === "social" && SOCIAL_LINKS.map(({ id, label, handle, icon: Icon, color }) => {
            const active = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {active && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{handle}</p>
                </div>
              </button>
            );
          })}

          {tab === "clients" && loading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
          {tab === "clients" && !loading && clients.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No clients found.</p>}
          {tab === "clients" && clients.map((c) => {
            const active = selected.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {active && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}{c.company ? ` · ${c.company}` : ""}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-border shrink-0">
          <button
            onClick={handleSend}
            disabled={selected.size === 0}
            className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Send Contacts ({selected.size} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
