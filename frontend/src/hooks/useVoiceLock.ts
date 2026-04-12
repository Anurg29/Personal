"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Meyda from "meyda";

const PROFILE_KEY = "max_voice_profile_v1";
const ENABLED_KEY = "max_voice_lock_enabled_v1";
const MATCH_THRESHOLD = 0.84;

type VoiceVector = number[];

function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function averageVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const size = vectors[0].length;
  const out = new Array(size).fill(0);

  for (const vector of vectors) {
    for (let i = 0; i < size; i++) {
      out[i] += vector[i] || 0;
    }
  }

  for (let i = 0; i < size; i++) {
    out[i] /= vectors.length;
  }

  return out;
}

async function captureVoiceVector(durationMs: number): Promise<VoiceVector> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const context = new AudioCtx();
  const source = context.createMediaStreamSource(stream);

  const frames: number[][] = [];

  const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: context,
    source,
    bufferSize: 512,
    featureExtractors: ["mfcc", "rms"],
    callback: (features: any) => {
      if (!features) return;
      if ((features.rms || 0) < 0.01) return;
      if (Array.isArray(features.mfcc)) {
        frames.push(features.mfcc.slice(0, 13));
      }
    },
  });

  analyzer.start();

  await new Promise((resolve) => setTimeout(resolve, durationMs));

  analyzer.stop();
  source.disconnect();
  await context.close();
  stream.getTracks().forEach((t) => t.stop());

  return averageVectors(frames);
}

export function useVoiceLock() {
  const [hasProfile, setHasProfile] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      typeof navigator.mediaDevices?.getUserMedia === "function" &&
      !!(window.AudioContext || (window as any).webkitAudioContext)
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile = localStorage.getItem(PROFILE_KEY);
    const enabled = localStorage.getItem(ENABLED_KEY);
    setHasProfile(Boolean(profile));
    setIsEnabled(enabled === "true");
  }, []);

  const enrollVoice = useCallback(async () => {
    if (!supported) {
      setError("Voice lock is not supported in this browser.");
      return false;
    }

    try {
      setBusy(true);
      setError("");
      const vector = await captureVoiceVector(3000);
      if (vector.length === 0) {
        setError("No clear voice captured. Please retry in a quiet place.");
        return false;
      }

      localStorage.setItem(PROFILE_KEY, JSON.stringify(vector));
      localStorage.setItem(ENABLED_KEY, "true");
      setHasProfile(true);
      setIsEnabled(true);
      return true;
    } catch (e: any) {
      setError(e?.message || "Failed to enroll voice profile.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [supported]);

  const verifyCurrentSpeaker = useCallback(async () => {
    if (!isEnabled) return true;

    const profileRaw = localStorage.getItem(PROFILE_KEY);
    if (!profileRaw) return false;

    try {
      setBusy(true);
      setError("");
      const enrolled: number[] = JSON.parse(profileRaw);
      const current = await captureVoiceVector(1800);
      if (current.length === 0) return false;

      const score = cosineSimilarity(enrolled, current);
      setLastScore(score);
      return score >= MATCH_THRESHOLD;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  }, [isEnabled]);

  const setVoiceLockEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem(ENABLED_KEY, String(enabled));
    setIsEnabled(enabled);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(ENABLED_KEY);
    setHasProfile(false);
    setIsEnabled(false);
    setLastScore(null);
  }, []);

  return {
    voiceLockSupported: supported,
    hasVoiceProfile: hasProfile,
    isVoiceLockEnabled: isEnabled,
    voiceLockBusy: busy,
    lastVoiceMatchScore: lastScore,
    voiceLockError: error,
    enrollVoice,
    verifyCurrentSpeaker,
    setVoiceLockEnabled,
    clearProfile,
  };
}
