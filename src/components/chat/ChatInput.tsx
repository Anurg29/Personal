"use client";

import { useState, KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-jarvis-border bg-jarvis-base/80 backdrop-blur-xl p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask J.A.R.V.I.S. anything..."
          rows={1}
          className={cn(
            "flex-1 bg-jarvis-surface border border-jarvis-border rounded-lg px-4 py-3 text-sm text-jarvis-text",
            "placeholder:text-jarvis-muted/50 resize-none font-inter",
            "focus:outline-none focus:border-jarvis-cyan/40 focus:shadow-[0_0_0_1px_rgba(0,212,255,0.2)]",
            "transition-all duration-200"
          )}
          style={{ minHeight: "44px", maxHeight: "120px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "44px";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />

        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 w-11 h-11 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer",
              input.trim()
                ? "bg-jarvis-cyan/20 border border-jarvis-cyan/40 text-jarvis-cyan hover:shadow-glow-sm"
                : "bg-jarvis-surface border border-jarvis-border text-jarvis-muted cursor-not-allowed"
            )}
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
