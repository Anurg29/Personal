"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Fingerprint, AlertTriangle } from "lucide-react";

// The passcode hash — we store a hashed version so the raw code isn't in source
// Default passcode: "2918"
const PASSCODE_HASH = "1796ae";

function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
}

interface AuthGateProps {
    children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if already authenticated (session)
    useEffect(() => {
        const stored = sessionStorage.getItem("max-auth");
        if (stored === PASSCODE_HASH) {
            setAuthenticated(true);
        }
        setChecking(false);
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const hash = simpleHash(code);
        if (hash === PASSCODE_HASH) {
            sessionStorage.setItem("max-auth", PASSCODE_HASH);
            setAuthenticated(true);
        } else {
            setError(true);
            setShake(true);
            setCode("");
            setTimeout(() => { setShake(false); setError(false); }, 1500);
        }
    };

    const handleKeyPress = (digit: string) => {
        if (code.length >= 6) return;
        const newCode = code + digit;
        setCode(newCode);
        setError(false);

        // Auto-submit when 4 digits entered
        if (newCode.length === 4) {
            setTimeout(() => {
                const hash = simpleHash(newCode);
                if (hash === PASSCODE_HASH) {
                    sessionStorage.setItem("max-auth", PASSCODE_HASH);
                    setAuthenticated(true);
                } else {
                    setError(true);
                    setShake(true);
                    setCode("");
                    setTimeout(() => { setShake(false); setError(false); }, 1500);
                }
            }, 200);
        }
    };

    if (checking) return null;
    if (authenticated) return <>{children}</>;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                background: "radial-gradient(ellipse at 50% 50%, #020f1a 0%, #010814 100%)",
            }}
        >
            {/* Background hex grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2 L58 18 L58 50 L30 66 L2 50 L2 18 Z' fill='none' stroke='%2300d4ff' stroke-width='1'/%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center gap-8"
            >
                {/* Shield icon */}
                <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                        background: "radial-gradient(circle, rgba(0,212,255,0.15), rgba(0,212,255,0.02))",
                        border: "2px solid rgba(0,212,255,0.3)",
                        boxShadow: "0 0 40px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.05)",
                    }}
                    animate={{
                        boxShadow: [
                            "0 0 30px rgba(0,212,255,0.1), inset 0 0 15px rgba(0,212,255,0.03)",
                            "0 0 50px rgba(0,212,255,0.25), inset 0 0 25px rgba(0,212,255,0.08)",
                            "0 0 30px rgba(0,212,255,0.1), inset 0 0 15px rgba(0,212,255,0.03)",
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {error ? (
                        <AlertTriangle className="w-9 h-9 text-red-400" />
                    ) : (
                        <Fingerprint className="w-9 h-9 text-[#00d4ff]" />
                    )}
                </motion.div>

                {/* Title */}
                <div className="text-center">
                    <h1
                        className="font-orbitron text-2xl font-bold tracking-[0.3em] mb-2"
                        style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}
                    >
                        M.A.X.
                    </h1>
                    <p
                        className="font-mono text-xs tracking-[0.15em] uppercase"
                        style={{ color: "rgba(194,234,248,0.4)" }}
                    >
                        {error ? "ACCESS DENIED — TRY AGAIN" : "ENTER ACCESS CODE"}
                    </p>
                </div>

                {/* PIN dots */}
                <motion.div
                    className="flex gap-4"
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-4 h-4 rounded-full transition-all duration-200"
                            style={{
                                background: i < code.length
                                    ? error ? "#ef4444" : "#00d4ff"
                                    : "rgba(0,212,255,0.1)",
                                boxShadow: i < code.length
                                    ? error ? "0 0 10px rgba(239,68,68,0.5)" : "0 0 10px rgba(0,212,255,0.5)"
                                    : "none",
                                border: `1px solid ${i < code.length ? (error ? "rgba(239,68,68,0.5)" : "rgba(0,212,255,0.5)") : "rgba(0,212,255,0.15)"}`,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Number pad */}
                <div className="grid grid-cols-3 gap-3">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key) => {
                        if (key === "") return <div key="empty" />;
                        return (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (key === "⌫") {
                                        setCode((p) => p.slice(0, -1));
                                        setError(false);
                                    } else {
                                        handleKeyPress(key);
                                    }
                                }}
                                className="w-16 h-16 rounded-xl flex items-center justify-center font-orbitron text-xl font-medium cursor-pointer transition-all duration-200"
                                style={{
                                    background: "rgba(0,212,255,0.04)",
                                    border: "1px solid rgba(0,212,255,0.12)",
                                    color: key === "⌫" ? "rgba(194,234,248,0.4)" : "#e2e8f0",
                                    fontSize: key === "⌫" ? "24px" : undefined,
                                }}
                            >
                                {key}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Hidden keyboard input for desktop */}
                <form onSubmit={handleSubmit} className="absolute opacity-0 pointer-events-none">
                    <input
                        ref={inputRef}
                        type="password"
                        value={code}
                        onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setCode(v);
                            if (v.length === 4) {
                                setTimeout(() => handleSubmit(), 200);
                            }
                        }}
                    />
                </form>

                <p className="font-mono text-[10px] text-[rgba(194,234,248,0.25)] tracking-widest">
                    AUTHORIZED PERSONNEL ONLY
                </p>
            </motion.div>
        </div>
    );
}
