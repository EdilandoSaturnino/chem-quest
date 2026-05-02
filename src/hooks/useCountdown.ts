import { useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  totalSeconds: number;
  running: boolean;
  onFinish?: () => void;
}

interface UseCountdownReturn {
  secondsLeft: number;
  isLow: boolean;
  formatted: string;
}

export function useCountdown({
  totalSeconds,
  running,
  onFinish,
}: UseCountdownOptions): UseCountdownReturn {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            onFinish?.();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onFinish]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return {
    secondsLeft,
    isLow: secondsLeft <= 30,
    formatted,
  };
}