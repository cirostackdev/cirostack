"use client";

import { X } from "lucide-react";

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M8 10l2.5 2.5L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="13" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
import { useChat } from "./useChat";
import { PreChatForm } from "./PreChatForm";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const {
    messages,
    status,
    agentOnline,
    agentTyping,
    conversationId,
    isOpen,
    showPreChat,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    sendTyping,
    resetConversation,
  } = useChat();

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Tooltip label */}
          <span className="bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-md pointer-events-none select-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap">
            {agentOnline ? "Chat with us" : "Leave a message"}
          </span>

          <button
            onClick={openChat}
            aria-label={agentOnline ? "Chat with us" : "Leave a message"}
            className="group relative w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
          >
            <ChatIcon className="w-6 h-6" />
            {/* Online indicator */}
            {agentOnline && (
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
          className="fixed bottom-6 right-6 z-50 flex flex-col w-[340px] h-[520px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          style={{ animation: "slideUp 0.2s ease-out" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <ChatIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">CiroStack Support</p>
                <p className="text-[11px] opacity-80">
                  {agentOnline ? "Usually replies in minutes" : "We'll reply via email"}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              aria-label="Close chat"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            {showPreChat ? (
              <PreChatForm onSubmit={startChat} />
            ) : (
              <ChatPanel
                messages={messages}
                agentTyping={agentTyping}
                agentOnline={agentOnline}
                isConnected={status === "connected"}
                conversationId={conversationId}
                onSendMessage={sendMessage}
                onSendTyping={sendTyping}
                onReset={resetConversation}
              />
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
