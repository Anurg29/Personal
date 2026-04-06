"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { useMode } from "@/lib/ModeContext";

interface Message {
    role: "user" | "max";
    content: string;
}

const TRIGGER_PHRASES = ["hello max", "hi max", "hey max", "hola max"];
const EXIT_PHRASES = ["goodbye max", "bye max", "exit", "logout", "log out"];
const ACCESS_CODE = "2918";

function isTriggered(text: string) {
    return TRIGGER_PHRASES.some((p) => text.toLowerCase().trim().includes(p));
}

function isExit(text: string) {
    return EXIT_PHRASES.some((p) => text.toLowerCase().trim().includes(p));
}

export function FloatingChatbot() {
    const { mode, triggerTransformation, exitAssistant } = useMode();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "max",
            content:
                mode === "assistant"
                    ? "M.A.X. online. All systems operational. How can I assist you today, sir?"
                    : "Hey there! 👋 I'm the assistant on Anurag's portfolio. Feel free to ask me about his projects, skills, or anything else!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [awaitingPin, setAwaitingPin] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Reset messages when mode changes
    useEffect(() => {
        if (mode === "assistant") {
            setMessages([
                {
                    role: "max",
                    content:
                        "M.A.X. online. All systems are operational, sir. How can I assist you today?\n\nType **goodbye max** to switch back to portfolio mode.",
                },
            ]);
        }
    }, [mode]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            // If we're waiting for PIN input
            if (awaitingPin) {
                if (userMsg === ACCESS_CODE) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "max",
                            content:
                                "🔐 Access code verified. Initiating **M.A.X. Protocol**...\n\n*Multi-Access eXperience activating...*",
                        },
                    ]);
                    setIsTyping(false);
                    setAwaitingPin(false);

                    setTimeout(() => {
                        setIsOpen(false);
                        triggerTransformation();
                    }, 1500);
                } else {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "max",
                            content: "❌ Access denied. Incorrect code. Try again or type something else to cancel.",
                        },
                    ]);
                    setIsTyping(false);
                    setAwaitingPin(false);
                }
                return;
            }

            // Check for transformation trigger
            if (isTriggered(userMsg) && mode === "portfolio") {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "max",
                        content:
                            "🔒 Voice print recognized. Please enter your **access code** to activate M.A.X. Protocol:",
                    },
                ]);
                setIsTyping(false);
                setAwaitingPin(true);
                return;
            }

            // Check for exit command
            if (isExit(userMsg) && mode === "assistant") {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "max",
                        content:
                            "Understood, sir. Shutting down M.A.X. Protocol. Returning to portfolio mode. It was a pleasure.",
                    },
                ]);
                setIsTyping(false);

                setTimeout(() => {
                    setIsOpen(false);
                    exitAssistant();
                }, 1500);
                return;
            }

            // Default responses
            let response = "";
            const lower = userMsg.toLowerCase();

            if (mode === "assistant") {
                if (lower.includes("help")) {
                    response =
                        "You can access all your services from the command center above. Use the quick launch tiles to open Gmail, Drive, Calendar, ChatGPT, Claude, and more!\n\nNavigate using the header links or type **goodbye max** to return to portfolio.";
                } else if (lower.includes("who")) {
                    response =
                        "I'm **M.A.X.** — Multi-Access eXperience. Your personal digital command center, sir. I unify all your services in one place.";
                } else {
                    response =
                        "I'm here to help navigate your command center. Use the service tiles above to access your apps, or head to the HUD for system monitoring!";
                }
            } else {
                if (lower.includes("who") || lower.includes("about")) {
                    response =
                        "This portfolio belongs to **Anurag Rokade** — a Full-Stack Developer, AI Explorer, and Problem Solver. Browse around to learn more!";
                } else if (lower.includes("project")) {
                    response =
                        "Check out the **Projects** section below, or visit the **GitHub** page for all repositories!";
                } else if (lower.includes("contact") || lower.includes("hire")) {
                    response =
                        "Scroll down to the **Contact** section for ways to reach Anurag. He's open to exciting opportunities!";
                } else if (lower.includes("skill")) {
                    response =
                        "Anurag specializes in **React, Next.js, Python, FastAPI, AI/ML**, and more. Check the Skills section!";
                } else {
                    response =
                        "Thanks for your message! I can help with info about Anurag's **projects**, **skills**, **education**, or how to **contact** him. What would you like to know?";
                }
            }

            setMessages((prev) => [...prev, { role: "max", content: response }]);
            setIsTyping(false);
        }, 800);
    };

    // Hide during transformation
    if (mode === "transforming") return null;

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer group"
                        style={{
                            background:
                                mode === "assistant"
                                    ? "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)"
                                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            boxShadow:
                                mode === "assistant"
                                    ? "0 0 20px rgba(0,212,255,0.4), 0 4px 15px rgba(0,0,0,0.3)"
                                    : "0 0 20px rgba(99,102,241,0.4), 0 4px 15px rgba(0,0,0,0.3)",
                        }}
                        id="chatbot-toggle"
                    >
                        <MessageSquare className="w-6 h-6 text-white" />
                        {/* Pulse ring */}
                        <span
                            className="absolute inset-0 rounded-full animate-ping opacity-20"
                            style={{
                                background:
                                    mode === "assistant"
                                        ? "rgba(0,212,255,0.5)"
                                        : "rgba(99,102,241,0.5)",
                            }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[500px] rounded-2xl overflow-hidden flex flex-col"
                        style={{
                            background: "rgba(10, 15, 26, 0.95)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            backdropFilter: "blur(20px)",
                            boxShadow:
                                "0 0 40px rgba(0,212,255,0.1), 0 20px 60px rgba(0,0,0,0.5)",
                        }}
                        id="chatbot-window"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,212,255,0.15)]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-orbitron text-sm font-semibold text-[#e2e8f0] tracking-wider">
                                        {mode === "assistant" ? "M.A.X." : "Portfolio Assistant"}
                                    </h3>
                                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(0,212,255,0.1)] transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-gradient-to-r from-[#0066ff] to-[#00d4ff] text-white rounded-br-sm"
                                            : "bg-[rgba(0,212,255,0.08)] text-[#e2e8f0] border border-[rgba(0,212,255,0.1)] rounded-bl-sm"
                                            }`}
                                    >
                                        {msg.content.split("\n").map((line, j) => (
                                            <span key={j}>
                                                {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                                                    part.startsWith("**") && part.endsWith("**") ? (
                                                        <strong key={k} className="font-semibold text-[#00d4ff]">
                                                            {part.slice(2, -2)}
                                                        </strong>
                                                    ) : part.startsWith("*") && part.endsWith("*") ? (
                                                        <em key={k} className="opacity-80">
                                                            {part.slice(1, -1)}
                                                        </em>
                                                    ) : (
                                                        <span key={k}>{part}</span>
                                                    )
                                                )}
                                                {j < msg.content.split("\n").length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-1 px-4 py-2"
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-[#00d4ff]/50"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-[rgba(0,212,255,0.15)]">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#e2e8f0] placeholder:text-[#64748b] focus:outline-none focus:border-[#00d4ff]/40 focus:shadow-[0_0_10px_rgba(0,212,255,0.1)] transition-all"
                                    id="chatbot-input"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#00d4ff] flex items-center justify-center text-white disabled:opacity-30 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all cursor-pointer"
                                    id="chatbot-send"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
