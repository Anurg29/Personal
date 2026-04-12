"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type WakeWordOptions = {
  enabled: boolean;
  wakePhrases?: string[];
  onWake: () => void;
  verifySpeaker?: () => Promise<boolean>;
  cooldownMs?: number;
};

export function useWakeWordActivation({
  enabled,
  wakePhrases,
  onWake,
  verifySpeaker,
  cooldownMs = 8000,
}: WakeWordOptions) {
  const recognitionRef = useRef<any>(null);
  const activeRef = useRef(false);
  const checkingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const [supported, setSupported] = useState(true);

  const normalizedPhrases = useMemo(() => {
    const defaults = ["hey max", "hi max", "hello max", "hey max anurag"];
    return (wakePhrases && wakePhrases.length > 0 ? wakePhrases : defaults).map((p) =>
      p.toLowerCase().trim()
    );
  }, [wakePhrases]);

  useEffect(() => {
    if (!enabled) {
      if (recognitionRef.current && activeRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // no-op
        }
      }
      activeRef.current = false;
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event: any) => {
      const now = Date.now();
      if (now < cooldownUntilRef.current || checkingRef.current) return;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result?.isFinal) continue;

        const transcript: string = (result[0]?.transcript || "").toLowerCase().trim();
        const matched = normalizedPhrases.some((phrase) => transcript.includes(phrase));

        if (matched) {
          checkingRef.current = true;
          const isAuthorized = verifySpeaker ? await verifySpeaker() : true;
          checkingRef.current = false;

          if (isAuthorized) {
            cooldownUntilRef.current = now + cooldownMs;
            onWake();
          }
          break;
        }
      }
    };

    recognition.onerror = () => {
      // Keep quiet; listener auto-restarts via onend when possible.
    };

    recognition.onend = () => {
      if (!activeRef.current) return;
      try {
        recognition.start();
      } catch {
        // no-op
      }
    };

    try {
      recognition.start();
      activeRef.current = true;
    } catch {
      activeRef.current = false;
    }

    return () => {
      activeRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // no-op
        }
      }
    };
  }, [enabled, normalizedPhrases, onWake, verifySpeaker, cooldownMs]);

  return { wakeWordSupported: supported };
}
