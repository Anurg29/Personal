"use client";
import { useEffect, useState } from "react";

export function AudioVisualizerRing({ 
    isActive = false, 
    isListening = false, 
    size = 400 
}: { 
    isActive?: boolean, 
    isListening?: boolean, 
    size?: number 
}) {
    // 64 bars around the circle
    const [bars, setBars] = useState<number[]>(Array(50).fill(0));
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let animationId: number;
        let angle = 0;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            // Spin the entire group slowly
            angle += 0.1;
            setRotation(angle);

            // Audio simulation logic
            setBars(prev => prev.map(() => {
                if (isActive) {
                    // "Speaking" / "Processing" mode - highly active
                    return 0.4 + Math.random() * 0.6;
                } else if (isListening) {
                    // "Listening" mode - medium, pulsing
                    return 0.1 + Math.random() * 0.3;
                } else {
                    // Idle mode - flat baseline
                    return 0.02 + Math.random() * 0.05;
                }
            }));
        };
        animate();
        return () => cancelAnimationFrame(animationId);
    }, [isActive, isListening]);

    const activeColor = isActive ? "#00ffff" : isListening ? "#00ff9d" : "#006080";
    
    return (
        <div style={{ position: 'relative', width: size, height: size, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ filter: `drop-shadow(0 0 12px ${activeColor}40)` }}>
                {/* Outermost ring */}
                <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="2" />
                
                {/* Dashed data ring */}
                <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="0.5" strokeDasharray="3 6" />
                
                {/* The rotating visualizer bars */}
                <g transform={`rotate(${rotation} 100 100)`}>
                    {bars.map((val, i) => {
                        const angle = (i / bars.length) * 360;
                        const len = 3 + (val * 12); // Length scales on activity
                        return (
                            <g key={i} transform={`translate(100, 100) rotate(${angle})`}>
                                <line x1="38" y1="0" x2={38 + len} y2="0" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx={38 + len + 3} cy="0" r="0.8" fill="rgba(0,212,255,0.6)" />
                            </g>
                        );
                    })}
                </g>

                {/* Inner mechanical ring */}
                <circle cx="100" cy="100" r="32" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.5" strokeDasharray="1 3" />
                
                {/* Pulsing Core */}
                <path 
                    d="M 100 82 L 105 95 L 118 100 L 105 105 L 100 118 L 95 105 L 82 100 L 95 95 Z" 
                    fill={activeColor} 
                    style={{ 
                        filter: `drop-shadow(0 0 15px ${activeColor}) drop-shadow(0 0 30px ${activeColor})`,
                        transition: 'fill 0.3s ease, transform 0.1s ease',
                        transformOrigin: '100px 100px',
                        transform: `scale(${isActive ? 1.1 + Math.random()*0.1 : isListening ? 1.05 : 1})`
                    }} 
                />
            </svg>
            
            {/* Overlay Text for aesthetic */}
            <div style={{ position: "absolute", top: "15%", fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(0,212,255,0.4)" }}>0°</div>
            <div style={{ position: "absolute", bottom: "15%", fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(0,212,255,0.4)" }}>180°</div>
            <div style={{ position: "absolute", left: "15%", fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(0,212,255,0.4)" }}>270°</div>
            <div style={{ position: "absolute", right: "15%", fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(0,212,255,0.4)" }}>90°</div>
        </div>
    );
}
