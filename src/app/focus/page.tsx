"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTimer } from "@/hooks/useTimer";
import { useAppStore } from "@/store/useAppStore";
import { formatTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function FocusPage() {
  const workMin = useAppStore((s) => s.focusWorkMinutes);
  const breakMin = useAppStore((s) => s.focusBreakMinutes);
  const addSession = useAppStore((s) => s.addSession);

  const [phase, setPhase] = useState<"work" | "break">("work");
  const duration = (phase === "work" ? workMin : breakMin) * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset, setDuration } =
    useTimer(duration);

  useEffect(() => {
    setDuration(duration);
  }, [phase, duration, setDuration]);

  useEffect(() => {
    if (isFinished) {
      if (phase === "work") {
        addSession({
          mode: "focus",
          durationSeconds: workMin * 60,
          startedAt: new Date().toISOString(),
          completed: true,
        });
        setPhase("break");
      } else {
        setPhase("work");
      }
    }
  }, [isFinished, phase, workMin, addSession]);

  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-quietide-soft">Focus</h1>
      </div>

      <div className="flex flex-col items-center gap-6 py-12">
        <p className="text-sm uppercase tracking-widest text-quietide-muted">
          {phase === "work" ? "Deep Work" : "Break"}
        </p>
        <div className="text-6xl font-light tabular-nums text-quietide-soft">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={start}>
              Start
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={pause}>
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="ghost"
            onClick={() => {
              reset(duration);
              setPhase("work");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-quietide-muted">
        Default: {workMin} min work · {breakMin} min break. Change in Settings later.
      </p>
    </main>
  );
}
