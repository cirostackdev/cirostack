"use client";

import type { ComponentType } from "react";
import { ExternalLink, MapPin, Globe, Instagram, Twitter, Linkedin, Youtube, MessageCircle, User } from "lucide-react";

// --- Types ---
type Project = { title: string; service: string; vertical: string; slug: string };
type SocialItem = { id: string; label: string; handle: string; url: string };
type ClientItem = { name: string | null; email: string; company: string | null };
type EventItem = { title: string; type: string; date: string; time: string; location: string; registrationUrl: string | null };

type CatalogPayload = { projects: Project[] };
type ContactPayload = { social: SocialItem[]; clients: ClientItem[] };
type EventPayload = { events: EventItem[] };

// ─── Backward-compat parsers for old plain-text format ───────────────────────

function parseOldCatalog(body: string): CatalogPayload | null {
  if (!body.includes("📁 *")) return null;
  const projects: Project[] = [];
  const parts = body.split("📁 *").slice(1);
  for (const part of parts) {
    const titleEnd = part.indexOf("*");
    if (titleEnd === -1) continue;
    const title = part.slice(0, titleEnd).trim();
    const lines = part.slice(titleEnd + 1).trim().split("\n").filter(Boolean);
    const sv = lines[0] ?? "";
    const [service = "", vertical = ""] = sv.split(" · ").map((s) => s.trim());
    const urlLine = lines.find((l) => l.includes("/portfolio/"));
    const slug = urlLine?.split("/portfolio/")[1]?.trim() ?? "";
    projects.push({ title, service, vertical, slug });
  }
  return projects.length > 0 ? { projects } : null;
}

const OLD_SOCIAL_META: Record<string, { id: string; handle: string }> = {
  "Website": { id: "website", handle: "cirostack.com" },
  "Instagram": { id: "instagram", handle: "@cirostack" },
  "Twitter / X": { id: "twitter", handle: "@cirostack" },
  "LinkedIn": { id: "linkedin", handle: "CiroStack" },
  "YouTube": { id: "youtube", handle: "CiroStack" },
  "WhatsApp": { id: "whatsapp", handle: "+1 (800) CIRO" },
};

function parseOldContact(body: string): ContactPayload | null {
  const social: SocialItem[] = [];
  for (const line of body.split("\n")) {
    const idx = line.indexOf(": http");
    if (idx === -1) continue;
    const label = line.slice(0, idx).trim();
    const url = line.slice(idx + 2).trim();
    const meta = OLD_SOCIAL_META[label];
    if (meta) social.push({ id: meta.id, label, handle: meta.handle, url });
  }
  return social.length > 0 ? { social, clients: [] } : null;
}

function parseOldEvent(body: string): EventPayload | null {
  if (!body.includes("📅 *")) return null;
  const events: EventItem[] = [];
  for (const part of body.split("📅 *").slice(1)) {
    const titleEnd = part.indexOf("*");
    if (titleEnd === -1) continue;
    const title = part.slice(0, titleEnd).trim();
    const lines = part.slice(titleEnd + 1).trim().split("\n").filter(Boolean);
    const typeLine = lines[0] ?? "";
    const dotIdx = typeLine.indexOf(" · ");
    const eventType = dotIdx !== -1 ? typeLine.slice(0, dotIdx).trim() : typeLine;
    const rest = dotIdx !== -1 ? typeLine.slice(dotIdx + 3) : "";
    const atIdx = rest.indexOf(" at ");
    const date = atIdx !== -1 ? rest.slice(0, atIdx).trim() : rest.trim();
    const time = atIdx !== -1 ? rest.slice(atIdx + 4).trim() : "";
    const location = lines.find((l) => l.startsWith("📍"))?.slice(2).trim() ?? "";
    const regLine = lines.find((l) => l.startsWith("Register: "));
    const rawUrl = regLine?.slice("Register: ".length).trim() ?? "";
    const registrationUrl = rawUrl.startsWith("http") ? rawUrl : null;
    events.push({ title, type: eventType, date, time, location, registrationUrl });
  }
  return events.length > 0 ? { events } : null;
}

// ─── Card Components ──────────────────────────────────────────────────────────

