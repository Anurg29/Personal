import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HUDCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function HUDCard({ children, className, hover = true }: HUDCardProps) {
  return (
    <div
      className={cn(
        "relative bg-jarvis-surface border border-jarvis-border rounded-lg p-6",
        "before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t before:border-l before:border-jarvis-cyan before:rounded-tl-lg",
        "after:absolute after:top-0 after:right-0 after:w-3 after:h-3 after:border-t after:border-r after:border-jarvis-cyan after:rounded-tr-lg",
        hover && "transition-all duration-300 hover:border-jarvis-cyan/40 hover:shadow-glow-sm",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l border-jarvis-cyan rounded-bl-lg"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r border-jarvis-cyan rounded-br-lg"
        )}
      />
      {children}
    </div>
  );
}
