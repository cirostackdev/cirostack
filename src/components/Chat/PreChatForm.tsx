"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const TOPICS = [
  "Project enquiry",
  "Pricing & budget",
  "Technical question",
  "Partnership",
  "Other",
];

interface PreChatFormProps {
  onSubmit: (data: { name?: string; email?: string; topic?: string }) => void;
}

export function PreChatForm({ onSubmit }: PreChatFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name || undefined, email: email || undefined, topic: topic || undefined });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-sm">Start a conversation</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Tell us a bit about yourself so we can assist you better.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Email <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div ref={dropdownRef} className="relative">
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            What do you need help with? <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary flex items-center justify-between text-left"
          >
            <span className={topic ? "text-foreground" : "text-muted-foreground"}>
              {topic || "Select a topic"}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-10">
              {TOPICS.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => { setTopic(t); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${topic === t ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto pt-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start chatting
          </button>
        </div>
      </form>
    </div>
  );
}
