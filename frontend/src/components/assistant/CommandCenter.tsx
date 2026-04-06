"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LiveDashboard } from "@/components/widgets/LiveDashboard";
import { ActivityRings } from "@/components/widgets/ActivityRings";
import {
    MessageSquare,
    Github,
    GraduationCap,
    BarChart3,
    Mail,
    Calendar,
    HardDrive,
    Bot,
    Sparkles,
    Globe,
    Zap,
    Youtube,
    Linkedin,
    Code2,
    FileText,
    Music,
    ExternalLink,
    Activity,
    Shield,
    Cpu,
    Wifi,
} from "lucide-react";

interface ServiceTile {
    name: string;
    icon: React.ElementType;
    href: string;
    external?: boolean;
    color: string;
    glow: string;
    badge?: string;
}

const serviceCategories: {
    label: string;
    id: string;
    services: ServiceTile[];
}[] = [
        {
            label: "AI ASSISTANTS",
            id: "ai",
            services: [
                {
                    name: "J.A.R.V.I.S.",
                    icon: MessageSquare,
                    href: "/chat",
                    color: "#00d4ff",
                    glow: "rgba(0,212,255,0.3)",
                    badge: "Built-in",
                },
                {
                    name: "ChatGPT",
                    icon: Bot,
                    href: "https://chat.openai.com",
                    external: true,
                    color: "#10b981",
                    glow: "rgba(16,185,129,0.3)",
                },
                {
                    name: "Claude",
                    icon: Sparkles,
                    href: "https://claude.ai",
                    external: true,
                    color: "#d97706",
                    glow: "rgba(217,119,6,0.3)",
                },
                {
                    name: "Gemini",
                    icon: Zap,
                    href: "https://gemini.google.com",
                    external: true,
                    color: "#6366f1",
                    glow: "rgba(99,102,241,0.3)",
                },
            ],
        },
        {
            label: "GOOGLE SUITE",
            id: "google",
            services: [
                {
                    name: "Gmail",
                    icon: Mail,
                    href: "https://mail.google.com",
                    external: true,
                    color: "#ef4444",
                    glow: "rgba(239,68,68,0.3)",
                },
                {
                    name: "Calendar",
                    icon: Calendar,
                    href: "https://calendar.google.com",
                    external: true,
                    color: "#3b82f6",
                    glow: "rgba(59,130,246,0.3)",
                },
                {
                    name: "Drive",
                    icon: HardDrive,
                    href: "https://drive.google.com",
                    external: true,
                    color: "#f59e0b",
                    glow: "rgba(245,158,11,0.3)",
                },
                {
                    name: "Google Search",
                    icon: Globe,
                    href: "https://www.google.com",
                    external: true,
                    color: "#3b82f6",
                    glow: "rgba(59,130,246,0.3)",
                },
                {
                    name: "Docs",
                    icon: FileText,
                    href: "https://docs.google.com",
                    external: true,
                    color: "#2563eb",
                    glow: "rgba(37,99,235,0.3)",
                },
                {
                    name: "Maps",
                    icon: Globe,
                    href: "https://maps.google.com",
                    external: true,
                    color: "#22c55e",
                    glow: "rgba(34,197,94,0.3)",
                },
            ],
        },
        {
            label: "MESSAGING",
            id: "messaging",
            services: [
                {
                    name: "WhatsApp",
                    icon: MessageSquare,
                    href: "https://web.whatsapp.com",
                    external: true,
                    color: "#22c55e",
                    glow: "rgba(34,197,94,0.3)",
                },
                {
                    name: "Instagram",
                    icon: Globe,
                    href: "https://www.instagram.com",
                    external: true,
                    color: "#e879f9",
                    glow: "rgba(232,121,249,0.3)",
                },
                {
                    name: "Telegram",
                    icon: MessageSquare,
                    href: "https://web.telegram.org",
                    external: true,
                    color: "#38bdf8",
                    glow: "rgba(56,189,248,0.3)",
                },
                {
                    name: "Discord",
                    icon: MessageSquare,
                    href: "https://discord.com/app",
                    external: true,
                    color: "#818cf8",
                    glow: "rgba(129,140,248,0.3)",
                },
            ],
        },
        {
            label: "FINANCE",
            id: "finance",
            services: [
                {
                    name: "Market",
                    icon: BarChart3,
                    href: "/market",
                    color: "#10b981",
                    glow: "rgba(16,185,129,0.3)",
                    badge: "Built-in",
                },
                {
                    name: "Zerodha",
                    icon: Activity,
                    href: "https://kite.zerodha.com",
                    external: true,
                    color: "#ef4444",
                    glow: "rgba(239,68,68,0.3)",
                },
                {
                    name: "Groww",
                    icon: BarChart3,
                    href: "https://groww.in",
                    external: true,
                    color: "#6366f1",
                    glow: "rgba(99,102,241,0.3)",
                },
                {
                    name: "Moneycontrol",
                    icon: Globe,
                    href: "https://www.moneycontrol.com",
                    external: true,
                    color: "#06b6d4",
                    glow: "rgba(6,182,212,0.3)",
                },
            ],
        },
        {
            label: "DEV & ACADEMIC",
            id: "dev",
            services: [
                {
                    name: "GitHub",
                    icon: Github,
                    href: "/github",
                    color: "#e2e8f0",
                    glow: "rgba(226,232,240,0.2)",
                    badge: "Built-in",
                },
                {
                    name: "Academic",
                    icon: GraduationCap,
                    href: "/academic",
                    color: "#10b981",
                    glow: "rgba(16,185,129,0.3)",
                    badge: "Built-in",
                },
                {
                    name: "LeetCode",
                    icon: Code2,
                    href: "https://leetcode.com",
                    external: true,
                    color: "#f59e0b",
                    glow: "rgba(245,158,11,0.3)",
                },
                {
                    name: "StackOverflow",
                    icon: Code2,
                    href: "https://stackoverflow.com",
                    external: true,
                    color: "#f97316",
                    glow: "rgba(249,115,22,0.3)",
                },
                {
                    name: "Notion",
                    icon: FileText,
                    href: "https://www.notion.so",
                    external: true,
                    color: "#e2e8f0",
                    glow: "rgba(226,232,240,0.2)",
                },
            ],
        },
        {
            label: "MEDIA & SOCIAL",
            id: "media",
            services: [
                {
                    name: "YouTube",
                    icon: Youtube,
                    href: "https://youtube.com",
                    external: true,
                    color: "#ef4444",
                    glow: "rgba(239,68,68,0.3)",
                },
                {
                    name: "Spotify",
                    icon: Music,
                    href: "https://open.spotify.com",
                    external: true,
                    color: "#22c55e",
                    glow: "rgba(34,197,94,0.3)",
                },
                {
                    name: "Netflix",
                    icon: Globe,
                    href: "https://www.netflix.com",
                    external: true,
                    color: "#ef4444",
                    glow: "rgba(239,68,68,0.3)",
                },
                {
                    name: "LinkedIn",
                    icon: Linkedin,
                    href: "https://linkedin.com",
                    external: true,
                    color: "#0ea5e9",
                    glow: "rgba(14,165,233,0.3)",
                },
                {
                    name: "Twitter / X",
                    icon: Globe,
                    href: "https://x.com",
                    external: true,
                    color: "#e2e8f0",
                    glow: "rgba(226,232,240,0.2)",
                },
                {
                    name: "Reddit",
                    icon: Globe,
                    href: "https://www.reddit.com",
                    external: true,
                    color: "#f97316",
                    glow: "rgba(249,115,22,0.3)",
                },
            ],
        },
    ];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const tileVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

