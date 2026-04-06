import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-jarvis-blue/20 text-jarvis-blue"
            : "bg-jarvis-cyan/10 text-jarvis-cyan"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser
            ? "bg-jarvis-blue/10 border border-jarvis-blue/20 text-jarvis-text"
            : "bg-jarvis-surface border border-jarvis-border text-jarvis-text"
        )}
      >
        {!isUser && (
          <span className="font-mono text-[10px] text-jarvis-cyan/60 tracking-widest uppercase block mb-1">
            J.A.R.V.I.S.
          </span>
        )}
        <div className="prose prose-invert prose-sm max-w-none prose-p:text-jarvis-text prose-p:leading-relaxed prose-code:text-jarvis-cyan prose-code:bg-jarvis-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-jarvis-elevated prose-pre:border prose-pre:border-jarvis-border prose-headings:text-jarvis-text prose-a:text-jarvis-cyan prose-strong:text-jarvis-text">
          <ReactMarkdown>{message.content || "..."}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
