"use client";

interface ChatBubbleProps {
  sender: "user" | "ai";
  text: string;
}

function ChatBubble({ sender, text }: ChatBubbleProps) {
  const isAi = sender === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-2`}>
      <div
        className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[9px] leading-relaxed ${
          isAi
            ? "bg-[#0F1629] border border-[#7C3AED]/30 text-white/90"
            : "bg-[#E53935] text-white"
        }`}
      >
        {isAi && <p className="text-[#A78BFA] text-[8px] font-medium mb-0.5">Cipher AI</p>}
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function CipherScreen() {
  return (
    <div className="h-full bg-[#0A0E1A] p-3 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1E2A45]/50">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E53935] flex items-center justify-center">
          <span className="text-[8px] font-bold">AI</span>
        </div>
        <div>
          <p className="text-[10px] font-medium">Cipher AI Tutor</p>
          <p className="text-[8px] text-white/40">Lesson 12: Async Patterns</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-hidden space-y-1">
        <ChatBubble sender="user" text="Why does await only work inside async functions?" />
        <ChatBubble
          sender="ai"
          text="Great question! The await keyword pauses execution until a Promise resolves. It needs async because the function must return a Promise itself — the caller needs to know it's asynchronous."
        />
        <ChatBubble sender="user" text="So the function becomes a Promise too?" />
        <ChatBubble
          sender="ai"
          text="Exactly! When you mark a function async, its return value is automatically wrapped in Promise.resolve(). This is why you can await an async function from another async function."
        />
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2">
        <div className="flex-1 bg-[#0F1629] border border-[#1E2A45]/50 rounded-full px-3 py-1.5 text-[9px] text-white/40">
          Ask Cipher anything...
        </div>
        <div className="h-7 w-7 rounded-full bg-[#7C3AED] flex items-center justify-center shrink-0">
          <span className="text-white text-[10px]">↑</span>
        </div>
      </div>
    </div>
  );
}
