"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialSeconds: number = 0) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (secondsLeft <= 0) return;
    setIsRunning(true);
  }, [secondsLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setIsRunning(false);
    setSecondsLeft(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  const setDuration = useCallback((secs: number) => {
    setSecondsLeft(secs);
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  return {
    secondsLeft,
    isRunning,
    isFinished: secondsLeft === 0 && !isRunning,
    start,
    pause,
    reset,
    setDuration,
  };
}
