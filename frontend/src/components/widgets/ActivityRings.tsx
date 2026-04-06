"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatData {
    label: string;
    code: string;
    value: number;
    max: number;
    color: string;
    unit: string;
}

export function ActivityRings() {
    const [stats, setStats] = useState<StatData[]>([
        { label: "GitHub Commits", code: "GIT.PUSH", value: 72, max: 100, color: "#22c55e", unit: "%" },
        { label: "LeetCode", code: "LC.SOLVE", value: 46, max: 100, color: "#f59e0b", unit: "%" },
        { label: "Uptime Streak", code: "SYS.UPTM", value: 88, max: 100, color: "#00d4ff", unit: "%" },
        { label: "Projects Active", code: "PRJ.ACTV", value: 4, max: 10, color: "#a78bfa", unit: "" },
    ]);

    const [scanLine, setScanLine] = useState(0);

    // Simulate minor live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) =>
                prev.map((s) => ({
                    ...s,
                    value: Math.min(
                        s.max,
                        Math.max(s.value - 1, s.value + Math.floor(Math.random() * 3) - 1)
                    ),
                }))
            );
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Scan line animation
    useEffect(() => {
        const interval = setInterval(() => {
            setScanLine((prev) => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const overall = Math.round(stats.reduce((a, s) => a + (s.value / s.max) * 100, 0) / stats.length);

    return (
        <motion.div
            className="rounded-xl overflow-hidden relative"
            style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(0,212,255,0.15)",
                backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {/* Scan line overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `linear-gradient(to bottom, transparent ${scanLine}%, rgba(0,212,255,0.03) ${scanLine + 0.5}%, transparent ${scanLine + 1}%)`,
                }}
            />

            {/* Corner brackets — sci-fi HUD */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-[1.5px] border-t-[1.5px] border-[#00d4ff]/20 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-[1.5px] border-t-[1.5px] border-[#00d4ff]/20 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-[1.5px] border-b-[1.5px] border-[#00d4ff]/20 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-[1.5px] border-b-[1.5px] border-[#00d4ff]/20 rounded-br-sm" />

            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-[rgba(0,212,255,0.08)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-[#22c55e]"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ boxShadow: "0 0 8px rgba(34,197,94,0.5)" }}
                        />
                        <span className="font-mono text-[9px] text-[#00d4ff]/40 tracking-[0.25em] uppercase">
                            System Analytics
                        </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#64748b]/50 tracking-wider">
                        v2.4.1
                    </span>
                </div>
            </div>

            {/* Central HUD display */}
            <div className="px-5 py-4">
                {/* Overall score - hexagonal style display */}
                <div className="flex items-center justify-center mb-5">
                    <div className="relative">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                            {/* Outer rotating dashed ring */}
                            <motion.circle
                                cx="70"
                                cy="70"
                                r="65"
                                fill="none"
                                stroke="#00d4ff"
                                strokeWidth="0.5"
                                strokeDasharray="4 8"
                                opacity={0.15}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: "center" }}
                            />

                            {/* Inner ring track */}
                            <circle
                                cx="70"
                                cy="70"
                                r="55"
                                fill="none"
                                stroke="#00d4ff"
                                strokeWidth="2"
                                opacity={0.06}
                            />

                            {/* Animated progress arc */}
                            <motion.circle
                                cx="70"
                                cy="70"
                                r="55"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 55}
                                initial={{ strokeDashoffset: 2 * Math.PI * 55 }}
                                animate={{
                                    strokeDashoffset: 2 * Math.PI * 55 * (1 - overall / 100),
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                style={{
                                    transformOrigin: "center",
                                    transform: "rotate(-90deg)",
                                    filter: "drop-shadow(0 0 6px rgba(0,212,255,0.4))",
                                }}
                            />

                            {/* Tick marks */}
                            {Array.from({ length: 36 }).map((_, i) => {
                                const angle = (i * 10 * Math.PI) / 180;
                                const x1 = 70 + 47 * Math.cos(angle);
                                const y1 = 70 + 47 * Math.sin(angle);
                                const x2 = 70 + (i % 3 === 0 ? 43 : 45) * Math.cos(angle);
                                const y2 = 70 + (i % 3 === 0 ? 43 : 45) * Math.sin(angle);
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="#00d4ff"
                                        strokeWidth={i % 3 === 0 ? "1" : "0.5"}
                                        opacity={i % 3 === 0 ? 0.2 : 0.08}
                                    />
                                );
                            })}

                            {/* Gradient definition */}
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="50%" stopColor="#00d4ff" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center data */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                className="font-orbitron text-3xl font-bold text-[#e2e8f0]"
                                key={overall}
                                initial={{ scale: 1.1, opacity: 0.7 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {overall}
                            </motion.span>
                            <span className="text-[8px] font-mono text-[#00d4ff]/40 tracking-[0.3em] uppercase -mt-0.5">
                                Index
                            </span>
                        </div>
                    </div>
                </div>

                {/* Metric bars — sci-fi style */}
                <div className="space-y-3">
                    {stats.map((stat, i) => {
                        const pct = (stat.value / stat.max) * 100;
                        return (
                            <motion.div
                                key={stat.code}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.15 }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-[9px] font-mono font-bold tracking-wider"
                                            style={{ color: stat.color }}
                                        >
                                            [{stat.code}]
                                        </span>
                                        <span className="text-[10px] font-mono text-[#94a3b8]">
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-0.5">
                                        <motion.span
                                            className="text-xs font-orbitron font-bold text-[#e2e8f0] tabular-nums"
                                            key={stat.value}
                                            initial={{ opacity: 0.5 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {stat.value}
                                        </motion.span>
                                        <span className="text-[8px] font-mono text-[#64748b]">
                                            {stat.unit || `/${stat.max}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar with segments */}
                                <div className="relative h-[6px] rounded-full overflow-hidden bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.06)]">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`,
                                            boxShadow: `0 0 10px ${stat.color}40, inset 0 1px 1px rgba(255,255,255,0.1)`,
                                        }}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                                    />
                                    {/* Segment lines */}
                                    {[25, 50, 75].map((mark) => (
                                        <div
                                            key={mark}
                                            className="absolute top-0 bottom-0 w-px bg-[rgba(0,212,255,0.08)]"
                                            style={{ left: `${mark}%` }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Footer — diagnostic line */}
            <div className="px-5 py-2.5 border-t border-[rgba(0,212,255,0.06)] flex items-center justify-between">
                <span className="text-[8px] font-mono text-[#64748b]/40 tracking-wider">
                    DIAG: ALL NOMINAL
                </span>
                <div className="flex items-center gap-1">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 rounded-full bg-[#00d4ff]"
                            animate={{ height: [2, 6 + Math.random() * 4, 2] }}
                            transition={{
                                duration: 0.8 + Math.random() * 0.4,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                            style={{ opacity: 0.3 }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
