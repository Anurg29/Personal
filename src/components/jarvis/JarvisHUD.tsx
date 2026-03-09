"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./jarvis-hud.css";
import { JarvisParticles } from "./JarvisParticles";
import { SparklineChart, HealthChart } from "./SparklineChart";
import {
    useBattery, useClock, useWeather, rnd, getWeatherIcon, fmtTime,
    WORLD_CLOCKS, RESPONSES, LOG_EVENTS,
} from "./jarvis-hooks";
import type { ActivityEvent, ChatMsg } from "./jarvis-hooks";
import {
    Battery, Globe, Calendar, Thermometer, Droplets, Wind,
    MapPin, Sunrise, Sunset,
} from "lucide-react";

/* ════════════════════════════ CORNER DECO ════════════════════════════ */
function CornerDeco() {
    const svg = (
        <svg viewBox="0 0 70 70"><line x1="0" y1="0" x2="45" y2="0" /><line x1="0" y1="0" x2="0" y2="45" /><line x1="8" y1="0" x2="8" y2="8" /><line x1="0" y1="8" x2="8" y2="8" /></svg>
    );
    return (<>
        <div className="j-cdeco j-cd1">{svg}</div><div className="j-cdeco j-cd2">{svg}</div>
        <div className="j-cdeco j-cd3">{svg}</div><div className="j-cdeco j-cd4">{svg}</div>
    </>);
}

/* ════════════════════════════ RADAR ════════════════════════════ */
function Radar() {
    return (
        <svg viewBox="0 0 130 130" style={{ width: 130, height: 130 }}>
            <defs>
                <radialGradient id="jsg" cx="0%" cy="50%" r="100%">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.5" />
                </radialGradient>
            </defs>
            <circle fill="none" stroke="rgba(0,212,255,.15)" strokeWidth="1" cx="65" cy="65" r="60" />
            <circle fill="none" stroke="rgba(0,212,255,.15)" strokeWidth="1" cx="65" cy="65" r="42" />
            <circle fill="none" stroke="rgba(0,212,255,.15)" strokeWidth="1" cx="65" cy="65" r="24" />
            <line stroke="rgba(0,212,255,.12)" strokeWidth="1" x1="65" y1="5" x2="65" y2="125" />
            <line stroke="rgba(0,212,255,.12)" strokeWidth="1" x1="5" y1="65" x2="125" y2="65" />
            <line stroke="rgba(0,212,255,.12)" strokeWidth="1" x1="22" y1="22" x2="108" y2="108" />
            <line stroke="rgba(0,212,255,.12)" strokeWidth="1" x1="108" y1="22" x2="22" y2="108" />
            <g className="j-rsweep">
                <path d="M65 65 L125 65 A60 60 0 0 0 65 5 Z" fill="url(#jsg)" opacity=".4" />
            </g>
            <circle className="j-rblip" cx="82" cy="40" r="3" fill="#00d4ff" style={{ filter: "drop-shadow(0 0 4px #00d4ff)" }} />
            <circle className="j-rblip2" cx="45" cy="78" r="3" fill="#ff3b3b" style={{ filter: "drop-shadow(0 0 4px #ff3b3b)" }} />
            <circle className="j-rblip3" cx="90" cy="72" r="2.5" fill="#ffb300" style={{ filter: "drop-shadow(0 0 4px #ffb300)" }} />
            <text x="65" y="68" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="7" fill="rgba(0,212,255,.5)">CLEAR</text>
        </svg>
    );
}

