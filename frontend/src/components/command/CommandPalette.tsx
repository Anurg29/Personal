"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMode } from "@/lib/ModeContext";
import {
    Search,
    Mic,
    MicOff,
    X,
    MessageSquare,
    Github,
    GraduationCap,
    BarChart3,
    Mail,
    Calendar,
    HardDrive,
    Globe,
    Bot,
    Sparkles,
    Zap,
    Youtube,
    Linkedin,
    Code2,
    FileText,
    Music,
    ExternalLink,
    ArrowRight,
    Command,
    Activity,
    Home,
} from "lucide-react";

interface CommandItem {
    id: string;
    name: string;
    category: string;
    icon: React.ElementType;
    href: string;
    external?: boolean;
    color: string;
    keywords: string[];
}

const allCommands: CommandItem[] = [
    // Pages (built-in)
    { id: "home", name: "Home / Hub", category: "Pages", icon: Home, href: "/", color: "#00d4ff", keywords: ["home", "hub", "main", "dashboard", "command center"] },
    { id: "jarvis", name: "J.A.R.V.I.S. Chat", category: "Pages", icon: MessageSquare, href: "/chat", color: "#00d4ff", keywords: ["jarvis", "chat", "ai", "assistant", "talk"] },
    { id: "github-page", name: "GitHub Portfolio", category: "Pages", icon: Github, href: "/github", color: "#e2e8f0", keywords: ["github", "portfolio", "repos", "code"] },
    { id: "market-page", name: "Market Dashboard", category: "Pages", icon: BarChart3, href: "/market", color: "#10b981", keywords: ["market", "stocks", "portfolio", "finance", "trading"] },
    { id: "academic-page", name: "Academic", category: "Pages", icon: GraduationCap, href: "/academic", color: "#10b981", keywords: ["academic", "education", "resume", "skills", "projects"] },

    // AI Assistants
    { id: "chatgpt", name: "ChatGPT", category: "AI Assistants", icon: Bot, href: "https://chat.openai.com", external: true, color: "#10b981", keywords: ["chatgpt", "openai", "gpt", "ai", "chat"] },
    { id: "claude", name: "Claude", category: "AI Assistants", icon: Sparkles, href: "https://claude.ai", external: true, color: "#d97706", keywords: ["claude", "anthropic", "ai", "chat"] },
    { id: "gemini", name: "Gemini", category: "AI Assistants", icon: Zap, href: "https://gemini.google.com", external: true, color: "#6366f1", keywords: ["gemini", "google", "bard", "ai"] },

    // Google Suite
    { id: "gmail", name: "Gmail", category: "Google", icon: Mail, href: "https://mail.google.com", external: true, color: "#ef4444", keywords: ["gmail", "email", "mail", "inbox", "google"] },
    { id: "gcal", name: "Google Calendar", category: "Google", icon: Calendar, href: "https://calendar.google.com", external: true, color: "#3b82f6", keywords: ["calendar", "schedule", "events", "meeting", "google"] },
    { id: "gdrive", name: "Google Drive", category: "Google", icon: HardDrive, href: "https://drive.google.com", external: true, color: "#f59e0b", keywords: ["drive", "files", "documents", "storage", "google"] },
    { id: "gsearch", name: "Google Search", category: "Google", icon: Globe, href: "https://www.google.com", external: true, color: "#3b82f6", keywords: ["google", "search", "find", "lookup"] },
    { id: "gdocs", name: "Google Docs", category: "Google", icon: FileText, href: "https://docs.google.com", external: true, color: "#2563eb", keywords: ["docs", "document", "write", "google"] },
    { id: "gmaps", name: "Google Maps", category: "Google", icon: Globe, href: "https://maps.google.com", external: true, color: "#22c55e", keywords: ["maps", "directions", "location", "navigate", "google"] },

    // Messaging
    { id: "whatsapp", name: "WhatsApp", category: "Messaging", icon: MessageSquare, href: "https://web.whatsapp.com", external: true, color: "#22c55e", keywords: ["whatsapp", "chat", "message", "text"] },
    { id: "instagram", name: "Instagram", category: "Social", icon: Globe, href: "https://www.instagram.com", external: true, color: "#e879f9", keywords: ["instagram", "insta", "social", "photos", "reels"] },
    { id: "telegram", name: "Telegram", category: "Messaging", icon: MessageSquare, href: "https://web.telegram.org", external: true, color: "#38bdf8", keywords: ["telegram", "chat", "message"] },
    { id: "discord", name: "Discord", category: "Messaging", icon: MessageSquare, href: "https://discord.com/app", external: true, color: "#818cf8", keywords: ["discord", "server", "voice", "gaming"] },

    // Finance
    { id: "zerodha", name: "Zerodha Kite", category: "Finance", icon: Activity, href: "https://kite.zerodha.com", external: true, color: "#ef4444", keywords: ["zerodha", "kite", "trading", "stocks", "invest"] },
    { id: "groww", name: "Groww", category: "Finance", icon: BarChart3, href: "https://groww.in", external: true, color: "#6366f1", keywords: ["groww", "invest", "mutual funds", "stocks"] },
    { id: "moneycontrol", name: "Moneycontrol", category: "Finance", icon: Globe, href: "https://www.moneycontrol.com", external: true, color: "#06b6d4", keywords: ["moneycontrol", "news", "market", "finance"] },

    // Dev
    { id: "leetcode", name: "LeetCode", category: "Dev", icon: Code2, href: "https://leetcode.com", external: true, color: "#f59e0b", keywords: ["leetcode", "coding", "dsa", "practice", "interview"] },
    { id: "stackoverflow", name: "StackOverflow", category: "Dev", icon: Code2, href: "https://stackoverflow.com", external: true, color: "#f97316", keywords: ["stackoverflow", "questions", "coding", "help"] },
    { id: "notion", name: "Notion", category: "Dev", icon: FileText, href: "https://www.notion.so", external: true, color: "#e2e8f0", keywords: ["notion", "notes", "wiki", "docs", "workspace"] },

    // Media & Social
    { id: "youtube", name: "YouTube", category: "Media", icon: Youtube, href: "https://youtube.com", external: true, color: "#ef4444", keywords: ["youtube", "video", "watch", "music", "stream"] },
    { id: "spotify", name: "Spotify", category: "Media", icon: Music, href: "https://open.spotify.com", external: true, color: "#22c55e", keywords: ["spotify", "music", "songs", "playlist", "play"] },
    { id: "netflix", name: "Netflix", category: "Media", icon: Globe, href: "https://www.netflix.com", external: true, color: "#ef4444", keywords: ["netflix", "movies", "series", "watch", "stream"] },
    { id: "linkedin", name: "LinkedIn", category: "Social", icon: Linkedin, href: "https://linkedin.com", external: true, color: "#0ea5e9", keywords: ["linkedin", "professional", "jobs", "network"] },
    { id: "twitter", name: "Twitter / X", category: "Social", icon: Globe, href: "https://x.com", external: true, color: "#e2e8f0", keywords: ["twitter", "x", "tweets", "social"] },
    { id: "reddit", name: "Reddit", category: "Social", icon: Globe, href: "https://www.reddit.com", external: true, color: "#f97316", keywords: ["reddit", "forum", "discussion", "community"] },
];

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const router = useRouter();
    const { mode } = useMode();

    // Filter commands based on query
    const filtered = useMemo(() => {
        if (!query.trim()) return allCommands;
        const q = query.toLowerCase();
        return allCommands.filter(
            (cmd) =>
                cmd.name.toLowerCase().includes(q) ||
                cmd.category.toLowerCase().includes(q) ||
                cmd.keywords.some((k) => k.includes(q))
        );
    }, [query]);

    // Group by category
    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filtered.forEach((cmd) => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filtered]);

    // Flatten for keyboard navigation
    const flatList = useMemo(() => {
        return Object.values(grouped).flat();
    }, [grouped]);

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
            setSelectedIndex(0);
            setVoiceTranscript("");
        } else {
            stopListening();
        }
    }, [isOpen]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            selected?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    const executeCommand = useCallback(
        (cmd: CommandItem) => {
            setIsOpen(false);
            if (cmd.external) {
                window.open(cmd.href, "_blank", "noopener,noreferrer");
            } else {
                router.push(cmd.href);
            }
        },
        [router]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && flatList[selectedIndex]) {
            e.preventDefault();
            executeCommand(flatList[selectedIndex]);
        }
    };

    // ── Voice Recognition ──
    const startListening = useCallback(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            setVoiceTranscript("Voice not supported in this browser");
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        const recognition = new SpeechRecognitionAPI();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceTranscript("Listening...");
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((r: any) => r[0].transcript)
                .join("");
            setVoiceTranscript(transcript);
            setQuery(transcript);

            // If final result, try to auto-execute the best match
            if (event.results[0].isFinal) {
                setTimeout(() => {
                    // Check for "open X" commands
                    const lower = transcript.toLowerCase();
                    const openMatch = lower.match(/^(?:open|launch|go to|start)\s+(.+)/);
                    const searchTerm = openMatch ? openMatch[1] : lower;

                    const match = allCommands.find(
                        (cmd) =>
                            cmd.name.toLowerCase().includes(searchTerm) ||
                            cmd.keywords.some((k) => k.includes(searchTerm))
                    );

                    if (match) {
                        executeCommand(match);
                    }
                }, 500);
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setVoiceTranscript("Voice error — try again");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [executeCommand]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    // Don't render in portfolio mode (only in assistant mode)
    if (mode !== "assistant") return null;

    let globalIndex = -1;

    return (
        <>
            {/* Trigger hint in header area */}
            <div className="fixed bottom-6 left-6 z-40">
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.12)] text-[#64748b] hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    <Search className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono hidden sm:inline">Search & Launch</span>
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-[#00d4ff]/60">
                        <Command className="w-2.5 h-2.5" />K
                    </kbd>
                </motion.button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-[100] bg-[rgba(2,8,23,0.7)] backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Palette */}
                        <motion.div
                            className="fixed top-[15%] left-1/2 z-[101] w-[90vw] max-w-[600px] -translate-x-1/2 rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(10, 15, 26, 0.98)",
                                border: "1px solid rgba(0,212,255,0.2)",
                                boxShadow:
                                    "0 0 60px rgba(0,212,255,0.1), 0 25px 80px rgba(0,0,0,0.6)",
                            }}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                            {/* Input area */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(0,212,255,0.12)]">
                                <Search className="w-5 h-5 text-[#00d4ff]/50 flex-shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search apps, pages, or say a command..."
                                    className="flex-1 bg-transparent border-none outline-none text-[#e2e8f0] text-sm font-mono placeholder:text-[#64748b]/60"
                                />

                                {/* Voice button */}
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isListening
                                        ? "bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse"
                                        : "bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-[#00d4ff]/60 hover:text-[#00d4ff] hover:border-[#00d4ff]/30"
                                        }`}
                                    title={isListening ? "Stop listening" : "Voice search"}
                                >
                                    {isListening ? (
                                        <MicOff className="w-4 h-4" />
                                    ) : (
                                        <Mic className="w-4 h-4" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(0,212,255,0.08)] transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Voice transcript */}
                            {voiceTranscript && (
                                <div className="px-5 py-2 border-b border-[rgba(0,212,255,0.08)]">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${isListening
                                                ? "bg-red-400 animate-pulse"
                                                : "bg-emerald-400"
                                                }`}
                                        />
                                        <span className="text-xs font-mono text-[#94a3b8]">
                                            {voiceTranscript}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            <div
                                ref={listRef}
                                className="max-h-[50vh] overflow-y-auto py-2"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "rgba(0,212,255,0.2) transparent",
                                }}
                            >
                                {flatList.length === 0 ? (
                                    <div className="px-5 py-8 text-center">
                                        <p className="text-sm text-[#64748b]">
                                            No results for &quot;{query}&quot;
                                        </p>
                                        <p className="text-xs text-[#64748b]/50 mt-1 font-mono">
                                            Try &quot;gmail&quot;, &quot;youtube&quot;, or &quot;whatsapp&quot;
                                        </p>
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([category, items]) => (
                                        <div key={category}>
                                            <div className="px-5 py-1.5">
                                                <span className="text-[10px] font-mono text-[#00d4ff]/40 tracking-[0.2em] uppercase">
                                                    {category}
                                                </span>
                                            </div>
                                            {items.map((cmd) => {
                                                globalIndex++;
                                                const idx = globalIndex;
                                                const isSelected = idx === selectedIndex;
                                                const Icon = cmd.icon;

                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        data-index={idx}
                                                        onClick={() => executeCommand(cmd)}
                                                        onMouseEnter={() => setSelectedIndex(idx)}
                                                        className={`w-full flex items-center gap-3 px-5 py-2.5 transition-all cursor-pointer ${isSelected
                                                            ? "bg-[rgba(0,212,255,0.08)]"
                                                            : "hover:bg-[rgba(0,212,255,0.04)]"
                                                            }`}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                            style={{ backgroundColor: `${cmd.color}12` }}
                                                        >
                                                            <Icon
                                                                className="w-4 h-4"
                                                                style={{ color: cmd.color }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <span
                                                                className={`text-sm ${isSelected ? "text-white" : "text-[#e2e8f0]"
                                                                    }`}
                                                            >
                                                                {cmd.name}
                                                            </span>
                                                        </div>
                                                        {cmd.external && (
                                                            <ExternalLink className="w-3 h-3 text-[#64748b]/40" />
                                                        )}
                                                        {isSelected && (
                                                            <ArrowRight className="w-3.5 h-3.5 text-[#00d4ff]/60" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(0,212,255,0.08)]">
                                <div className="flex items-center gap-4 text-[10px] font-mono text-[#64748b]/50">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.1)]">
                                            ↑↓
                                        </kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.1)]">
                                            ↵
                                        </kbd>
                                        Open
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.1)]">
                                            Esc
                                        </kbd>
                                        Close
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-[#64748b]/40">
                                    🎙️ Try voice: &quot;Open WhatsApp&quot;
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
