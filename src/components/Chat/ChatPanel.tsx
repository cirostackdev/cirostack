"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, MessageSquare, ChevronDown, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { DateSeparator } from "./DateSeparator";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage as Msg } from "./useChat";
import { isSameDay } from "date-fns";
import { ChevronDown as ChevronDownIcon } from "lucide-react";

interface ChatPanelProps {
  messages: Msg[];
  agentTyping: boolean;
  agentOnline: boolean;
  isConnected: boolean;
  conversationId: string | null;
  onSendMessage: (body: string, opts?: { replyToId?: string; replyToBody?: string; replyToSender?: string }) => void;
  onSendTyping: (typing: boolean) => void;
  onReset: () => void;
  replyTo?: Msg | null;
  onClearReply?: () => void;
  onSetReply?: (msg: Msg) => void;
  unreadWhileScrolled?: number;
  onClearUnread?: () => void;
  isScrolledUpRef?: React.MutableRefObject<boolean>;
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
  replyTo,
  onClearReply,
  onSetReply,
  unreadWhileScrolled = 0,
  onClearUnread,
  isScrolledUpRef,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showScrollBtn) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, agentTyping, showScrollBtn]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isScrolledUp = el.scrollTop + el.clientHeight < el.scrollHeight - 100;
    setShowScrollBtn(isScrolledUp);
    if (isScrolledUpRef) isScrolledUpRef.current = isScrolledUp;
    if (!isScrolledUp && onClearUnread) onClearUnread();
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
    if (isScrolledUpRef) isScrolledUpRef.current = false;
    if (onClearUnread) onClearUnread();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim(), replyTo ? {
      replyToId: replyTo.id,
      replyToBody: replyTo.body,
      replyToSender: replyTo.senderName || (replyTo.senderType === "visitor" ? "You" : "Agent"),
    } : undefined);
    setInput("");
    if (onClearReply) onClearReply();
    onSendTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        onSendMessage(url);
      }
    } catch {}
    setUploading(false);
    e.target.value = "";
  };

  const showOfflineForm = (!agentOnline && !conversationId) || isConnected === false && !conversationId;

  // Build date-separated, grouped message list
  const messageItems: Array<{ type: "separator"; date: Date } | { type: "message"; msg: Msg; prev: Msg | null }> = [];
  let lastDate: Date | null = null;
  let lastMsg: Msg | null = null;

  for (const msg of messages) {
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      messageItems.push({ type: "separator", date: msgDate });
      lastDate = msgDate;
    }
    messageItems.push({ type: "message", msg, prev: lastMsg });
    lastMsg = msg;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${agentOnline ? "bg-green-500" : "bg-amber-400"}`} />
          <span className="text-xs text-muted-foreground font-medium">
            {agentOnline ? "We're online · Usually replies in minutes" : "Leave a message"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 relative"
        onScroll={handleScroll}
      >
        {messages.length === 0 && !showOfflineForm && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">How can we help?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Send a message to start chatting with our team.
              </p>
            </div>
          </div>
        )}

        {messageItems.map((item, idx) => {
          if (item.type === "separator") {
            return <DateSeparator key={`sep-${item.date.toISOString()}`} date={item.date} />;
          }
          return (
            <ChatMessage
              key={item.msg.id}
              message={item.msg}
              prevMessage={item.prev}
              conversationId={conversationId}
              onReply={onSetReply}
            />
          );
        })}

        {agentTyping && <TypingIndicator />}
        <div ref={bottomRef} />

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 sm:absolute sm:bottom-4 sm:right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-10"
            aria-label="Scroll to bottom"
          >
            {unreadWhileScrolled > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadWhileScrolled > 9 ? "9+" : unreadWhileScrolled}
              </span>
            )}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Reply bar */}
      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-t border-border/40">
          <div className="flex-1 min-w-0 border-l-2 border-primary/60 pl-2">
            <p className="text-[10px] font-semibold text-muted-foreground">
              {replyTo.senderName || (replyTo.senderType === "visitor" ? "You" : "Agent")}
            </p>
            <p className="text-xs truncate text-muted-foreground">{replyTo.body}</p>
          </div>
          <button onClick={onClearReply} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input */}
      {showOfflineForm ? (
        <OfflineForm />
      ) : (
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-full px-3 h-11 gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Type a message…" : "Connecting…"}
                disabled={!isConnected}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isConnected || uploading}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !isConnected}
              className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
            Powered by CiroStack
          </p>
        </div>
      )}
    </div>
  );
}

const TOPICS = ["Project enquiry", "Pricing & budget", "Technical question", "Partnership", "Other"];

function OfflineForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    try {
      await fetch("/api/contact/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service: topic || "Chat enquiry", description: message, source: "chat" }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold">Message sent!</p>
        <p className="text-xs text-muted-foreground mt-1">We'll get back to you at {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border space-y-2">
      <p className="text-xs text-muted-foreground">We're offline right now — leave us a message:</p>
      <input
        type="text" required value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl outline-none focus:ring-1 focus:ring-primary"
      />
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl outline-none focus:ring-1 focus:ring-primary"
      />
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl outline-none focus:ring-1 focus:ring-primary flex items-center justify-between text-left"
        >
          <span className={topic ? "text-foreground" : "text-muted-foreground"}>
            {topic || "Select a topic (optional)"}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <ul className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-10">
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
      <textarea
        required value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message…" rows={3}
        className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl resize-none outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit" disabled={loading}
        className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