/* ════════════════════════════ RING GAUGE ════════════════════════════ */
function RingGauge({ value, size, color, label }: { value: number; size: number; color: string; label: string }) {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - value / 100);
    const bgColor = color === "#00d4ff" ? "rgba(0,212,255,.1)" : color === "#00ff9d" ? "rgba(0,255,157,.1)" : "rgba(255,179,0,.1)";
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ position: "relative" }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                    <circle fill="none" stroke={bgColor} strokeWidth="5" cx={size / 2} cy={size / 2} r={r} />
                    <circle fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" cx={size / 2} cy={size / 2} r={r}
                        strokeDasharray={circ} strokeDashoffset={offset}
                        style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dashoffset .8s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-orbitron),sans-serif", fontSize: 9, color }}>{value}%</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.4)", letterSpacing: 1 }}>{label}</div>
        </div>
    );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export function JarvisHUD() {
    const time = useClock();
    const batteryLevel = useBattery();
    const weather = useWeather();

    // Live data arrays
    const [cpuData, setCpuData] = useState(() => Array.from({ length: 50 }, () => 40 + Math.random() * 40));
    const [netData, setNetData] = useState(() => Array.from({ length: 50 }, () => Math.random() * 8));
    const [memData, setMemData] = useState(() => Array.from({ length: 50 }, () => 70 + Math.random() * 20));
    const [healthData, setHealthData] = useState(() => Array.from({ length: 60 }, () => 75 + Math.random() * 20));

    // Live stats
    const [cpu, setCpu] = useState(60);
    const [mem, setMem] = useState(80);
    const [gpu, setGpu] = useState(40);
    const [arcPct, setArcPct] = useState(80);
    const [reactorPower, setReactorPower] = useState("97.4");
    const [tempVal, setTempVal] = useState(31);
    const [voltVal, setVoltVal] = useState("3.7");
    const [outVal, setOutVal] = useState("14.2");
    const [netUp, setNetUp] = useState("2.4");
    const [netDn, setNetDn] = useState("5.8");
    const [pingVal, setPingVal] = useState(12);
    const [procVal, setProcVal] = useState(142);
    const [apiCount, setApiCount] = useState(1843);

    // Chat & activity
    const [messages, setMessages] = useState<ChatMsg[]>([
        { text: "All systems nominal. M.A.X. Core at 97.4%. Good to see you, Anurag.", type: "j" },
    ]);
    const [activities, setActivities] = useState<ActivityEvent[]>([]);
    const [cmdInput, setCmdInput] = useState("");
    const [listening, setListening] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const respIdx = useRef(0);
    const recogRef = useRef<ReturnType<typeof Object> | null>(null);

    // Init activity log + voice
    useEffect(() => {
        const initItems = ["BOOT COMPLETE", "VOICE AUTH OK", "AI MODEL READY", "CAREFLOW SYNC", "NETWORK MAPPED"];
        const now = new Date().toTimeString().slice(0, 8);
        setActivities(initItems.map((t) => ({ text: t, color: "g", time: now })));

        // Voice recognition
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SR) {
            const r = new SR();
            r.lang = "en-US";
            r.interimResults = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            r.onresult = (e: any) => { const t = e.results[0][0].transcript; setCmdInput(t); sendCmd(t); };
            r.onend = () => setListening(false);
            r.onerror = () => setListening(false);
            recogRef.current = r;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Live data interval
    useEffect(() => {
        const iv = setInterval(() => {
            setCpuData((p) => [...p.slice(1), rnd(30, 90)]);
            setNetData((p) => [...p.slice(1), rnd(0, 9)]);
            setMemData((p) => [...p.slice(1), rnd(68, 95)]);
            setHealthData((p) => [...p.slice(1), rnd(60, 98)]);

            setArcPct(Math.floor(rnd(88, 99)));
            setReactorPower(rnd(94, 99.9).toFixed(1));
            setCpu(Math.floor(rnd(25, 85)));
            setMem(Math.floor(rnd(65, 95)));
            setGpu(Math.floor(rnd(20, 65)));
            setTempVal(Math.floor(rnd(28, 48)));
            setVoltVal(rnd(3.5, 3.9).toFixed(1));
            setOutVal(rnd(12, 18).toFixed(1));
            setNetUp(rnd(1, 5).toFixed(1));
            setNetDn(rnd(3, 10).toFixed(1));
            setPingVal(Math.floor(rnd(8, 45)));
            setProcVal(Math.floor(rnd(135, 165)));
            setApiCount((p) => p + Math.floor(rnd(1, 8)));

            // Random activity
            const ev = LOG_EVENTS[Math.floor(Math.random() * LOG_EVENTS.length)];
            const now = new Date().toTimeString().slice(0, 8);
            setActivities((p) => [{ text: ev.t, color: ev.c, time: now }, ...p].slice(0, 12));
        }, 1500);
        return () => clearInterval(iv);
    }, []);

    // Auto-scroll chat
    useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

    const addActivity = useCallback((text: string, color: string) => {
        const now = new Date().toTimeString().slice(0, 8);
        setActivities((p) => [{ text, color, time: now }, ...p].slice(0, 12));
    }, []);

    const sendCmd = useCallback((text: string) => {
        if (!text.trim()) return;
        setMessages((p) => [...p, { text, type: "u" }]);
        setCmdInput("");
        addActivity("USER → COMMAND", "g");
        setTimeout(() => {
            setMessages((p) => [...p, { text: RESPONSES[respIdx.current % RESPONSES.length], type: "j" }]);
            respIdx.current++;
            addActivity("M.A.X. → RESPONDED", "b");
        }, 700 + Math.random() * 500);
    }, [addActivity]);

    const toggleMic = useCallback(() => {
        if (!recogRef.current) { addActivity("VOICE N/A", "w"); return; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = recogRef.current as any;
        if (listening) { r.stop(); } else { r.start(); setListening(true); }
    }, [listening, addActivity]);

    const timeStr = time.toTimeString().slice(0, 8);
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const dateStr = `${days[time.getDay()]}, ${String(time.getDate()).padStart(2, "0")} ${months[time.getMonth()]} ${time.getFullYear()}`;

    const WeatherIcon = weather ? getWeatherIcon(weather.icon) : null;
    const arcOffset = 283 * (1 - arcPct / 100);
    const batColor = batteryLevel > 50 ? "#22c55e" : batteryLevel > 20 ? "#f59e0b" : "#ef4444";

    return (
        <div style={{ position: "fixed", inset: 0, background: "#010d14", overflow: "hidden", zIndex: 50 }}>
            <JarvisParticles />
            <div className="j-hexbg" />
            <div className="j-vig" />
            <div className="j-scanlines" />
            <CornerDeco />

            <div className="j-shell">
                {/* ── TOP BAR ── */}
                <header className="j-topbar">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div>
                            <div className="j-logo">M.A.X.</div>
                            <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)", letterSpacing: 2, marginTop: 2 }}>
                                MULTI-ACCESS EXPERIENCE v4.0 — PERSONAL INSTANCE
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(194,234,248,.4)" }}>SYSTEM CLOCK</div>
                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 22, fontWeight: 700, color: "#00d4ff", letterSpacing: 4, textShadow: "0 0 20px #00d4ff", lineHeight: 1 }}>{timeStr}</div>
                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)", letterSpacing: 2 }}>{dateStr}</div>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "flex-end" }}>
                        <div className="j-sdot" />
                        <div className="j-badge j-badge-green">ONLINE</div>
                        <div className="j-badge j-badge-gold">ANURAG — LVL 9</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="j-badge">
                            <Battery style={{ width: 12, height: 12, color: batColor }} />
                            <span style={{ color: batColor }}>{batteryLevel}%</span>
                        </div>
                    </div>
                </header>

                {/* ── MAIN GRID ── */}
                <div className="j-main">
                    {/* LEFT COLUMN */}
                    <div style={{ gridColumn: 1, gridRow: "1/3", display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* Arc power ring */}
                        <div className="j-pn" style={{ paddingBottom: 4 }}>
                            <div className="j-pn-lbl">arc power</div>
                            <div style={{ padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg style={{ width: 110, height: 110, transform: "rotate(-90deg)" }} viewBox="0 0 110 110">
                                        <circle fill="none" stroke="rgba(0,212,255,.1)" strokeWidth="8" strokeLinecap="round" cx="55" cy="55" r="45" />
                                        <circle fill="none" stroke="#00d4ff" strokeWidth="8" strokeLinecap="round" cx="55" cy="55" r="45"
                                            strokeDasharray="283" strokeDashoffset={arcOffset} style={{ filter: "drop-shadow(0 0 6px #00d4ff)", transition: "stroke-dashoffset .8s ease" }} />
                                    </svg>
                                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 16, color: "#00d4ff", textShadow: "0 0 12px #00d4ff" }}>{arcPct}%</div>
                                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.4)", letterSpacing: 1 }}>POWER</div>
                                    </div>
                                </div>
                            </div>
                            {/* Stats */}
                            {[
                                { label: "TEMP", value: `${tempVal}°C`, cls: "g" },
                                { label: "VOLTAGE", value: `${voltVal}V`, cls: "" },
                                { label: "OUTPUT", value: `${outVal}W`, cls: "w" },
                            ].map((s) => (
                                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", borderBottom: "1px solid rgba(0,212,255,.06)" }}>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)", letterSpacing: 1 }}>{s.label}</span>
                                    <span style={{
                                        fontFamily: "var(--font-orbitron),sans-serif", fontSize: 11,
                                        color: s.cls === "g" ? "#00ff9d" : s.cls === "w" ? "#ffb300" : "#00d4ff",
                                        textShadow: `0 0 8px ${s.cls === "g" ? "#00ff9d" : s.cls === "w" ? "#ffb300" : "#00d4ff"}`
                                    }}>{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* CPU / MEM / GPU rings */}
                        <div className="j-pn" style={{ padding: 8, flex: 1 }}>
                            <div className="j-pn-lbl">cpu / mem / gpu</div>
                            <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0", gap: 4 }}>
                                <RingGauge value={cpu} size={56} color="#00d4ff" label="CPU" />
                                <RingGauge value={mem} size={56} color="#00ff9d" label="MEM" />
                                <RingGauge value={gpu} size={56} color="#ffb300" label="GPU" />
                            </div>
                            {[
                                { label: "NETWORK ↑", value: `${netUp} MB/s`, cls: "" },
                                { label: "NETWORK ↓", value: `${netDn} MB/s`, cls: "g" },
                                { label: "PING", value: `${pingVal}ms`, cls: "w" },
                                { label: "PROCESSES", value: String(procVal), cls: "" },
                            ].map((s) => (
                                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", borderBottom: "1px solid rgba(0,212,255,.06)" }}>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)", letterSpacing: 1 }}>{s.label}</span>
                                    <span style={{
                                        fontFamily: "var(--font-orbitron),sans-serif", fontSize: 11,
                                        color: s.cls === "g" ? "#00ff9d" : s.cls === "w" ? "#ffb300" : "#00d4ff",
                                        textShadow: `0 0 8px ${s.cls === "g" ? "#00ff9d" : s.cls === "w" ? "#ffb300" : "#00d4ff"}`
                                    }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER TOP — Reactor + Charts */}
                    <div className="j-pn" style={{ gridColumn: 2, gridRow: 1, display: "flex", gap: 6 }}>
                        <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <div className="j-pn-lbl" style={{ alignSelf: "flex-start", padding: "8px 0 0 10px" }}>arc reactor</div>
                            <div className="j-reactor">
                                <div className="j-ro j-ro1" /><div className="j-ro j-ro2" /><div className="j-ro j-ro3" /><div className="j-ro j-ro4" />
                                <div className="j-halo" /><div className="j-halo" /><div className="j-halo" />
                                <div className="j-core" />
                            </div>
                            <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(194,234,248,.4)", marginTop: 8 }}>POWER CORE</div>
                            <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 20, fontWeight: 700, color: "#00d4ff", textShadow: "0 0 20px #00d4ff", lineHeight: 1 }}>{reactorPower}%</div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, padding: "6px 0" }}>
                            <SparklineChart data={cpuData} color="#00d4ff" fillColor="rgba(0,212,255,.2)" min={0} max={100} title="CPU LOAD — REAL-TIME" />
                            <SparklineChart data={netData} color="#00ff9d" fillColor="rgba(0,255,157,.15)" min={0} max={10} title="NETWORK THROUGHPUT (MB/s)" />
                            <SparklineChart data={memData} color="#ffb300" fillColor="rgba(255,179,0,.15)" min={50} max={100} title="MEMORY USAGE (%)" />
                        </div>
                    </div>

                    {/* CENTER BOTTOM */}
                    <div style={{ gridColumn: 2, gridRow: 2, display: "flex", gap: 6 }}>
                        <div className="j-pn" style={{ flex: 1, padding: "8px 12px" }}>
                            <div className="j-pn-lbl">system health — 60s history</div>
                            <HealthChart data={healthData} />
                        </div>
                        <div style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: 6 }}>
                            {[
                                { label: "UPTIME", value: "14d 7h", trend: "▲ STABLE", cls: "" },
                                { label: "TASKS DONE", value: "247", trend: "+3 TODAY", cls: "go" },
                                { label: "ALERTS", value: "2", trend: "LOW PRIORITY", cls: "warn" },
                                { label: "API CALLS", value: apiCount.toLocaleString(), trend: "SESSION", cls: "" },
                            ].map((c) => (
                                <div key={c.label} className={`j-stat-card ${c.cls}`}>
                                    <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.4)", letterSpacing: 2 }}>{c.label}</div>
                                    <div style={{
                                        fontFamily: "var(--font-orbitron),sans-serif", fontSize: 20, fontWeight: 700, lineHeight: 1,
                                        color: c.cls === "go" ? "#00ff9d" : c.cls === "warn" ? "#ffb300" : "#00d4ff",
                                        textShadow: `0 0 12px ${c.cls === "go" ? "#00ff9d" : c.cls === "warn" ? "#ffb300" : "#00d4ff"}`
                                    }}>{c.value}</div>
                                    <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)" }}>{c.trend}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ gridColumn: 3, gridRow: "1/3", display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* Radar */}
                        <div className="j-pn" style={{ padding: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div className="j-pn-lbl" style={{ alignSelf: "flex-start", width: "100%", marginBottom: 4 }}>threat radar</div>
                            <Radar />
                            <div style={{ display: "flex", gap: 10, fontFamily: "var(--font-mono),monospace", fontSize: 8, marginTop: 4 }}>
                                <span style={{ color: "#00d4ff" }}>● SYS</span>
                                <span style={{ color: "#ff3b3b" }}>● NET</span>
                                <span style={{ color: "#ffb300" }}>● EXT</span>
                            </div>
                        </div>

                        {/* Weather mini-panel */}
                        {weather && (
                            <div className="j-pn" style={{ padding: 8 }}>
                                <div className="j-pn-lbl">weather</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                                    {WeatherIcon && <WeatherIcon style={{ width: 18, height: 18, color: "#00d4ff", opacity: 0.6 }} />}
                                    <div>
                                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{weather.temp}°C</div>
                                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.4)", textTransform: "capitalize" }}>{weather.description}</div>
                                    </div>
                                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                                        <MapPin style={{ width: 10, height: 10, color: "rgba(0,212,255,.4)" }} />
                                        <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.6)" }}>{weather.city}</span>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                                    {[
                                        { Icon: Thermometer, label: "Feels", value: `${weather.feels_like}°`, color: "#f59e0b" },
                                        { Icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "#3b82f6" },
                                        { Icon: Wind, label: "Wind", value: `${weather.wind_speed}km`, color: "#10b981" },
                                        { Icon: Sunrise, label: "Rise", value: fmtTime(weather.sunrise), color: "#f97316" },
                                    ].map((s) => (
                                        <div key={s.label} style={{ textAlign: "center" }}>
                                            <s.Icon style={{ width: 10, height: 10, margin: "0 auto 2px", color: s.color, opacity: 0.6 }} />
                                            <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, fontWeight: 500, color: "#e2e8f0" }}>{s.value}</div>
                                            <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 7, color: "rgba(100,116,139,.7)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Activity log */}
                        <div className="j-pn" style={{ flex: 1, overflow: "hidden", padding: "0 8px 8px" }}>
                            <div className="j-pn-lbl" style={{ marginBottom: 4 }}>activity log</div>
                            <div style={{ overflow: "hidden", height: "calc(100% - 28px)" }}>
                                {activities.map((a, i) => (
                                    <div key={i} className="j-act-item">
                                        <div style={{
                                            width: 5, height: 5, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                                            background: a.color === "b" ? "#00d4ff" : a.color === "g" ? "#00ff9d" : a.color === "w" ? "#ffb300" : "#ff3b3b",
                                            boxShadow: `0 0 6px ${a.color === "b" ? "#00d4ff" : a.color === "g" ? "#00ff9d" : a.color === "w" ? "#ffb300" : "#ff3b3b"}`
                                        }} />
                                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 9, color: "rgba(194,234,248,.4)", lineHeight: 1.5 }}>{a.text}</div>
                                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.25)", marginLeft: "auto", flexShrink: 0 }}>{a.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BAR ── */}
                <div style={{ flex: "0 0 100px", display: "flex", gap: 6 }}>
                    {/* Command input */}
                    <div className="j-pn" style={{ flex: 1, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 11, color: "#00d4ff", letterSpacing: 2, textShadow: "0 0 10px #00d4ff", flexShrink: 0 }}>M.A.X. &gt;</div>
                            <input className="j-cmd-field" type="text" placeholder="Enter command or ask anything, Anurag…"
                                value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") sendCmd(cmdInput); }} autoComplete="off" />
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["STATUS", "DIAGNOSTICS", "CAREFLOW", "THREAT", "NETWORK", "GREET"].map((c) => (
                                <button key={c} className="j-chip" onClick={() => sendCmd(
                                    c === "STATUS" ? "System status report" : c === "DIAGNOSTICS" ? "Run full diagnostics" :
                                        c === "CAREFLOW" ? "Show CareFlow health" : c === "THREAT" ? "Threat scan" :
                                            c === "NETWORK" ? "Network analysis" : "Hey M.A.X."
                                )}>{c}</button>
                            ))}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="j-pn" ref={chatRef} style={{ flex: "0 0 280px", padding: "8px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, scrollbarWidth: "thin", scrollbarColor: "#006080 transparent" }}>
                        {messages.map((m, i) => (
                            <div key={i} className="j-msg">
                                <div style={{
                                    width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "var(--font-orbitron),sans-serif", fontSize: 7, flexShrink: 0, marginTop: 1, color: "#010d14",
                                    background: m.type === "j" ? "radial-gradient(circle,#00d4ff,#006080)" : "radial-gradient(circle,#ffb300,#7a4e00)",
                                    boxShadow: m.type === "j" ? "0 0 8px #00d4ff" : "0 0 8px #ffb300"
                                }}>
                                    {m.type === "j" ? "AI" : "YOU"}
                                </div>
                                <div style={{ fontSize: 12, lineHeight: 1.55, flex: 1, color: m.type === "j" ? "#00d4ff" : "rgba(194,234,248,.4)" }}>
                                    {m.text}{m.type === "j" && <span className="j-cblink" />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mic */}
                    <div className="j-pn" style={{ flex: "0 0 100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <button className={`j-mic-btn ${listening ? "on" : ""}`} onClick={toggleMic}>🎙</button>
                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 8, color: "rgba(194,234,248,.4)", letterSpacing: 2 }}>
                            {listening ? "LISTENING…" : "TAP TO SPEAK"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
