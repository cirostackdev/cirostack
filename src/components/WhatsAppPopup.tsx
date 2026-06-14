"use client";

/**
 * ChatEngagementPopup.tsx
 *
 * Behavior-triggered popup that encourages visitors to start a conversation
 * via the on-site chat widget. Uses smart triggers (scroll, time, engagement)
 * with page-specific messaging.
 *
 * ─── PAGE → MESSAGE MAPPING ─────────────────────────────────────────────────
 * Edit PAGE_MESSAGES to customize. Keys matched top-to-bottom; first match wins.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, MessageSquare } from "lucide-react";

/* ─── Configuration ──────────────────────────────────────────────────────── */

type MessageConfig = {
    label: string;
    headline: string;
    subtext: string;
    contextId: string;
};

const PAGE_MESSAGES: { match: string; config: MessageConfig }[] = [
    {
        match: "/about",
        config: {
            label: "Chat with us",
            headline: "Want to know more about us?",
            subtext:
                "Our team is online. Ask anything about our story, process, or how we can help your project.",
            contextId: "about-page",
        },
    },
    {
        match: "/services/",
        config: {
            label: "Talk to an engineer",
            headline: "Have a project in mind?",
            subtext:
                "Get free advice from our engineers. Describe your idea and we'll help you plan the best approach.",
            contextId: "services-page",
        },
    },
    {
        match: "/blog/*",
        config: {
            label: "Ask a question",
            headline: "Have questions about this topic?",
            subtext:
                "Our team can dive deeper on anything you've read. Start a conversation — no commitment needed.",
            contextId: "blog-page",
        },
    },
    {
        match: "default",
        config: {
            label: "Start a conversation",
            headline: "Need help with something?",
            subtext:
                "Our team typically responds within minutes. Ask about our services, get a quote, or just say hello.",
            contextId: "general",
        },
    },
];

/* ─── Trigger thresholds ─────────────────────────────────────────────────── */
const SCROLL_DEPTH_THRESHOLD = 0.6;   // 60 %
const TIME_ON_PAGE_MS = 30_000; // 30 s
const ENGAGEMENT_THRESHOLD = 40;

/* ─── Suppression keys ───────────────────────────────────────────────────── */
const DISMISS_LS_KEY = "chat_popup_dismissed_until"; // localStorage : 48 h
const SESSION_SK_KEY = "chat_popup_shown_paths";      // sessionStorage: per session

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function resolveMessage(pathname: string): MessageConfig {
    for (const { match, config } of PAGE_MESSAGES) {
        if (match === "default") return config;
        if (match.endsWith("/*")) {
            const prefix = match.slice(0, -2);
            if (pathname === prefix || pathname.startsWith(prefix + "/")) return config;
        } else if (pathname === match || pathname.startsWith(match + "/")) {
            return config;
        }
    }
    return PAGE_MESSAGES[PAGE_MESSAGES.length - 1].config;
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

/* ─── Component ──────────────────────────────────────────────────────────── */

export function WhatsAppPopup() {
    const pathname = usePathname();

    const [visible, setVisible] = useState(false);
    const [rendered, setRendered] = useState(false);

    const pathnameRef = useRef(pathname);
    const firedRef = useRef(false);
    const engagementRef = useRef(0);
    const mouseIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messageRef = useRef<MessageConfig>(resolveMessage(pathname));

    useEffect(() => {
        pathnameRef.current = pathname;
        messageRef.current = resolveMessage(pathname);
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

        pushDataLayer("chat_popup_show", {
            trigger_type: triggerType,
            page_path: pathnameRef.current,
            context_id: messageRef.current.contextId,
        });
    }

    /* ── Trigger 1: scroll depth ─────────────────────────────────────────── */
    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (depth >= SCROLL_DEPTH_THRESHOLD) tryShow("scroll_depth");

            if (window.scrollY < lastY - 80) engagementRef.current += 20;
            lastY = window.scrollY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Trigger 2: time on page ─────────────────────────────────────────── */
    useEffect(() => {
        const timer = setTimeout(() => tryShow("time_on_page"), TIME_ON_PAGE_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

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
    }, []);

    /* ── Handlers ────────────────────────────────────────────────────────── */
    function handleCTA() {
        pushDataLayer("chat_popup_click", {
            trigger_type: "user_click",
            page_path: pathnameRef.current,
            context_id: messageRef.current.contextId,
        });

        // Open the chat widget by dispatching a custom event
        window.dispatchEvent(new CustomEvent("open-chat-widget"));

        // Dismiss the popup
        setVisible(false);
        setTimeout(() => setRendered(false), 400);
    }

    function handleDismiss() {
        pushDataLayer("chat_popup_dismiss", {
            trigger_type: "user_dismiss",
            page_path: pathnameRef.current,
            context_id: messageRef.current.contextId,
        });
        localStorage.setItem(DISMISS_LS_KEY, String(Date.now() + 48 * 60 * 60 * 1000));
        setVisible(false);
        setTimeout(() => setRendered(false), 400);
    }

    /* ── Render ──────────────────────────────────────────────────────────── */
    if (!rendered) return null;

    const msg = messageRef.current;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Start a conversation"
            className={[
                "fixed bottom-24 right-6 z-[49]",
                "w-[340px] max-w-[calc(100vw-3rem)]",
                "bg-card border border-border/50 rounded-2xl shadow-2xl",
                "transition-all duration-400 ease-out",
                visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0 pointer-events-none",
            ].join(" ")}
        >
            {/* Top accent stripe */}
            <div className="h-1 w-full rounded-t-2xl bg-primary" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">
                                Live Chat
                            </p>
                            <h3 className="font-display font-bold text-foreground text-base leading-snug">
                                {msg.headline}
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
                    {msg.subtext}
                </p>

                {/* CTA button */}
                <button
                    id="chat-popup-cta"
                    onClick={handleCTA}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    {msg.label}
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
