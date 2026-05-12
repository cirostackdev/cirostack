"use client";

import { X, MessageSquare } from "lucide-react";
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
        <button
          onClick={openChat}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground shadow-lg rounded-full pl-4 pr-5 py-3 hover:opacity-90 active:scale-95 transition-all duration-150 group"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">
            {agentOnline ? "Chat with us" : "Leave a message"}
          </span>
          {agentOnline && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </button>
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
                <MessageSquare className="w-4 h-4" />
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
