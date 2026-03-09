"use client";

import { ModeProvider, useMode } from "@/lib/ModeContext";
import { Header } from "@/components/layout/Header";
import { HUDBackground } from "@/components/layout/HUDBackground";
import { FloatingChatbot } from "@/components/chatbot/FloatingChatbot";
import { TransformAnimation } from "@/components/transformation/TransformAnimation";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ParticleBackground } from "@/components/widgets/ParticleBackground";
import { StickyNotes } from "@/components/widgets/StickyNotes";
import { PomodoroTimer } from "@/components/widgets/PomodoroTimer";
import { AuthGate } from "@/components/auth/AuthGate";

function LayoutInner({ children }: { children: React.ReactNode }) {
    const { mode } = useMode();
    const isAssistant = mode === "assistant";

    const content = (
        <>
            {/* 3D Particle background in assistant mode */}
            {isAssistant && <ParticleBackground />}

            {/* HUD background only in assistant mode */}
            {isAssistant && <HUDBackground />}

            {/* Transformation animation overlay */}
            <TransformAnimation isActive={mode === "transforming"} />

            <div className="relative z-10">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
            </div>

            {/* Floating chatbot (hidden during transformation) */}
            <FloatingChatbot />

            {/* Command Palette (Cmd+K) — only in assistant mode */}
            <CommandPalette />

            {/* Sticky Notes — only in assistant mode */}
            {isAssistant && <StickyNotes />}

            {/* Pomodoro Timer — only in assistant mode */}
            {isAssistant && <PomodoroTimer />}
        </>
    );

    // Wrap assistant mode with authentication gate
    if (isAssistant) {
        return <AuthGate>{content}</AuthGate>;
    }

    return content;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ModeProvider>
            <LayoutInner>{children}</LayoutInner>
        </ModeProvider>
    );
}
