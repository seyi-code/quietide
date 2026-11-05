"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { BreathingPattern } from "@/lib/types";
import { hapticLight } from "@/lib/haptics";
import { useAppStore } from "@/store/useAppStore";

interface BreathingPacerProps {
  pattern: BreathingPattern;
  isActive: boolean;
  className?: string;
}

const patterns: Record<
  BreathingPattern,
  { inhale: number; hold1: number; exhale: number; hold2: number; label: string }
> = {
  box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, label: "Box Breathing" },
  "478": { inhale: 4, hold1: 7, exhale: 8, hold2: 0, label: "4-7-8 Breathing" },
  coherent: { inhale: 5.5, hold1: 0, exhale: 5.5, hold2: 0, label: "Coherent Breathing" },
};

export function BreathingPacer({ pattern, isActive, className }: BreathingPacerProps) {
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [scale, setScale] = useState(1);
  const config = patterns[pattern];
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const lastPhase = useRef<string>("");

  // Soft haptic on inhale / exhale transitions
  useEffect(() => {
    if (!isActive || !hapticsEnabled) return;
    if (phase === lastPhase.current) return;
    lastPhase.current = phase;
    if (phase === "inhale" || phase === "exhale") {
      hapticLight();
    }
  }, [phase, isActive, hapticsEnabled]);

  useEffect(() => {
    if (!isActive) {
      setPhase("inhale");
      setScale(1);
      lastPhase.current = "";
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const cycle = () => {
      if (cancelled) return;
      setPhase("inhale");
      setScale(1.25);
      timeout = setTimeout(() => {
        if (cancelled) return;
        if (config.hold1 > 0) {
          setPhase("hold1");
          timeout = setTimeout(() => {
            if (cancelled) return;
            setPhase("exhale");
            setScale(1);
            timeout = setTimeout(() => {
              if (cancelled) return;
              if (config.hold2 > 0) {
                setPhase("hold2");
                timeout = setTimeout(cycle, config.hold2 * 1000);
              } else {
                cycle();
              }
            }, config.exhale * 1000);
          }, config.hold1 * 1000);
        } else {
          setPhase("exhale");
          setScale(1);
          timeout = setTimeout(cycle, config.exhale * 1000);
        }
      }, config.inhale * 1000);
    };

    cycle();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isActive, pattern, config]);

  const phaseLabel =
    phase === "inhale"
      ? "Inhale"
      : phase === "hold1" || phase === "hold2"
      ? "Hold"
      : "Exhale";

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br from-quietide-primary/30 to-quietide-secondary/20 transition-all duration-[4000ms] ease-in-out",
            isActive && "animate-pulse-soft"
          )}
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full border border-quietide-strong bg-quietide-surface/80 backdrop-blur-sm transition-transform duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${scale * 0.95})` }}
        >
          <span className="text-2xl font-medium text-quietide-soft">{phaseLabel}</span>
        </div>
      </div>
      <p className="text-sm text-quietide-muted">{config.label}</p>
    </div>
  );
}
