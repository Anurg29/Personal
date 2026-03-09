"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Bot, Trash2 } from "lucide-react";

export function ChatInterface() {
  const { messages, isStreaming, sendMessage, stopStreaming, clearMessages } =
    useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Chat header */}
      <div className="flex items-center justify-between pb-4 border-b border-jarvis-border mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-jarvis-cyan/10 flex items-center justify-center">
            <Bot size={18} className="text-jarvis-cyan" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-jarvis-text tracking-wider">
              J.A.R.V.I.S.
            </h2>
            <p className="font-mono text-[10px] text-jarvis-muted tracking-wide">
              {isStreaming ? "Processing..." : "Online"}
            </p>
          </div>
          <div
            className={`w-2 h-2 rounded-full ${
              isStreaming
                ? "bg-yellow-400 animate-pulse"
                : "bg-green-500"
            }`}
          />
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-jarvis-muted hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-jarvis-surface cursor-pointer"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-jarvis-cyan/5 border border-jarvis-border flex items-center justify-center mb-4">
              <Bot size={28} className="text-jarvis-cyan/40" />
            </div>
            <p className="font-orbitron text-sm text-jarvis-muted tracking-wide mb-1">
              J.A.R.V.I.S. at your service
            </p>
            <p className="text-xs text-jarvis-muted/60 max-w-sm">
              Ask me anything about code, projects, or ideas. I&apos;m here to
              help.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isStreaming &&
          messages[messages.length - 1]?.content === "" && (
            <TypingIndicator />
          )}
      </div>

      {/* Input area */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  );
}
