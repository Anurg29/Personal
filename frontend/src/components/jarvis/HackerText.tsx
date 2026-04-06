"use client";
import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?/[]";

export function HackerText({ text, speed = 30, delay = 0, className = "" }: { text: string, speed?: number, delay?: number, className?: string }) {
    const [display, setDisplay] = useState(text.replace(/./g, "\u00A0"));

    useEffect(() => {
        let iterations = 0;
        let interval: any;
        
        // Wait for potential delay
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplay(prev => {
                    const next = text.split("").map((letter, index) => {
                        if (letter === " ") return " ";
                        if (index < iterations) return text[index];
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    }).join("");
                    
                    if (iterations >= text.length) {
                        clearInterval(interval);
                        return text; // ensure perfect end state
                    }
                    
                    iterations += 1 / 3; // speed of deciphering
                    return next;
                });
            }, speed);
        }, delay);

        return () => { clearTimeout(timeout); clearInterval(interval); };
    }, [text, speed, delay]);

    return <span className={className}>{display}</span>;
}
