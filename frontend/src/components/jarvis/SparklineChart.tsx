"use client";

import { useRef, useEffect } from "react";

interface SparklineChartProps {
    data: number[];
    color: string;
    fillColor: string;
    min: number;
    max: number;
    title: string;
}

export function SparklineChart({ data, color, fillColor, min, max, title }: SparklineChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        canvas.width = W;
        canvas.height = H;
        if (!W || !H) return;

        ctx.clearRect(0, 0, W, H);
        const range = max - min;
        const step = W / (data.length - 1);

        // grid lines
        ctx.strokeStyle = "rgba(0,212,255,.06)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = (H * i) / 3;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // fill
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, fillColor);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(0, H);
        data.forEach((v, i) => {
            const x = i * step;
            const y = H - ((v - min) / range) * H;
            i === 0 ? ctx.moveTo(x, H) : ctx.lineTo(x, y);
        });
        ctx.lineTo((data.length - 1) * step, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // line
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        data.forEach((v, i) => {
            const x = i * step;
            const y = H - ((v - min) / range) * H;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // dot at end
        const lx = (data.length - 1) * step;
        const ly = H - ((data[data.length - 1] - min) / range) * H;
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.fill();
    }, [data, color, fillColor, min, max]);

    return (
        <div className="j-chart-wrap">
            <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: "8px", letterSpacing: "2px", color: "rgba(194,234,248,.4)", marginBottom: "4px" }}>
                {title}
            </div>
            <canvas ref={canvasRef} style={{ width: "100%", height: "60px", display: "block" }} />
        </div>
    );
}

interface HealthChartProps { data: number[]; }

export function HealthChart({ data }: HealthChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        canvas.width = W;
        canvas.height = H;
        if (!W || !H) return;

        ctx.clearRect(0, 0, W, H);

        // grid
        ctx.strokeStyle = "rgba(0,212,255,.06)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) { const y = (H * i) / 5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        for (let i = 0; i < 12; i++) { const x = (W * i) / 11; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

        const step = W / (data.length - 1);

        // area
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, "rgba(0,212,255,.25)");
        grd.addColorStop(1, "rgba(0,212,255,0)");
        ctx.beginPath();
        ctx.moveTo(0, H);
        data.forEach((v, i) => { const x = i * step, y = H - ((v - 50) / 60) * H; i === 0 ? ctx.moveTo(x, H) : ctx.lineTo(x, y); });
        ctx.lineTo((data.length - 1) * step, H);
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();

        // system line
        ctx.beginPath();
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 8;
        data.forEach((v, i) => { const x = i * step, y = H - ((v - 50) / 60) * H; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();

        // network line
        ctx.beginPath();
        ctx.strokeStyle = "#00ff9d";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#00ff9d";
        ctx.shadowBlur = 6;
        data.forEach((v, i) => {
            const nv = v - 15 + Math.random() * 5;
            const x = i * step, y = H - ((nv - 50) / 60) * H;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // legend
        ctx.shadowBlur = 0;
        ctx.font = "9px var(--font-mono), monospace";
        ctx.fillStyle = "rgba(0,212,255,.6)";
        ctx.fillText("■ SYSTEM", 8, H - 6);
        ctx.fillStyle = "rgba(0,255,157,.6)";
        ctx.fillText("■ NETWORK", 80, H - 6);
    }, [data]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "calc(100% - 24px)", display: "block", marginTop: "4px" }} />;
}
