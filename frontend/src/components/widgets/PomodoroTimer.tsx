"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain } from "lucide-react";

type TimerMode = "work" | "break";

export function PomodoroTimer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<TimerMode>("work");
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [sessions, setSessions] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const workTime = 25 * 60;
    const breakTime = 5 * 60;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer complete
            setIsRunning(false);
            // Play notification sound
            try {
                audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczFmCR0teleEgpWo7F3MF2QiNejtLgvnI7GV+P0+C9cDkZYJHU4LxxOR1glNXeuXA9IWie2N6xYTEsdr/x06E/F1WC0+TFjWBRM3zV5cuTYE8z");
                audioRef.current.play().catch(() => { });
            } catch { /* no audio */ }

            if (mode === "work") {
                setSessions((prev) => prev + 1);
                setMode("break");
                setTimeLeft(breakTime);
            } else {
                setMode("work");
                setTimeLeft(workTime);
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft, mode, workTime, breakTime]);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setMode("work");
        setTimeLeft(workTime);
    }, [workTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = mode === "work"
        ? ((workTime - timeLeft) / workTime) * 100
        : ((breakTime - timeLeft) / breakTime) * 100;
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <>
            {/* Trigger button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed top-20 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                style={{
                    background: isRunning ? "rgba(239,68,68,0.1)" : "rgba(0,212,255,0.05)",
                    border: `1px solid ${isRunning ? "rgba(239,68,68,0.3)" : "rgba(0,212,255,0.12)"}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
            >
                <Timer className={`w-3.5 h-3.5 ${isRunning ? "text-red-400" : "text-[#00d4ff]/60"}`} />
                <span className={`text-xs font-mono ${isRunning ? "text-red-400" : "text-[#94a3b8]"}`}>
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                {isRunning && (
                    <motion.div
                        className="w-2 h-2 rounded-full bg-red-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </motion.button>

            {/* Focus mode overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[90] flex items-center justify-center"
                        style={{ background: "rgba(2,8,23,0.92)", backdropFilter: "blur(8px)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(0,212,255,0.1)] transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Mode indicator */}
                            <motion.div
                                className="flex items-center gap-2 mb-8"
                                key={mode}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {mode === "work" ? (
                                    <Brain className="w-5 h-5 text-[#00d4ff]" />
                                ) : (
                                    <Coffee className="w-5 h-5 text-[#10b981]" />
                                )}
                                <span
                                    className="font-orbitron text-sm tracking-[0.3em] uppercase"
                                    style={{ color: mode === "work" ? "#00d4ff" : "#10b981" }}
                                >
                                    {mode === "work" ? "Focus Time" : "Break Time"}
                                </span>
                            </motion.div>

                            {/* Timer ring */}
                            <div className="relative mb-8">
                                <svg width="220" height="220" viewBox="0 0 200 200">
                                    {/* Background ring */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke={mode === "work" ? "#00d4ff10" : "#10b98110"}
                                        strokeWidth="6"
                                    />
                                    {/* Progress ring */}
                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke={mode === "work" ? "#00d4ff" : "#10b981"}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        animate={{ strokeDashoffset: offset }}
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            transformOrigin: "center",
                                            transform: "rotate(-90deg)",
                                            filter: `drop-shadow(0 0 10px ${mode === "work" ? "#00d4ff50" : "#10b98150"})`,
                                        }}
                                    />
                                </svg>
                                {/* Center time */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-orbitron text-5xl font-bold text-[#e2e8f0] tracking-wider">
                                        {String(minutes).padStart(2, "0")}
                                    </span>
                                    <motion.span
                                        className="font-orbitron text-5xl font-bold text-[#e2e8f0] tracking-wider"
                                        animate={{ opacity: isRunning ? [1, 0.3, 1] : 1 }}
                                        transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                                    >
                                        :{String(seconds).padStart(2, "0")}
                                    </motion.span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={resetTimer}
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.1)] transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={toggleTimer}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer"
                                    style={{
                                        background: isRunning
                                            ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                            : mode === "work"
                                                ? "linear-gradient(135deg, #00d4ff, #0066ff)"
                                                : "linear-gradient(135deg, #10b981, #059669)",
                                        boxShadow: isRunning
                                            ? "0 0 30px rgba(239,68,68,0.3)"
                                            : mode === "work"
                                                ? "0 0 30px rgba(0,212,255,0.3)"
                                                : "0 0 30px rgba(16,185,129,0.3)",
                                    }}
                                >
                                    {isRunning ? (
                                        <Pause className="w-6 h-6" />
                                    ) : (
                                        <Play className="w-6 h-6 ml-0.5" />
                                    )}
                                </button>
                                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-[rgba(0,212,255,0.1)]">
                                    <span className="font-orbitron text-lg font-bold text-[#00d4ff]">
                                        {sessions}
                                    </span>
                                    <span className="text-[7px] font-mono text-[#64748b] uppercase tracking-wider">
                                        Done
                                    </span>
                                </div>
                            </div>

                            {/* Session info */}
                            <p className="mt-6 text-xs font-mono text-[#64748b]/50">
                                {mode === "work" ? "25 min focus · 5 min break" : "Break ends soon..."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
