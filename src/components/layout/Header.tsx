"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMode } from "@/lib/ModeContext";
import {
  Home,
  Github,
  MessageSquare,
  GraduationCap,
  BarChart3,
  LogOut,
  Zap,
  Monitor,
} from "lucide-react";

const portfolioLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/github", label: "GitHub", icon: Github },
  { href: "/academic", label: "Academic", icon: GraduationCap },
];

const assistantLinks = [
  { href: "/", label: "Hub", icon: Home },
  { href: "/jarvis", label: "HUD", icon: Monitor },
  { href: "/github", label: "GitHub", icon: Github },
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/chat", label: "J.A.R.V.I.S.", icon: MessageSquare },
  { href: "/academic", label: "Academic", icon: GraduationCap },
];

export function Header() {
  const pathname = usePathname();
  const { mode, exitAssistant } = useMode();

  const navLinks = mode === "assistant" ? assistantLinks : portfolioLinks;
  const isAssistant = mode === "assistant";

  return (
    <header className="sticky top-0 z-50 border-b border-jarvis-border bg-jarvis-base/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-orbitron text-lg tracking-wider font-bold hover:opacity-80 transition-colors flex items-center gap-2"
        >
          {isAssistant ? (
            <>
              <Zap className="w-5 h-5 text-jarvis-cyan" />
              <span className="text-jarvis-cyan">M.A.X.</span>
            </>
          ) : (
            <span className="text-jarvis-cyan">A.R.K.</span>
          )}
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-jarvis-cyan bg-jarvis-cyan/10 shadow-glow-sm"
                    : "text-jarvis-muted hover:text-jarvis-text hover:bg-jarvis-surface"
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Exit assistant mode button */}
          {isAssistant && (
            <button
              onClick={exitAssistant}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-300 ml-2 cursor-pointer"
              title="Exit M.A.X. mode"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}
        </div>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jarvis-cyan/40 to-transparent" />
    </header>
  );
}
