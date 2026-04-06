"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TransformAnimationProps {
    isActive: boolean;
}

export function TransformAnimation({ isActive }: TransformAnimationProps) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setPhase(0);
            return;
        }

        const timers = [
            setTimeout(() => setPhase(1), 0),       // Flash
            setTimeout(() => setPhase(2), 400),      // Scanning
            setTimeout(() => setPhase(3), 1200),     // Text reveal
            setTimeout(() => setPhase(4), 2400),     // Fade out
            setTimeout(() => setPhase(5), 3400),     // Done
        ];

        return () => timers.forEach(clearTimeout);
    }, [isActive]);

    if (!isActive && phase === 0) return null;

    return (
        <AnimatePresence>
            {isActive && phase < 5 && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Dark background */}
                    <motion.div
                        className="absolute inset-0 bg-[#010510]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase >= 4 ? 0 : 1 }}
                        transition={{ duration: phase >= 4 ? 0.8 : 0.3 }}
                    />

                    {/* Flash effect */}
                    {phase >= 1 && phase < 3 && (
                        <motion.div
                            className="absolute inset-0 bg-[#00d4ff]"
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    )}

                    {/* HUD Grid forming */}
                    {phase >= 2 && (
                        <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: phase >= 4 ? 0 : 0.15 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    )}

                    {/* Scanning line */}
                    {phase >= 2 && phase < 4 && (
                        <motion.div
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent shadow-[0_0_20px_#00d4ff,0_0_60px_#00d4ff]"
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                        />
                    )}

                    {/* Vertical scanning line */}
                    {phase >= 2 && phase < 4 && (
                        <motion.div
                            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00d4ff] to-transparent shadow-[0_0_20px_#00d4ff,0_0_60px_#00d4ff]"
                            initial={{ left: "0%" }}
                            animate={{ left: "100%" }}
                            transition={{ duration: 1.2, ease: "linear", delay: 0.3 }}
                        />
                    )}

                    {/* Corner brackets */}
                    {phase >= 2 && (
                        <>
                            <motion.div
                                className="absolute top-8 left-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: phase >= 4 ? 0 : 0.6, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <svg width="60" height="60" viewBox="0 0 60 60" stroke="#00d4ff" fill="none" strokeWidth="2">
                                    <path d="M0 20 L0 0 L20 0" />
                                </svg>
                            </motion.div>
                            <motion.div
                                className="absolute top-8 right-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: phase >= 4 ? 0 : 0.6, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <svg width="60" height="60" viewBox="0 0 60 60" stroke="#00d4ff" fill="none" strokeWidth="2">
                                    <path d="M40 0 L60 0 L60 20" />
                                </svg>
                            </motion.div>
                            <motion.div
                                className="absolute bottom-8 left-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: phase >= 4 ? 0 : 0.6, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <svg width="60" height="60" viewBox="0 0 60 60" stroke="#00d4ff" fill="none" strokeWidth="2">
                                    <path d="M0 40 L0 60 L20 60" />
                                </svg>
                            </motion.div>
                            <motion.div
                                className="absolute bottom-8 right-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: phase >= 4 ? 0 : 0.6, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <svg width="60" height="60" viewBox="0 0 60 60" stroke="#00d4ff" fill="none" strokeWidth="2">
                                    <path d="M40 60 L60 60 L60 40" />
                                </svg>
                            </motion.div>
                        </>
                    )}

                    {/* Center content */}
                    {phase >= 3 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {/* Arc reactor glow */}
                            <motion.div
                                className="relative mb-8"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: phase >= 4 ? 1.5 : 1, opacity: phase >= 4 ? 0 : 1 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                            >
                                <div className="w-24 h-24 rounded-full border-2 border-[#00d4ff] flex items-center justify-center relative">
                                    <div className="w-16 h-16 rounded-full border border-[#00d4ff]/60 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-[#00d4ff]/30 shadow-[0_0_40px_#00d4ff,0_0_80px_#00d4ff] animate-pulse" />
                                    </div>
                                    {/* Rotating ring */}
                                    <motion.div
                                        className="absolute inset-[-4px] rounded-full border border-dashed border-[#00d4ff]/40"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Outer ring */}
                                    <motion.div
                                        className="absolute inset-[-12px] rounded-full border border-[#00d4ff]/20"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Protocol text */}
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: phase >= 4 ? 0 : 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.p
                                    className="font-mono text-[#00d4ff]/60 text-xs tracking-[0.3em] uppercase mb-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                  // Initializing Protocol
                                </motion.p>
                                <motion.h1
                                    className="font-orbitron text-4xl sm:text-6xl font-bold tracking-wider text-[#00d4ff] drop-shadow-[0_0_30px_rgba(0,212,255,0.6)]"
                                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                                    animate={{ opacity: 1, letterSpacing: "0.15em" }}
                                    transition={{ duration: 0.8 }}
                                >
                                    M.A.X.
                                </motion.h1>
                                <motion.p
                                    className="font-mono text-[#e2e8f0]/80 text-sm tracking-widest mt-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Multi-Access eXperience
                                </motion.p>
                                <motion.p
                                    className="font-mono text-emerald-400 text-xs tracking-wider mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    ● ACCESS GRANTED — Welcome back, sir.
                                </motion.p>
                            </motion.div>

                            {/* Status bars */}
                            <motion.div
                                className="mt-8 flex items-center gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: phase >= 4 ? 0 : 0.6 }}
                                transition={{ delay: 0.6 }}
                            >
                                {["Systems", "Network", "AI Core", "Database"].map((label, i) => (
                                    <div key={label} className="flex flex-col items-center gap-1">
                                        <div className="w-16 h-1 bg-[#00d4ff]/20 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#00d4ff] rounded-full"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-[#00d4ff]/40">{label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Binary rain effect */}
                    {phase >= 2 && phase < 4 && (
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-[#00d4ff] font-mono text-[10px] whitespace-nowrap"
                                    style={{ left: `${i * 5}%` }}
                                    initial={{ top: "-10%" }}
                                    animate={{ top: "110%" }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        delay: Math.random() * 0.5,
                                        ease: "linear",
                                    }}
                                >
                                    {Array.from({ length: 30 })
                                        .map(() => Math.round(Math.random()))
                                        .join("")}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
