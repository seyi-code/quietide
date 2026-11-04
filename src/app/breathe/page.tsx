"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BreathingPacer } from "@/components/BreathingPacer";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import type { BreathingPattern } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

function BreatheContent() {
  const searchParams = useSearchParams();
  const isSos = searchParams.get("sos") === "1";

  const preferred = useAppStore((s) => s.preferredBreathing);
  const setPreferred = useAppStore((s) => s.setPreferredBreathing);
  const addSession = useAppStore((s) => s.addSession);

  const [pattern, setPattern] = useState<BreathingPattern>(isSos ? "box" : preferred);
  const [isActive, setIsActive] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [sosDone, setSosDone] = useState(false);

  // SOS: do NOT auto-start — user taps Begin when ready.
  // Once running, auto-end after 90 seconds.
  useEffect(() => {
    if (isSos && isActive && startedAt) {
      const t = setTimeout(() => {
        setIsActive(false);
        if (startedAt) {
          const duration = Math.floor((Date.now() - startedAt.getTime()) / 1000);
          addSession({
            mode: "sos",
            durationSeconds: duration,
            startedAt: startedAt.toISOString(),
            completed: true,
          });
        }
        setStartedAt(null);
        setSosDone(true);
      }, 90000);
      return () => clearTimeout(t);
    }
  }, [isSos, isActive, startedAt, addSession]);

  const start = () => {
    setIsActive(true);
    setStartedAt(new Date());
    setSosDone(false);
  };

  const stop = () => {
    setIsActive(false);
    if (startedAt) {
      const duration = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      addSession({
        mode: isSos ? "sos" : "relax",
        durationSeconds: duration,
        startedAt: startedAt.toISOString(),
        completed: true,
      });
    }
    setStartedAt(null);
  };

  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-quietide-soft">
          {isSos ? "Stress SOS" : "Breathe"}
        </h1>
      </div>

      {isSos && (
        <p className="rounded-2xl border border-quietide-primary/20 bg-quietide-primary/5 px-4 py-3 text-sm text-quietide-soft">
          {sosDone
            ? "Well done. You just gave your nervous system a short reset."
            : "Follow the circle. Inhale, hold, exhale. Just 90 seconds."}
        </p>
      )}

      <BreathingPacer pattern={pattern} isActive={isActive} />

      {!isSos && (
        <div className="flex flex-wrap gap-2 justify-center">
          {(["box", "478", "coherent"] as BreathingPattern[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPattern(p);
                setPreferred(p);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                pattern === p
                  ? "bg-quietide-primary text-white"
                  : "bg-quietide-card text-quietide-muted hover:text-quietide-soft"
              }`}
            >
              {p === "box" ? "Box" : p === "478" ? "4-7-8" : "Coherent"}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button size="lg" onClick={start}>
            {isSos ? (sosDone ? "Again" : "Begin") : "Begin"}
          </Button>
        ) : (
          <Button size="lg" variant="secondary" onClick={stop}>
            End Session
          </Button>
        )}
      </div>
    </main>
  );
}

export default function BreathePage() {
  return (
    <Suspense fallback={<div className="text-quietide-muted">Loading…</div>}>
      <BreatheContent />
    </Suspense>
  );
}
