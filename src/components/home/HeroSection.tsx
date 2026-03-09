"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4">
          <span className="font-mono text-jarvis-cyan/60 text-sm tracking-widest">
            // SYSTEM ONLINE
          </span>
        </div>

        <h1 className="font-orbitron text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wider mb-6">
          <span className="text-jarvis-text">ANURAG </span>
          <span className="text-jarvis-cyan drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
            ROKADE
          </span>
        </h1>

        <motion.p
          className="font-mono text-jarvis-muted text-base sm:text-lg tracking-wide max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Full-Stack Developer &middot; AI Explorer &middot; Problem Solver
        </motion.p>
      </motion.div>

      <motion.div
        className="mt-12 flex items-center gap-2 text-jarvis-cyan/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="w-2 h-2 rounded-full bg-jarvis-cyan animate-glow-pulse" />
        <span className="font-mono text-xs tracking-widest uppercase">
          Navigate below
        </span>
        <div className="w-2 h-2 rounded-full bg-jarvis-cyan animate-glow-pulse" />
      </motion.div>
    </section>
  );
}
