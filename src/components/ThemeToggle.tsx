"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ showBg }: { showBg?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300",
          showBg
            ? "border-border text-foreground hover:bg-muted"
            : "border-white/30 text-white hover:bg-white/10"
        )}
        aria-label="Toggle theme"
      >
        <Sun size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300",
        showBg
          ? "border-border text-foreground hover:bg-muted"
          : "border-white/30 text-white hover:bg-white/10"
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
