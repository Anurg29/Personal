"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./jarvis-hud.css";
import { JarvisParticles } from "./JarvisParticles";
import { HackerText } from "./HackerText";
import { HolographicGlobe } from "./HolographicGlobe";
import { AudioVisualizerRing } from "./AudioVisualizerRing";
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
    const [isAIResponding, setIsAIResponding] = useState(false);
    
    const [dashData, setDashData] = useState<{ tasks: any[]; strategies: any[] }>({
        tasks: [], strategies: []
    });
    const [gitEvent, setGitEvent] = useState<any>(null);

    const chatRef = useRef<HTMLDivElement>(null);
    const respIdx = useRef(0);
    const recogRef = useRef<ReturnType<typeof Object> | null>(null);

    // Init activity log + voice
    const addActivity = useCallback((text: string, color: string) => {
        const now = new Date().toTimeString().slice(0, 8);
        setActivities((p) => [{ text, color, time: now }, ...p].slice(0, 12));
    }, []);
    
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
            r.continuous = true;
            r.interimResults = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            r.onresult = (e: any) => { 
                const transcript = e.results[e.results.length - 1][0].transcript.trim();
                const lowerT = transcript.toLowerCase();
                
                if (lowerT.includes("hey max") || lowerT.includes("hey macs") || lowerT.includes("hay max")) {
                    setCmdInput(transcript);
                    setMessages((p) => [...p, { text: transcript, type: "u" }]);
                    
                    setTimeout(() => {
                        setIsAIResponding(true);
                        setMessages((p) => [...p, { text: "How can I assist you today, sir?", type: "j" }]);
                        
                        const synth = window.speechSynthesis;
                        synth.cancel(); 
                        const utter = new SpeechSynthesisUtterance("How can I assist you today, sir?");
                        const voices = synth.getVoices();
                        const maxVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Daniel") || v.name.includes("Alex"));
                        if (maxVoice) utter.voice = maxVoice;
                        utter.rate = 0.92; utter.pitch = 0.85;
                        utter.onend = () => setIsAIResponding(false);
                        synth.speak(utter);
                    }, 500);
                } else {
                    setCmdInput(transcript); 
                    sendCmd(transcript); 
                }
            };
            r.onend = () => setListening(false);
            r.onerror = () => setListening(false);
            recogRef.current = r;
        }

        // Fetch Dashboard Data
        fetch("http://localhost:8000/api/dashboard")
            .then(r => r.json())
            .then(d => setDashData(d))
            .catch(() => console.error("Failed to load dashboard data"));

        // Poll GitHub Data Live
        const fetchGit = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/github");
                const data = await res.json();
                const pushEvents = data.events?.filter((e: any) => e.type === "PushEvent");
                if (pushEvents && pushEvents.length > 0) {
                    setGitEvent((prev: any) => {
                        const latest = pushEvents[0];
                        if (!prev || prev.id !== latest.id) {
                            return latest;
                        }
                        return prev;
                    });
                }
            } catch (e) {}
        };
        fetchGit();
        const gitIv = setInterval(fetchGit, 20000); // 20s polling

        return () => clearInterval(gitIv);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // GitHub Auto-Notifier
    useEffect(() => {
        if (gitEvent && gitEvent.repo) {
            const repoName = gitEvent.repo.name.split("/").pop() || "unknown";
            const commitMsg = gitEvent.payload?.commits?.[0]?.message || "Push event detected";
            addActivity(`GITHUB → ${repoName} UPDATED`, "g");
            
            // Log it in the chat without speaking over the user
            setMessages((p) => [...p, { text: `[NETWORK ALERT] Repository ${repoName} was updated: "${commitMsg}"`, type: "j" }]);
        }
    }, [gitEvent, addActivity]);

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

    const sendCmd = useCallback(async (text: string) => {
        if (!text.trim()) return;
        setMessages((p) => [...p, { text, type: "u" }]);
        setCmdInput("");
        addActivity("USER → COMMAND", "g");
        
        setIsAIResponding(true);
        let finalResponse = RESPONSES[respIdx.current % RESPONSES.length];
        
        try {
            addActivity("M.A.X. → ANALYZING QUERY", "b");
            // Direct link to the synchronous Groq-powered Chat API!
            const res = await fetch("http://localhost:8000/api/chat/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [{ role: "user", content: text }] })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.reply) {
                    finalResponse = data.reply.replace(/[*_#`~>]/g, '');
                } else {
                    finalResponse = "Sir, my neural net encountered an error while processing that data.";
                }
            } else {
                finalResponse = "Sir, I am unable to authenticate with the core API. Please check your network.";
            }
        } catch (e) {
            // This catches HTTPS -> HTTP mixed content errors when running on GitHub Pages
            finalResponse = "Network error while reaching secure channels. The local backend server may be offline or blocked by your browser.";
        }

        setTimeout(() => {
            setMessages((p) => [...p, { text: finalResponse, type: "j" }]);
            respIdx.current++;
            addActivity("M.A.X. → RESPONDED", "b");
            
            // Speak the response natively
            const synth = window.speechSynthesis;
            synth.cancel();
            const utter = new SpeechSynthesisUtterance(finalResponse);
            const voices = synth.getVoices();
            const maxVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Daniel") || v.name.includes("Alex"));
            if (maxVoice) utter.voice = maxVoice;
            utter.rate = 0.95; utter.pitch = 0.85;
            utter.onend = () => setIsAIResponding(false);
            synth.speak(utter);
            
        }, 800);
    }, [addActivity]);

    const runDailyBriefing = useCallback(async () => {
        setIsAIResponding(true);
        addActivity("M.A.X. → FETCHING BRIEFING", "b");
        
        try {
            // Attempt to hit real backend, fallback to local text if offline
            const res = await fetch("http://localhost:8000/api/briefing").catch(() => null);
            let data = res ? await res.json() : null;
            
            if (!data) {
                data = { tasks: [ "You have 3 unread emails.", "Your next meeting is at 10:30 AM.", "VFX render due at 4:00 PM." ] };
            }
            
            const tStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const dStr = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
            
            let speechText = `Good morning, Anurag. It is ${tStr} on ${dStr}. `;
            if (weather) {
                speechText += `It is currently ${weather.temp} degrees and ${weather.description}. `;
            }
            data.tasks.forEach((t: string) => { speechText += `${t} `; });
            
            const synth = window.speechSynthesis;
            synth.cancel(); // clear queue
            const utter = new SpeechSynthesisUtterance(speechText);
            
            // Try to find a good authoritative voice
            const voices = synth.getVoices();
            const maxVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Daniel") || v.name.includes("Alex"));
            if (maxVoice) utter.voice = maxVoice;
            utter.rate = 0.92;
            utter.pitch = 0.85; // slightly deeper robot
            
            utter.onend = () => setIsAIResponding(false);
            
            setMessages(p => [...p, { text: speechText, type: "j" }]);
            synth.speak(utter);
            
        } catch (e) {
            setIsAIResponding(false);
            addActivity("CORE ERROR", "r");
        }
    }, [addActivity, weather]);

    const toggleMic = useCallback(() => {
        if (!recogRef.current) { addActivity("VOICE N/A", "w"); return; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = recogRef.current as any;
        if (listening) { r.stop(); } else { r.start(); setListening(true); }
    }, [listening, addActivity]);

    const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
    const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(time);

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
                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 24, fontWeight: 700, color: "#00d4ff", letterSpacing: 2, textShadow: "0 0 20px #00d4ff", lineHeight: 1.2 }}>{timeStr}</div>
                        <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: 10, color: "rgba(194,234,248,.6)", letterSpacing: 1 }}>on {dateStr}</div>
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

                {/* ── CENTRAL VOICE AI LAYOUT ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "60px", position: "relative", zIndex: 10, padding: "0 50px" }}>

                    {/* Giant Core (Left) - Main Focus */}
                    <div onClick={() => runDailyBriefing()} style={{ cursor: "pointer", transition: "transform 0.3s", flexShrink: 0 }}>
                        <AudioVisualizerRing size={550} isListening={listening} isActive={isAIResponding} />
                    </div>

                    {/* Conversation Box (Right) - Shrunk & Unobtrusive */}
                    <div style={{ display: "flex", flexDirection: "column", width: "320px", flexShrink: 0, background: "rgba(0,10,20,0.3)", border: "1px solid rgba(0,212,255,0.05)", borderRadius: 6, padding: 15, boxShadow: "0 0 15px rgba(0,0,0,0.6)" }}>
                        
                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(0,212,255,0.3)", marginBottom: 12, borderBottom: "1px solid rgba(0,212,255,0.05)", paddingBottom: 6 }}>
                            SECURE COMMS LINK ACTIVE
                        </div>

                        {/* Chat Feed */}
                        <div ref={chatRef} style={{ width: "100%", height: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none" }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, width: "100%" }}>
                                    <div style={{ fontSize: 9, alignSelf: "flex-start", color: m.type === "j" ? "#00d4ff" : "rgba(194,234,248,.3)", fontFamily: "var(--font-mono)", flexShrink: 0, width: "40px", marginTop: 2 }}>
                                        {m.type === "j" ? "M.A.X." : "USER"}
                                    </div>
                                    <div style={{ fontSize: 11, lineHeight: 1.4, color: m.type === "j" ? "rgba(0,212,255,0.9)" : "rgba(194,234,248,.6)", fontFamily: "var(--font-mono)" }}>
                                        <HackerText text={m.text} speed={15} />{m.type === "j" && i === messages.length - 1 && <span className="j-cblink" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div style={{ width: "100%", display: "flex", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 3, padding: "8px 10px", background: "rgba(0,20,35,0.4)", marginTop: 15, alignItems: "center" }}>
                            <span style={{ color: "#00d4ff", opacity: 0.6, fontSize: 10 }}>&gt;</span>
                            <input type="text" placeholder="Command..."
                                   style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#00d4ff", fontFamily: "var(--font-mono)", fontSize: 10, marginLeft: 8 }}
                                   value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                                   onKeyDown={(e) => { if (e.key === "Enter") sendCmd(cmdInput); }} autoComplete="off" />
                            <button onClick={isAIResponding ? () => {} : toggleMic} style={{
                                background: isAIResponding ? "rgba(0,255,255,0.1)" : listening ? "rgba(255,59,59,0.8)" : "transparent",
                                color: isAIResponding ? "#00ffff" : listening ? "#fff" : "rgba(0,212,255,0.5)",
                                padding: "4px 8px", border: listening ? "1px solid #ff3b3b" : "1px solid rgba(0,212,255,0.2)",
                                fontFamily: "var(--font-mono)", fontSize: 8, cursor: "pointer", marginLeft: 8, letterSpacing: 1, borderRadius: 2
                            }}>
                                {listening ? "REC" : isAIResponding ? "SPK" : "MIC"}
                            </button>
                        </div>
                    </div>

                    {/* TASKS HUD overlay around the edges */}
                    <div style={{ position: "absolute", bottom: 40, left: 60 }}>
                        <div style={{ fontFamily: "var(--font-orbitron),sans-serif", color: "rgba(0,212,255,0.6)", fontSize: 11, marginBottom: 15, letterSpacing: 3 }}>URGENT TASKS</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {dashData.tasks.map((task: any, i: number) => (
                                <div key={i} style={{ display: "flex", gap: 20 }}>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", color: task.status === 'urgent' ? "#ff3b3b" : "rgba(194,234,248,.8)", fontSize: 11 }}>
                                        <HackerText text={task.title} speed={25} delay={i * 200} />
                                    </span>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", color: task.status === 'urgent' ? "#ff3b3b" : "#ffb300", fontSize: 10 }}>[{task.status.toUpperCase()}]</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GITHUB NETWORK overlay */}
                    {gitEvent && gitEvent.repo && (
                        <div style={{ position: "absolute", bottom: 40, right: 60, textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-orbitron),sans-serif", color: "rgba(0,212,255,0.6)", fontSize: 11, marginBottom: 15, letterSpacing: 3 }}>GITHUB NETWORK</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                                <div style={{ display: "flex", gap: 15 }}>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", color: "#00ff9d", fontSize: 10 }}>[PUSH DETECTED]</span>
                                    <span style={{ fontFamily: "var(--font-mono),monospace", color: "rgba(194,234,248,.8)", fontSize: 11 }}>
                                        <HackerText text={gitEvent.repo.name} speed={20} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: "var(--font-mono),monospace", color: "rgba(194,234,248,.4)", fontSize: 9, maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                   {gitEvent.payload?.commits?.[0]?.message || 'Code pushed to branch'}
                                </div>
                                <div style={{ fontFamily: "var(--font-mono),monospace", color: "rgba(194,234,248,.3)", fontSize: 8, marginTop: 4 }}>
                                   T-MINUS {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