function CatalogCard({ data }: { data: CatalogPayload }) {
  return (
    <div className="w-full min-w-[220px] max-w-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold">Portfolio Catalog</span>
      </div>
      <div className="space-y-2">
        {data.projects.map((p, i) => (
          <a
            key={i}
            href={p.slug ? `https://cirostack.com/portfolio/${p.slug}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-2.5 hover:bg-muted/40 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm">📂</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-tight">{p.title}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {p.service && <span className="text-[9px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded-full font-medium">{p.service}</span>}
                {p.vertical && <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-medium">{p.vertical}</span>}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

const SOCIAL_ICON: Record<string, ComponentType<{ className?: string }>> = {
  website: Globe, instagram: Instagram, twitter: Twitter, linkedin: Linkedin, youtube: Youtube, whatsapp: MessageCircle,
};
const SOCIAL_BG: Record<string, string> = {
  website: "bg-blue-500/10", instagram: "bg-pink-500/10", twitter: "bg-sky-500/10",
  linkedin: "bg-blue-600/10", youtube: "bg-red-500/10", whatsapp: "bg-green-500/10",
};
const SOCIAL_FG: Record<string, string> = {
  website: "text-blue-500", instagram: "text-pink-500", twitter: "text-sky-500",
  linkedin: "text-blue-600", youtube: "text-red-500", whatsapp: "text-green-500",
};

function ContactCard({ data }: { data: ContactPayload }) {
  return (
    <div className="w-full min-w-[200px] max-w-[280px]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold">Contact Info</span>
      </div>

      {data.social.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {data.social.map((s, i) => {
            const Icon = SOCIAL_ICON[s.id] ?? Globe;
            return (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-2.5 py-2 hover:bg-muted/40 transition-colors group"
              >
                <div className={`w-7 h-7 rounded-full ${SOCIAL_BG[s.id] ?? "bg-muted"} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${SOCIAL_FG[s.id] ?? "text-muted-foreground"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.handle}</p>
                </div>
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
              </a>
            );
          })}
        </div>
      )}

      {data.clients.length > 0 && (
        <div className="space-y-1.5">
          {data.clients.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-2.5 py-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{c.name ?? "—"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{c.email}{c.company ? ` · ${c.company}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ data }: { data: EventPayload }) {
  return (
    <div className="w-full min-w-[220px] max-w-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold">Events</span>
      </div>
      <div className="space-y-2">
        {data.events.map((e, i) => {
          let month = "";
          let day = "";
          let year = "";
          try {
            // Handle both ISO dates and "Jun 18, 2026" style dates
            const d = new Date(e.date);
            if (!isNaN(d.getTime())) {
              month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
              day = String(d.getDate());
              year = String(d.getFullYear());
            } else {
              // Try to parse "Jun 18, 2026" style
              const parts = e.date.split(" ");
              month = (parts[0] ?? "").toUpperCase().slice(0, 3);
              day = (parts[1] ?? "").replace(",", "");
              year = parts[2] ?? "";
            }
          } catch {
            month = e.date.slice(0, 3).toUpperCase();
          }
          return (
            <div key={i} className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
              <div className="px-3 pt-3 pb-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center bg-orange-500/10 rounded-xl px-2 py-1.5 shrink-0 min-w-[44px]">
                    <span className="text-[9px] font-bold text-orange-500 uppercase leading-none tracking-wide">{month}</span>
                    <span className="text-xl font-bold text-orange-500 leading-none my-0.5">{day}</span>
                    <span className="text-[9px] text-orange-400/80 leading-none">{year}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-snug">{e.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{e.type}{e.time ? ` · ${e.time}` : ""}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-2.5 h-2.5 text-muted-foreground/60 shrink-0" />
                      <p className="text-[10px] text-muted-foreground truncate">{e.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              {e.registrationUrl && (
                <a
                  href={e.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 border-t border-border/50 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  Register <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function isStructuredMessage(body: string): boolean {
  // New JSON format
  if (body.startsWith("__CATALOG__") || body.startsWith("__CONTACT__") || body.startsWith("__EVENT__")) return true;
  // Old plain-text format
  if (body.startsWith("📂 *Catalog") && body.includes("📁 *")) return true;
  if (body.startsWith("📇 *Contact Info*")) return true;
  if (body.startsWith("🗓 *Upcoming Events*") && body.includes("📅 *")) return true;
  return false;
}

export function StructuredMessageCard({ body }: { body: string }) {
  // New JSON format
  if (body.startsWith("__CATALOG__")) {
    try { return <CatalogCard data={JSON.parse(body.slice(11))} />; } catch { return null; }
  }
  if (body.startsWith("__CONTACT__")) {
    try { return <ContactCard data={JSON.parse(body.slice(11))} />; } catch { return null; }
  }
  if (body.startsWith("__EVENT__")) {
    try { return <EventCard data={JSON.parse(body.slice(9))} />; } catch { return null; }
  }

  // Old plain-text format (backward compat — existing DB messages)
  if (body.startsWith("📂 *Catalog")) {
    const parsed = parseOldCatalog(body);
    if (parsed) return <CatalogCard data={parsed} />;
  }
  if (body.startsWith("📇 *Contact Info*")) {
    const parsed = parseOldContact(body);
    if (parsed) return <ContactCard data={parsed} />;
  }
  if (body.startsWith("🗓 *Upcoming Events*")) {
    const parsed = parseOldEvent(body);
    if (parsed) return <EventCard data={parsed} />;
  }

  return null;
}
