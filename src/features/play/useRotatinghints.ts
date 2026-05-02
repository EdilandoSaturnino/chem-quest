import { useEffect, useRef, useState } from "react";

interface UseRotatingHintsOptions {
  hints: readonly string[];
  rotationMs?: number;
  enabled?: boolean;
  fallback?: string;
}

export function useRotatingHints({
  hints,
  rotationMs = 10_000,
  enabled = true,
  fallback = "",
}: UseRotatingHintsOptions) {
  const [hintIdx, setHintIdx] = useState(0);
  const [transient, setTransient] = useState<{ text: string } | null>(null);

  const transientTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || hints.length <= 1) return;

    const id = setInterval(() => {
      setHintIdx((h) => (h + 1) % hints.length);
    }, rotationMs);

    return () => clearInterval(id);
  }, [enabled, hints.length, rotationMs]);

  const baseText = hints[hintIdx] ?? fallback;

  const bubbleText = transient
    ? transient.text
    : baseText
      ? `💡 ${baseText}`
      : fallback;

  function showTransient(text: string, durationMs = 5500) {
    setTransient({ text });

    if (transientTimerRef.current) {
      clearTimeout(transientTimerRef.current);
    }

    transientTimerRef.current = setTimeout(() => {
      setTransient(null);
    }, durationMs);
  }

  function resetHintIndex() {
    setHintIdx(0);
  }

  useEffect(() => {
    return () => {
      if (transientTimerRef.current) {
        clearTimeout(transientTimerRef.current);
      }
    };
  }, []);

  return {
    bubbleText,
    showTransient,
    resetHintIndex,
  };
}