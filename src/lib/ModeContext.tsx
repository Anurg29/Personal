"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AppMode = "portfolio" | "transforming" | "assistant";

interface ModeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    triggerTransformation: () => void;
    exitAssistant: () => void;
}

const ModeContext = createContext<ModeContextType | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<AppMode>("portfolio");

    // Persist mode in localStorage
    useEffect(() => {
        const saved = localStorage.getItem("ark-mode");
        if (saved === "assistant") {
            setMode("assistant");
        }
    }, []);

    useEffect(() => {
        if (mode === "assistant") {
            localStorage.setItem("ark-mode", "assistant");
        } else if (mode === "portfolio") {
            localStorage.removeItem("ark-mode");
        }
    }, [mode]);

    const triggerTransformation = () => {
        setMode("transforming");
        // After animation completes, switch to assistant
        setTimeout(() => {
            setMode("assistant");
        }, 3500); // 3.5s animation
    };

    const exitAssistant = () => {
        setMode("portfolio");
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, triggerTransformation, exitAssistant }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const ctx = useContext(ModeContext);
    if (!ctx) throw new Error("useMode must be used within ModeProvider");
    return ctx;
}
