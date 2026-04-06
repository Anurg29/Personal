import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "relative px-6 py-3 rounded-lg font-medium font-inter transition-all duration-300 cursor-pointer",
        variant === "primary" &&
          "bg-jarvis-cyan/10 border border-jarvis-cyan/40 text-jarvis-cyan hover:bg-jarvis-cyan/20 hover:shadow-glow-md",
        variant === "ghost" &&
          "bg-transparent border border-jarvis-border text-jarvis-text hover:border-jarvis-cyan/40 hover:text-jarvis-cyan",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
