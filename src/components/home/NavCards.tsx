"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, MessageSquare, GraduationCap, ArrowRight } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";

const cards = [
  {
    href: "/github",
    title: "GitHub Portfolio",
    description: "View my repositories, contributions, and open-source work",
    icon: Github,
    accent: "from-jarvis-cyan/20 to-jarvis-blue/20",
  },
  {
    href: "/chat",
    title: "J.A.R.V.I.S.",
    description: "AI-powered personal assistant at your service",
    icon: MessageSquare,
    accent: "from-jarvis-blue/20 to-purple-500/20",
  },
  {
    href: "/academic",
    title: "Academic",
    description: "Education, skills, projects, and resume",
    icon: GraduationCap,
    accent: "from-green-500/20 to-jarvis-cyan/20",
  },
];

export function NavCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.href}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
        >
          <Link href={card.href} className="block group">
            <HUDCard className="h-full">
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative">
                <card.icon
                  size={32}
                  className="text-jarvis-cyan mb-4 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all"
                />
                <h3 className="font-orbitron text-lg font-semibold text-jarvis-text mb-2 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-jarvis-muted text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 text-jarvis-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Enter <ArrowRight size={14} />
                </div>
              </div>
            </HUDCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
