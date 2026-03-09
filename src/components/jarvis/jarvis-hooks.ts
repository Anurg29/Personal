"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Battery, Globe, Cloud, Sun, CloudRain, CloudSnow, CloudLightning,
    Wind, Droplets, Thermometer, MapPin, Sunrise, Sunset, Calendar,
} from "lucide-react";

/* ═══════════════════════════════ TYPES ═══════════════════════════════ */

interface WeatherData {
    temp: number; feels_like: number; humidity: number; wind_speed: number;
    description: string; icon: string; city: string; country: string;
    sunrise: number; sunset: number;
}

interface ActivityEvent { text: string; color: string; time: string; }
interface ChatMsg { text: string; type: "j" | "u"; }

/* ═══════════════════════════════ HELPERS ═══════════════════════════════ */

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function getWeatherIcon(icon: string) {
    if (icon.includes("01")) return Sun;
    if (icon.includes("02") || icon.includes("03") || icon.includes("04")) return Cloud;
    if (icon.includes("09") || icon.includes("10")) return CloudRain;
    if (icon.includes("11")) return CloudLightning;
    if (icon.includes("13")) return CloudSnow;
    return Wind;
}

function fmtTime(ts: number) {
    return new Date(ts * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const WORLD_CLOCKS = [
    { city: "New York", tz: "America/New_York", flag: "🗽" },
    { city: "London", tz: "Europe/London", flag: "🇬🇧" },
    { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
];

const RESPONSES = [
    "All systems are operating at peak efficiency, Anurag. Arc Reactor sustaining at 97.4%.",
    "CareFlow backend is healthy. 4 active API endpoints, avg latency 38ms. No anomalies detected.",
    "Diagnostic complete. CPU usage nominal. Memory allocation at 82%. Network throughput stable.",
    "Threat scan initiated… Perimeter secure. No unauthorized access attempts in the last 24 hours.",
    "Good day, Anurag. I've been monitoring your systems since 06:00. Everything is optimal.",
    "Network analysis shows peak throughput at 09:42. Recommend scheduling heavy tasks between 02:00–04:00.",
    "I've flagged 2 low-priority alerts for your review. Both relate to certificate renewals next week.",
    "Running full stack diagnostics now… 247 processes verified. 0 critical failures. Standing by.",
    "Voice authentication confirmed. Welcome back, sir. Shall I brief you on overnight activity?",
    "Processing your query… Cross-referencing 18 data streams. Response confidence: 99.2%.",
];

const LOG_EVENTS = [
    { t: "NEURAL SYNC", c: "b" }, { t: "PACKET RECV", c: "b" }, { t: "CACHE FLUSH", c: "g" },
    { t: "AUTH CHECK", c: "b" }, { t: "FIREWALL HIT", c: "w" }, { t: "API CALLED", c: "g" },
    { t: "TEMP SPIKE", c: "r" }, { t: "PROC SPAWN", c: "b" }, { t: "DATA STREAM", c: "b" },
    { t: "BACKUP PING", c: "g" }, { t: "TLS RENEW", c: "b" }, { t: "OBJ DETECT", c: "w" },
];

/* ═══════════════════════════════ HOOKS ═══════════════════════════════ */

function useBattery() {
    const [level, setLevel] = useState(85);
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).getBattery?.().then((bat: any) => {
                setLevel(Math.round(bat.level * 100));
                bat.addEventListener("levelchange", () => setLevel(Math.round(bat.level * 100)));
            });
        } catch { /* not supported */ }
    }, []);
    return level;
}

function useClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
    return time;
}

function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    useEffect(() => {
        const fallback = (): WeatherData => ({
            temp: 28, feels_like: 30, humidity: 65, wind_speed: 12, description: "partly cloudy",
            icon: "02d", city: "Pune", country: "IN",
            sunrise: Math.floor(Date.now() / 1000) - 3600, sunset: Math.floor(Date.now() / 1000) + 3600,
        });
        const fetchW = async () => {
            if (!navigator.geolocation) { setWeather(fallback()); return; }
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                    if (!key) { setWeather(fallback()); return; }
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${key}`);
                    if (!res.ok) { setWeather(fallback()); return; }
                    const d = await res.json();
                    setWeather({
                        temp: Math.round(d.main.temp), feels_like: Math.round(d.main.feels_like),
                        humidity: d.main.humidity, wind_speed: Math.round(d.wind.speed * 3.6),
                        description: d.weather[0].description, icon: d.weather[0].icon,
                        city: d.name, country: d.sys.country, sunrise: d.sys.sunrise, sunset: d.sys.sunset,
                    });
                } catch { setWeather(fallback()); }
            }, () => setWeather(fallback()));
        };
        fetchW();
        const iv = setInterval(fetchW, 600000);
        return () => clearInterval(iv);
    }, []);
    return weather;
}

export { useBattery, useClock, useWeather, rnd, getWeatherIcon, fmtTime, WORLD_CLOCKS, RESPONSES, LOG_EVENTS };
export type { WeatherData, ActivityEvent, ChatMsg };
