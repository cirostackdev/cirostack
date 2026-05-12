"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface PreChatFormProps {
  onSubmit: (data: { name?: string; email?: string; topic?: string }) => void;
}

export function PreChatForm({ onSubmit }: PreChatFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name || undefined, email: email || undefined, topic: topic || undefined });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 text-center">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-sm">Start a conversation</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Fill in a few details to help us assist you better, or skip and start chatting right away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Name <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
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

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            What do you need help with? <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a topic</option>
            <option value="Project enquiry">Project enquiry</option>
            <option value="Pricing & budget">Pricing &amp; budget</option>
            <option value="Technical question">Technical question</option>
            <option value="Partnership">Partnership</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start chatting
          </button>
          <button
            type="button"
            onClick={() => onSubmit({})}
            className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip and chat anonymously
          </button>
        </div>
      </form>
    </div>
  );
}
