"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, RefreshCw } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage as Msg } from "./useChat";

interface ChatPanelProps {
  messages: Msg[];
  agentTyping: boolean;
  agentOnline: boolean;
  isConnected: boolean;
  conversationId: string | null;
  onSendMessage: (body: string) => void;
  onSendTyping: (typing: boolean) => void;
  onReset: () => void;
}

export function ChatPanel({
  messages,
  agentTyping,
  agentOnline,
  isConnected,
  conversationId,
  onSendMessage,
  onSendTyping,
  onReset,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
    onSendTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    onSendTyping(e.target.value.length > 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onSendMessage(url);
      }
    } catch {}
    setUploading(false);
    e.target.value = "";
  };

  const showOfflineForm = !agentOnline && !conversationId;

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${agentOnline ? "bg-green-500" : "bg-yellow-500"}`}
          />
          <span className="text-xs text-muted-foreground">
            {agentOnline ? "We're online" : "Leave a message"}
          </span>
        </div>
        {conversationId && (
          <button
            onClick={onReset}
            title="Start new conversation"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {messages.length === 0 && !showOfflineForm && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm font-medium">How can we help?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Send a message to start chatting with our team.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {agentTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input or offline form */}
      {showOfflineForm ? (
        <OfflineForm />
      ) : (
        <div className="border-t border-border p-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? "Type a message…" : "Connecting…"}
              disabled={!isConnected}
              rows={1}
              className="flex-1 resize-none bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50 max-h-24 overflow-y-auto"
              style={{ fieldSizing: "content" } as any}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!isConnected || uploading}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !isConnected}
              className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
            Powered by CiroStack
          </p>
        </div>
      )}
    </div>
  );
}

function OfflineForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setLoading(true);
    try {
      await fetch("/api/contact/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Chat visitor",
          email,
          service: "Chat enquiry",
          description: message,
        }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm font-semibold">Message sent!</p>
        <p className="text-xs text-muted-foreground mt-1">
          We'll get back to you at {email} as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2">
        We're offline right now. Leave us a message:
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full mb-2 px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message…"
        rows={3}
        className="w-full mb-2 px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
