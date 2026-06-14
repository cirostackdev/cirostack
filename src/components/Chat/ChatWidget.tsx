"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageSquare } from "lucide-react";

import { useChat } from "./useChat";
import { PreChatForm } from "./PreChatForm";
import { ChatPanel } from "./ChatPanel";
import { CSATPrompt } from "./CSATPrompt";

interface WidgetConfig {
  primaryColor: string;
  position: string;
  welcomeMessage: string;
  offlineMessage: string;
  preChatForm: boolean;
  preChatFields: any[] | null;
  showBranding: boolean;
  autoOpenDelay: number | null;
}

const DEFAULT_CONFIG: WidgetConfig = {
  primaryColor: "#6366f1",
  position: "bottom-right",
  welcomeMessage: "Hi! How can we help you?",
  offlineMessage: "We're currently offline. Leave a message and we'll get back to you.",
  preChatForm: false,
  preChatFields: null,
  showBranding: true,
  autoOpenDelay: null,
};

export function ChatWidget() {
  const {
    messages,
    status,
    agentOnline,
    agentTyping,
    agentRecording,
    conversationId,
    isOpen,
    showPreChat,
    replyTo,
    setReplyTo,
    unreadWhileScrolled,
    setUnreadWhileScrolled,
    isScrolledUpRef,
    launcherUnread,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    sendFile,
    sendTyping,
    sendRecording,
    resetConversation,
  } = useChat();

  const [showCSAT, setShowCSAT] = useState(false);
  const [csatConvId, setCsatConvId] = useState<string | null>(null);
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_CONFIG);
  const [isBusinessOnline, setIsBusinessOnline] = useState(true);
  const prevStatusRef = useRef(status);
  const autoOpenFiredRef = useRef(false);

  // Fetch widget config from API
  useEffect(() => {
    fetch("/api/widget-config")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.config) setConfig(data.config);
        if (data?.isOnline !== undefined) setIsBusinessOnline(data.isOnline);
      })
      .catch(() => {});
  }, []);

  // Auto-open delay
  useEffect(() => {
    if (!config.autoOpenDelay || autoOpenFiredRef.current) return;
    const timer = setTimeout(() => {
      if (!autoOpenFiredRef.current) {
        autoOpenFiredRef.current = true;
        openChat();
      }
    }, config.autoOpenDelay);
    return () => clearTimeout(timer);
  }, [config.autoOpenDelay, openChat]);

  // Show CSAT prompt when conversation is closed
  useEffect(() => {
    if (prevStatusRef.current === "connected" && status === "idle" && conversationId && messages.length > 0) {
      setCsatConvId(conversationId);
      setShowCSAT(true);
    }
    prevStatusRef.current = status;
  }, [status, conversationId, messages.length]);

  // Listen for external "open-chat-widget" events
  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener("open-chat-widget", handler);
    return () => window.removeEventListener("open-chat-widget", handler);
  }, [openChat]);

  const handleCSATClose = () => {
    setShowCSAT(false);
    setCsatConvId(null);
  };

  const isLeft = config.position === "bottom-left";
  const effectiveOnline = agentOnline && isBusinessOnline;
  const headerMessage = effectiveOnline ? config.welcomeMessage : config.offlineMessage;

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <div
          className={`fixed bottom-4 ${isLeft ? "left-4 sm:left-6" : "right-4 sm:right-6"} sm:bottom-6 z-50 flex flex-col ${isLeft ? "items-start" : "items-end"} gap-2`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={openChat}
            aria-label={effectiveOnline ? "Chat with us" : "Leave a message"}
            className="group relative hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.primaryColor }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            {/* Unread badge */}
            {launcherUnread > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                {launcherUnread > 9 ? "9+" : launcherUnread}
              </span>
            )}
            {/* Online indicator */}
            {effectiveOnline && launcherUnread === 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full">
                <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-background border border-border shadow-2xl overflow-hidden bottom-0 ${isLeft ? "left-0" : "right-0"} ${isLeft ? "sm:left-6" : "sm:right-6"} left-0 right-0 sm:left-auto sm:right-auto h-[85dvh] rounded-t-2xl sm:bottom-6 sm:w-[380px] sm:h-[560px] sm:max-h-[85dvh] sm:rounded-2xl`}
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
            animation: "slideUp 0.2s ease-out",
            ...(isLeft ? { left: undefined, right: undefined } : {}),
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: config.primaryColor, color: "#fff" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Chat with us</p>
                <p className="text-[11px] text-white/80">
                  {effectiveOnline
                    ? "Online · Usually replies in minutes"
                    : "Offline · We'll reply as soon as possible"}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              aria-label="Close chat"
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Welcome/offline banner */}
          {messages.length === 0 && status !== "connected" && (
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <p className="text-xs text-muted-foreground">{headerMessage}</p>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {showPreChat ? (
              <PreChatForm onSubmit={startChat} />
            ) : (
              <>
                <div className="flex-1 overflow-hidden">
                  <ChatPanel
                    messages={messages}
                    agentTyping={agentTyping}
                    agentRecording={agentRecording}
                    agentOnline={effectiveOnline}
                    isConnected={status === "connected"}
                    conversationId={conversationId}
                    onSendMessage={sendMessage}
                    onSendFile={(file) => sendFile(file, "/api/chat/upload")}
                    onSendTyping={sendTyping}
                    onSendRecording={sendRecording}
                    onReset={resetConversation}
                    replyTo={replyTo}
                    onClearReply={() => setReplyTo(null)}
                    onSetReply={(msg) => setReplyTo(msg)}
                    unreadWhileScrolled={unreadWhileScrolled}
                    onClearUnread={() => setUnreadWhileScrolled(0)}
                    isScrolledUpRef={isScrolledUpRef}
                  />
                </div>
                {showCSAT && csatConvId && (
                  <CSATPrompt conversationId={csatConvId} onClose={handleCSATClose} />
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
