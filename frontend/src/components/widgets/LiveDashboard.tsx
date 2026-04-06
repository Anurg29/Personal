"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Cloud,
    Sun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Wind,
    Droplets,
    Thermometer,
    MapPin,
    Sunrise,
    Sunset,
    Calendar,
    Battery,
    Globe,
} from "lucide-react";

/* ────────────────────────── Weather helpers ────────────────────────── */

interface WeatherData {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
    city: string;
    country: string;
    sunrise: number;
    sunset: number;
}

function getWeatherIcon(icon: string) {
    if (icon.includes("01")) return Sun;
    if (icon.includes("02") || icon.includes("03") || icon.includes("04")) return Cloud;
    if (icon.includes("09") || icon.includes("10")) return CloudRain;
    if (icon.includes("11")) return CloudLightning;
    if (icon.includes("13")) return CloudSnow;
    return Wind;
}

function fmtTime(ts: number) {
    return new Date(ts * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

/* ────────────────────────── World clocks ────────────────────────── */

const WORLD_CLOCKS = [
    { city: "New York", tz: "America/New_York", flag: "🗽" },
    { city: "London", tz: "Europe/London", flag: "🇬🇧" },
    { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
];

/* ────────────────────────── Mini Calendar ────────────────────────── */

function MiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = useMemo(() => {
        const arr: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) arr.push(null);
        for (let d = 1; d <= daysInMonth; d++) arr.push(d);
        return arr;
    }, [firstDay, daysInMonth]);

    const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div>
            <p className="text-[9px] font-mono text-[#00d4ff]/40 tracking-[0.2em] uppercase mb-2">
                {monthName}
            </p>
            <div className="grid grid-cols-7 gap-[2px]">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`h-${i}`} className="text-center text-[8px] font-mono text-[#64748b]/50 pb-1">
                        {d}
                    </div>
                ))}
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`text-center text-[9px] font-mono rounded-sm py-[2px] ${day === today
                            ? "bg-[#00d4ff]/20 text-[#00d4ff] font-bold shadow-[0_0_6px_rgba(0,212,255,0.3)]"
                            : day
                                ? "text-[#94a3b8]/60"
                                : ""
                            }`}
                    >
                        {day || ""}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ────────────────────────── Main Component ────────────────────────── */

