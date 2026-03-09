"use client";

import { useMode } from "@/lib/ModeContext";
import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { CommandCenter } from "@/components/assistant/CommandCenter";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { mode } = useMode();

  return (
    <AnimatePresence mode="wait">
      {mode === "portfolio" || mode === "transforming" ? (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PortfolioHome />
        </motion.div>
      ) : (
        <motion.div
          key="assistant"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CommandCenter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
