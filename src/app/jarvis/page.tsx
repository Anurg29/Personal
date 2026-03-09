"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with canvas, navigator APIs, etc.
const JarvisHUD = dynamic(
    () => import("@/components/jarvis/JarvisHUD").then((m) => m.JarvisHUD),
    {
        ssr: false, loading: () => (
            <div style={{ position: "fixed", inset: 0, background: "#010d14", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
                <div style={{ fontFamily: "Orbitron, sans-serif", color: "#00d4ff", fontSize: 24, letterSpacing: 8, textShadow: "0 0 30px #00d4ff", animation: "pulse 2s ease-in-out infinite" }}>
                    J.A.R.V.I.S.
                </div>
            </div>
        )
    }
);

export default function JarvisPage() {
    return <JarvisHUD />;
}