export function LiveDashboard() {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [greeting, setGreeting] = useState("");
    const [batteryLevel, setBatteryLevel] = useState(85);

    // Live clock — tick every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Greeting
    useEffect(() => {
        const h = time.getHours();
        if (h < 6) setGreeting("Good Night");
        else if (h < 12) setGreeting("Good Morning");
        else if (h < 17) setGreeting("Good Afternoon");
        else if (h < 21) setGreeting("Good Evening");
        else setGreeting("Good Night");
    }, [time]);

    // Battery API (if available)
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).getBattery?.().then((bat: any) => {
                setBatteryLevel(Math.round(bat.level * 100));
                bat.addEventListener("levelchange", () =>
                    setBatteryLevel(Math.round(bat.level * 100))
                );
            });
        } catch {
            /* not supported */
        }
    }, []);

    // Fetch weather
    useEffect(() => {
        const setFallback = () => {
            setWeather({
                temp: 28,
                feels_like: 30,
                humidity: 65,
                wind_speed: 12,
                description: "partly cloudy",
                icon: "02d",
                city: "Pune",
                country: "IN",
                sunrise: Math.floor(Date.now() / 1000) - 3600,
                sunset: Math.floor(Date.now() / 1000) + 3600,
            });
        };

        const fetchWeather = async () => {
            if (!navigator.geolocation) return setFallback();
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                        if (!key) return setFallback();
                        const res = await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${key}`
                        );
                        if (!res.ok) return setFallback();
                        const d = await res.json();
                        setWeather({
                            temp: Math.round(d.main.temp),
                            feels_like: Math.round(d.main.feels_like),
                            humidity: d.main.humidity,
                            wind_speed: Math.round(d.wind.speed * 3.6),
                            description: d.weather[0].description,
                            icon: d.weather[0].icon,
                            city: d.name,
                            country: d.sys.country,
                            sunrise: d.sys.sunrise,
                            sunset: d.sys.sunset,
                        });
                    } catch {
                        setFallback();
                    }
                },
                () => setFallback()
            );
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000);
        return () => clearInterval(interval);
    }, []);

    const WeatherIcon = weather ? getWeatherIcon(weather.icon) : Sun;
    const dateStr = time.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            className="rounded-xl overflow-hidden"
            style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(0,212,255,0.15)",
                backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* ── Row 1: Greeting + Clock ── */}
            <div className="px-5 pt-5 pb-4 border-b border-[rgba(0,212,255,0.08)]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[#00d4ff]/50 text-[10px] font-mono tracking-[0.2em] uppercase mb-1">
                            Hey, {greeting}
                        </p>
                        <div className="font-orbitron text-[28px] font-bold text-[#e2e8f0] tracking-wider leading-none">
                            {time.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                            <motion.span
                                className="text-sm text-[#00d4ff]/40 ml-1"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {time.toLocaleTimeString("en-US", { second: "2-digit" }).slice(-2)}s
                            </motion.span>
                        </div>
                        <p className="text-[#64748b] text-[10px] font-mono mt-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#00d4ff]/30" />
                            {dateStr}
                        </p>
                    </div>
                    {/* Battery indicator */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.08)]">
                        <Battery
                            className="w-3.5 h-3.5"
                            style={{
                                color:
                                    batteryLevel > 50
                                        ? "#22c55e"
                                        : batteryLevel > 20
                                            ? "#f59e0b"
                                            : "#ef4444",
                            }}
                        />
                        <span className="text-[10px] font-mono text-[#94a3b8]">{batteryLevel}%</span>
                    </div>
                </div>
            </div>

            {/* ── Row 2: Weather ── */}
            {weather && (
                <div className="px-5 py-4 border-b border-[rgba(0,212,255,0.08)]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                    background: "rgba(0,212,255,0.06)",
                                    border: "1px solid rgba(0,212,255,0.1)",
                                }}
                            >
                                <WeatherIcon className="w-5 h-5 text-[#00d4ff]/60" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-orbitron text-2xl font-bold text-[#e2e8f0]">
                                        {weather.temp}°
                                    </span>
                                    <span className="text-[#64748b] text-xs font-mono">C</span>
                                </div>
                                <p className="text-[#94a3b8] text-[10px] capitalize font-mono">
                                    {weather.description}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <MapPin className="w-2.5 h-2.5 text-[#00d4ff]/40" />
                                <span className="text-[10px] font-mono text-[#94a3b8]">
                                    {weather.city}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Weather micro-stats */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { icon: Thermometer, label: "Feels", value: `${weather.feels_like}°`, color: "#f59e0b" },
                            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "#3b82f6" },
                            { icon: Wind, label: "Wind", value: `${weather.wind_speed}km`, color: "#10b981" },
                            { icon: Sunrise, label: "Rise", value: fmtTime(weather.sunrise), color: "#f97316" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <s.icon className="w-3 h-3 mx-auto mb-0.5" style={{ color: s.color, opacity: 0.6 }} />
                                <p className="text-[10px] font-mono font-medium text-[#e2e8f0]">{s.value}</p>
                                <p className="text-[7px] font-mono text-[#64748b] uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 justify-end text-[#64748b]">
                        <Sunset className="w-2.5 h-2.5 text-[#f97316]/40" />
                        <span className="text-[9px] font-mono">Sunset {fmtTime(weather.sunset)}</span>
                    </div>
                </div>
            )}

            {/* ── Row 3: World Clocks + Mini Calendar ── */}
            <div className="px-5 py-4 grid grid-cols-[1fr_auto] gap-4">
                {/* World clocks */}
                <div>
                    <div className="flex items-center gap-1.5 mb-3">
                        <Globe className="w-3 h-3 text-[#00d4ff]/30" />
                        <p className="text-[9px] font-mono text-[#00d4ff]/40 tracking-[0.2em] uppercase">
                            World Clock
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {WORLD_CLOCKS.map((wc) => (
                            <div key={wc.city} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px]">{wc.flag}</span>
                                    <span className="text-[10px] font-mono text-[#94a3b8]">{wc.city}</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#e2e8f0] tabular-nums">
                                    {time.toLocaleTimeString("en-US", {
                                        timeZone: wc.tz,
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini calendar */}
                <div className="border-l border-[rgba(0,212,255,0.08)] pl-4">
                    <MiniCalendar />
                </div>
            </div>
        </motion.div>
    );
}
