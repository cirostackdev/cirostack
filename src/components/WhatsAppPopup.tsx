"use client";

/**
 * WhatsAppPopup.tsx
 *
 * ─── PAGE → GROUP MAPPING ───────────────────────────────────────────────────
 * Edit PAGE_GROUPS to remap pages. Keys matched top-to-bottom; first match wins.
 * Supports:
 *   - Exact path:      "/about"
 *   - Prefix wildcard: "/blog/*"
 *   - Fallback:        "default"
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/* ─── Configuration ──────────────────────────────────────────────────────── */

type GroupConfig = {
    url: string;
    label: string;
    headline: string;
    subtext: string;
    groupId: string;
};

const PAGE_GROUPS: { match: string; config: GroupConfig }[] = [
    {
        match: "/about",
        config: {
            url: "https://chat.whatsapp.com/LINK1",
            label: "Join our Story",
            headline: "Be part of the CiroStack story",
            subtext:
                "Connect with our founders and follow us as we build — early access, behind-the-scenes updates, and direct Q&A.",
            groupId: "website-launchpad",
        },
    },
    {
        match: "/services",
        config: {
            url: "https://chat.whatsapp.com/LINK2",
            label: "Talk to our Team",
            headline: "Speak directly with our engineers",
            subtext:
                "Join our Software Launchpad — ask questions, get free advice, and shortcut your project planning by weeks.",
            groupId: "software-launchpad",
        },
    },
    {
        match: "/blog/*",
        config: {
            url: "https://chat.whatsapp.com/LINK3",
            label: "Join the Discussion",
            headline: "Take the conversation further",
            subtext:
                "Our community group goes deeper — share ideas with founders and engineers who are building right now.",
            groupId: "training-launchpad",
        },
    },
    {
        match: "/industries",
        config: {
            url: "https://chat.whatsapp.com/LINK4",
            label: "Find Industry Specialists",
            headline: "Connect with specialists in your industry",
            subtext:
                "Engineers and founders solving the exact same problems in our free Industry Launchpad group.",
            groupId: "startup-launchpad",
        },
    },
    {
        match: "default",
        config: {
            url: "https://chat.whatsapp.com/LINK4",
            label: "Join our Community",
            headline: "Join 500+ founders & engineers",
            subtext:
                "Free advice, resources and connections from the CiroStack community — zero spam, all signal.",
            groupId: "website-launchpad",
        },
    },
];

/* ─── Trigger thresholds ─────────────────────────────────────────────────── */
const SCROLL_DEPTH_THRESHOLD = 0.6;   // 60 %
const TIME_ON_PAGE_MS = 30_000; // 30 s
const ENGAGEMENT_THRESHOLD = 40;

/* ─── Suppression keys ───────────────────────────────────────────────────── */
const DISMISS_LS_KEY = "wa_popup_dismissed_until"; // localStorage  — 48 h
const SESSION_SK_KEY = "wa_popup_shown_paths";      // sessionStorage — per session

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function resolveGroup(pathname: string): GroupConfig {
    for (const { match, config } of PAGE_GROUPS) {
        if (match === "default") return config;
        if (match.endsWith("/*")) {
            const prefix = match.slice(0, -2);
            if (pathname === prefix || pathname.startsWith(prefix + "/")) return config;
        } else if (pathname === match || pathname.startsWith(match + "/")) {
            return config;
        }
    }
    // fallback (should not reach here because "default" is last)
    return PAGE_GROUPS[PAGE_GROUPS.length - 1].config;
}

function isDismissed(): boolean {
    const until = localStorage.getItem(DISMISS_LS_KEY);
    return !!until && Date.now() < Number(until);
}

function isShownThisSession(pathname: string): boolean {
    try {
        const paths: string[] = JSON.parse(sessionStorage.getItem(SESSION_SK_KEY) ?? "[]");
        return paths.includes(pathname);
    } catch {
        return false;
    }
}

function markShownThisSession(pathname: string) {
    try {
        const paths: string[] = JSON.parse(sessionStorage.getItem(SESSION_SK_KEY) ?? "[]");
        if (!paths.includes(pathname)) {
            sessionStorage.setItem(SESSION_SK_KEY, JSON.stringify([...paths, pathname]));
        }
    } catch { /* ignore */ }
}

function pushDataLayer(event: string, extra: Record<string, string>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dl = (window as any).dataLayer;
    if (Array.isArray(dl)) dl.push({ event, ...extra });
}

