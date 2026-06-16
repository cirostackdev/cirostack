"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  variant?: "dark" | "light";
}

export default function WaitlistForm({ variant = "light" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn(
        "flex items-center gap-2 px-5 py-3 rounded-full",
        isDark ? "bg-[#10B981]/10 border border-[#10B981]/30" : "bg-[#10B981]/5 border border-[#10B981]/20"
      )}>
        <svg className="h-5 w-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-foreground")}>
          You&apos;re in! We&apos;ll notify you at launch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setErrorMsg(""); }}
          placeholder="Enter your email"
          className={cn(
            "flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-colors",
            isDark
              ? "bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#E53935]/50"
              : "bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-[#E53935]/50"
          )}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-full bg-[#E53935] text-white text-sm font-semibold hover:bg-[#D32F2F] transition-colors disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "..." : "Get early access"}
        </button>
      </div>
      {status === "error" && errorMsg && (
        <p className={cn("text-xs mt-2 ml-4", isDark ? "text-red-400" : "text-destructive")}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
