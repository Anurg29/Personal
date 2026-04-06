"use client";

import { useEffect, useRef } from "react";

export function JarvisParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        let W = (c.width = window.innerWidth);
        let H = (c.height = window.innerHeight);

        interface Particle { x: number; y: number; vx: number; vy: number; r: number; }
        let pts: Particle[] = [];

        function makePts() {
            W = c!.width = window.innerWidth;
            H = c!.height = window.innerHeight;
            pts = [];
            for (let i = 0; i < 60; i++) {
                pts.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.5,
                });
            }
        }
        makePts();

        const onResize = () => makePts();
        window.addEventListener("resize", onResize);

        let raf: number;
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, W, H);
            pts.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0,212,255,.25)";
                ctx.fill();
                pts.forEach((p2) => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - d / 120)})`;
                        ctx.stroke();
                    }
                });
            });
            raf = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