/* ─── WhatsApp SVG icon ──────────────────────────────────────────────────── */
function WaIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
        </svg>
    );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function WhatsAppPopup() {
    const pathname = usePathname();

    const [visible, setVisible] = useState(false);
    const [rendered, setRendered] = useState(false);

    // Stable ref that always holds the current pathname — avoids stale closures
    // in event listeners without re-registering them on every render.
    const pathnameRef = useRef(pathname);
    const firedRef = useRef(false);
    const engagementRef = useRef(0);
    const mouseIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const groupRef = useRef<GroupConfig>(resolveGroup(pathname));

    // Sync refs whenever the route changes
    useEffect(() => {
        pathnameRef.current = pathname;
        groupRef.current = resolveGroup(pathname);
        firedRef.current = false;
        engagementRef.current = 0;
        setVisible(false);
        setRendered(false);
    }, [pathname]);

    /* ── Core: show popup ────────────────────────────────────────────────── */
    function tryShow(triggerType: string) {
        if (firedRef.current) return;
        if (isDismissed()) return;
        if (isShownThisSession(pathnameRef.current)) return;

        firedRef.current = true;
        markShownThisSession(pathnameRef.current);

        setRendered(true);
        requestAnimationFrame(() =>
            requestAnimationFrame(() => setVisible(true))
        );

        pushDataLayer("wa_popup_show", {
            trigger_type: triggerType,
            page_path: pathnameRef.current,
            whatsapp_group_id: groupRef.current.groupId,
        });
    }

    /* ── Trigger 1: scroll depth ─────────────────────────────────────────── */
    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (depth >= SCROLL_DEPTH_THRESHOLD) tryShow("scroll_depth");

            // engagement: scroll back up
            if (window.scrollY < lastY - 80) engagementRef.current += 20;
            lastY = window.scrollY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // register once — tryShow reads from refs

    /* ── Trigger 2: time on page ─────────────────────────────────────────── */
    useEffect(() => {
        const timer = setTimeout(() => tryShow("time_on_page"), TIME_ON_PAGE_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]); // reset timer on every route change

    /* ── Trigger 3: engagement score ─────────────────────────────────────── */
    useEffect(() => {
        function check() {
            if (engagementRef.current >= ENGAGEMENT_THRESHOLD) tryShow("engagement");
        }

        const onSelect = () => {
            if (window.getSelection()?.toString().length) {
                engagementRef.current += 15;
                check();
            }
        };

        const onLinkClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest("a")) {
                engagementRef.current += 10;
                check();
            }
        };

        const onMove = () => {
            if (mouseIdleRef.current) clearTimeout(mouseIdleRef.current);
            mouseIdleRef.current = setTimeout(() => {
                engagementRef.current += 15;
                check();
            }, 8_000);
        };

        document.addEventListener("selectionchange", onSelect);
        document.addEventListener("click", onLinkClick);
        document.addEventListener("mousemove", onMove);

        return () => {
            document.removeEventListener("selectionchange", onSelect);
            document.removeEventListener("click", onLinkClick);
            document.removeEventListener("mousemove", onMove);
            if (mouseIdleRef.current) clearTimeout(mouseIdleRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // register once — reads from refs

    /* ── Handlers ────────────────────────────────────────────────────────── */
    function handleCTA() {
        const g = groupRef.current;
        pushDataLayer("wa_popup_click", {
            trigger_type: "user_click",
            page_path: pathnameRef.current,
            whatsapp_group_id: g.groupId,
        });
        window.open(g.url, "_blank", "noopener,noreferrer");
    }

    function handleDismiss() {
        pushDataLayer("wa_popup_dismiss", {
            trigger_type: "user_dismiss",
            page_path: pathnameRef.current,
            whatsapp_group_id: groupRef.current.groupId,
        });
        localStorage.setItem(DISMISS_LS_KEY, String(Date.now() + 48 * 60 * 60 * 1000));
        setVisible(false);
        setTimeout(() => setRendered(false), 400);
    }

    /* ── Render ──────────────────────────────────────────────────────────── */
    if (!rendered) return null;

    const group = groupRef.current;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Join our WhatsApp community"
            className={[
                "fixed bottom-6 right-6 z-50",
                "w-[340px] max-w-[calc(100vw-3rem)]",
                "bg-card border border-border/50 rounded-2xl shadow-2xl",
                "transition-all duration-400 ease-out",
                visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0 pointer-events-none",
            ].join(" ")}
        >
            {/* Top accent stripe — WhatsApp green */}
            <div className="h-1 w-full rounded-t-2xl bg-[#25D366]" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                            <WaIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#25D366]">
                                WhatsApp
                            </p>
                            <h3 className="font-display font-bold text-foreground text-base leading-snug">
                                {group.headline}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        aria-label="Close"
                        className="shrink-0 w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {group.subtext}
                </p>

                {/* CTA button — WhatsApp green (brand colour, intentionally off-palette) */}
                <button
                    id="wa-popup-cta"
                    onClick={handleCTA}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <WaIcon className="w-4 h-4 text-white shrink-0" />
                    {group.label}
                </button>

                {/* Soft dismiss */}
                <p className="text-center mt-3">
                    <button
                        onClick={handleDismiss}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                    >
                        No thanks
                    </button>
                </p>
            </div>
        </div>
    );
}