export function CommandCenter() {
    const [currentTime, setCurrentTime] = useState("");
    const [stats, setStats] = useState({ cpu: 82, memory: 91, uptime: "14d 7h" });

    useEffect(() => {
        const tick = () => {
            const d = new Date();
            setCurrentTime(
                d.getHours().toString().padStart(2, "0") +
                ":" +
                d.getMinutes().toString().padStart(2, "0") +
                ":" +
                d.getSeconds().toString().padStart(2, "0")
            );
        };
        tick();
        const timer = setInterval(tick, 1000);

        // Simulate fluctuating stats
        const statTimer = setInterval(() => {
            setStats({
                cpu: 70 + Math.floor(Math.random() * 20),
                memory: 85 + Math.floor(Math.random() * 12),
                uptime: "14d 7h",
            });
        }, 3000);

        return () => {
            clearInterval(timer);
            clearInterval(statTimer);
        };
    }, []);

    return (
        <div className="min-h-screen">
            {/* ── HUD STATUS BAR ── */}
            <motion.div
                className="flex items-center justify-between px-2 py-3 mb-6 border-b border-[rgba(0,212,255,0.15)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                        <span className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase">
                            System Online
                        </span>
                    </div>
                    <span className="text-[#64748b]/30">|</span>
                    <span className="font-mono text-[10px] text-[#00d4ff]/60 tracking-wider">
                        ANURAG — AUTHORIZED
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#64748b]">
                        <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-[#00d4ff]/40" />
                            {stats.cpu}%
                        </span>
                        <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-emerald-400/40" />
                            SECURE
                        </span>
                        <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-[#00d4ff]/40" />
                            CONNECTED
                        </span>
                    </div>
                    <span className="font-orbitron text-xs text-[#00d4ff] tracking-[0.2em] tabular-nums">
                        {currentTime}
                    </span>
                </div>
            </motion.div>

            {/* ── WELCOME HEADER ── */}
            <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <p className="font-mono text-[#00d4ff]/50 text-xs tracking-[0.3em] uppercase mb-2">
          // M.A.X. Protocol Active
                </p>
                <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-wider text-[#e2e8f0] mb-2">
                    COMMAND{" "}
                    <span className="text-[#00d4ff] drop-shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                        CENTER
                    </span>
                </h1>
                <p className="font-mono text-sm text-[#64748b] tracking-wide">
                    All systems operational. Select a service to launch.
                </p>
            </motion.div>

            {/* ── WIDGETS ROW ── */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
            >
                <LiveDashboard />
                <ActivityRings />
            </motion.div>

            {/* ── QUICK STATS ROW (Jarvis-style stat blocks) ── */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {[
                    { label: "Neural Load", value: `${stats.cpu}%`, fill: stats.cpu, color: "#00d4ff" },
                    { label: "Memory Alloc", value: `${stats.memory}%`, fill: stats.memory, color: "#6366f1" },
                    { label: "Services", value: "20+", fill: 95, color: "#10b981" },
                    { label: "Uptime", value: stats.uptime, fill: 88, color: "#f59e0b" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[rgba(0,212,255,0.02)] border border-[rgba(0,212,255,0.1)] rounded-lg p-3 relative overflow-hidden"
                    >
                        <div className="font-mono text-[9px] text-[#64748b] tracking-widest uppercase mb-1">
                            {stat.label}
                        </div>
                        <div
                            className="font-orbitron text-lg font-bold"
                            style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}40` }}
                        >
                            {stat.value}
                        </div>
                        <div className="mt-2 h-[2px] bg-[rgba(0,212,255,0.08)] rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: stat.color, boxShadow: `0 0 6px ${stat.color}` }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${stat.fill}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* ── SERVICE CATEGORIES ── */}
            <div className="space-y-8">
                {serviceCategories.map((category, catIdx) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + catIdx * 0.1 }}
                    >
                        {/* Category label */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_6px_#00d4ff]" />
                            <span className="font-mono text-[10px] text-[#00d4ff]/60 tracking-[0.25em] uppercase">
                                {category.label}
                            </span>
                            <div className="h-px flex-1 bg-[rgba(0,212,255,0.08)]" />
                        </div>

                        {/* Service tiles */}
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {category.services.map((service) => {
                                const TileContent = (
                                    <motion.div
                                        variants={tileVariant}
                                        className="group relative rounded-xl border border-[rgba(0,212,255,0.08)] bg-[rgba(0,212,255,0.02)] p-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-[rgba(0,212,255,0.2)]"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: `0 0 20px ${service.glow}, 0 8px 30px rgba(0,0,0,0.3)`,
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Hover glow */}
                                        <div
                                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: `radial-gradient(circle at 50% 50%, ${service.color}08, transparent 70%)`,
                                            }}
                                        />

                                        <div className="relative flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_var(--glow)]"
                                                style={
                                                    {
                                                        backgroundColor: `${service.color}12`,
                                                        "--glow": service.glow,
                                                    } as React.CSSProperties
                                                }
                                            >
                                                <service.icon
                                                    className="w-5 h-5 transition-all duration-300"
                                                    style={{ color: service.color }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-[#e2e8f0] group-hover:text-white transition-colors truncate">
                                                        {service.name}
                                                    </span>
                                                    {service.external && (
                                                        <ExternalLink className="w-3 h-3 text-[#64748b] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                    )}
                                                </div>
                                                {service.badge && (
                                                    <span className="text-[9px] font-mono text-[#00d4ff]/60 tracking-wider">
                                                        {service.badge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );

                                if (service.external) {
                                    return (
                                        <a
                                            key={service.name}
                                            href={service.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {TileContent}
                                        </a>
                                    );
                                }

                                return (
                                    <Link key={service.name} href={service.href}>
                                        {TileContent}
                                    </Link>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* ── FOOTER ── */}
            <motion.div
                className="mt-12 pt-6 border-t border-[rgba(0,212,255,0.08)] flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <span className="font-mono text-[10px] text-[#64748b]/50 tracking-wider">
                    M.A.X. // Multi-Access eXperience v1.0
                </span>
                <span className="font-mono text-[10px] text-[#64748b]/50 tracking-wider">
                    Built by Anurag Rokade
                </span>
            </motion.div>
        </div>
    );
}
