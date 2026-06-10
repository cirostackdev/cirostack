"use client";

import { X } from "lucide-react";

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
    replyTo,
    setReplyTo,
    unreadWhileScrolled,
    setUnreadWhileScrolled,
    isScrolledUpRef,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    sendFile,
    sendTyping,
    resetConversation,
  } = useChat();

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {/* Tooltip label */}
          <span className="bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-md pointer-events-none select-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap">
            {agentOnline ? "Chat with us" : "Leave a message"}
          </span>

          <button
            onClick={openChat}
            aria-label={agentOnline ? "Chat with us" : "Leave a message"}
            className="group relative hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <img src="/live-chat.png" alt="" className="w-14 h-14" />
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
          className="fixed z-50 flex flex-col bg-background border border-border shadow-2xl overflow-hidden bottom-0 right-0 left-0 h-[85dvh] rounded-t-2xl sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px] sm:h-[560px] sm:max-h-[85dvh] sm:rounded-2xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)", animation: "slideUp 0.2s ease-out" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/live-chat-white.png" alt="" className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold">CiroStack Support</p>
                <p className="text-[11px] opacity-80">
                  {agentOnline
                    ? "Online · Usually replies in minutes"
                    : "Offline · We'll reply as soon as possible"}
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
                onSendFile={(file) => sendFile(file, "/api/chat/upload")}
                onSendTyping={sendTyping}
                onReset={resetConversation}
                replyTo={replyTo}
                onClearReply={() => setReplyTo(null)}
                onSetReply={(msg) => setReplyTo(msg)}
                unreadWhileScrolled={unreadWhileScrolled}
                onClearUnread={() => setUnreadWhileScrolled(0)}
                isScrolledUpRef={isScrolledUpRef}
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
