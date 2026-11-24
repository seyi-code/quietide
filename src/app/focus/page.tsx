"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SoundMixer } from "@/components/SoundMixer";
import { FocusHistoryChart } from "@/components/FocusHistoryChart";
import { useTimer } from "@/hooks/useTimer";
import { useAppStore } from "@/store/useAppStore";
import { formatTime } from "@/lib/utils";
import { audioEngine } from "@/lib/audioEngine";
import { playSoftChime } from "@/lib/chime";
import { hapticLight } from "@/lib/haptics";
import { requestKeepAwake, releaseKeepAwake } from "@/lib/keepAwake";
import { ArrowLeft } from "lucide-react";

export default function FocusPage() {
  const workMin = useAppStore((s) => s.focusWorkMinutes);
  const breakMin = useAppStore((s) => s.focusBreakMinutes);
  const addSession = useAppStore((s) => s.addSession);
  const focusSoundEnabled = useAppStore((s) => s.focusSoundEnabled);
  const setFocusSoundEnabled = useAppStore((s) => s.setFocusSoundEnabled);
  const focusChimeEnabled = useAppStore((s) => s.focusChimeEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const sounds = useAppStore((s) => s.sounds);
  const sessions = useAppStore((s) => s.sessions);

  const [phase, setPhase] = useState<"work" | "break">("work");
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const loggedRef = useRef(false);

  const duration = (phase === "work" ? workMin : breakMin) * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset, setDuration } =
    useTimer(duration);

  useEffect(() => {
    setDuration(duration);
  }, [phase, duration, setDuration]);

  useEffect(() => {
    if (phase === "work" && isRunning && focusSoundEnabled) {
      sounds.forEach((s) => {
        if (s.active)
          audioEngine.setLayer(
            s.id as "brown" | "rain" | "ocean" | "forest" | "wind",
            true,
            s.volume
          );
      });
    } else if (phase === "break") {
      audioEngine.setMasterVolume(0.25);
    }
  }, [phase, isRunning, focusSoundEnabled, sounds]);

  useEffect(() => {
    if (isRunning) requestKeepAwake();
    else releaseKeepAwake();
    return () => {
      releaseKeepAwake();
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isFinished) return;
    if (focusChimeEnabled) playSoftChime();
    if (hapticsEnabled) hapticLight();

    if (phase === "work" && !loggedRef.current) {
      loggedRef.current = true;
      const elapsed = startedAt
        ? Math.floor((Date.now() - startedAt.getTime()) / 1000)
        : workMin * 60;
      addSession({
        mode: "focus",
        durationSeconds: Math.max(elapsed, 1),
        startedAt: (startedAt ?? new Date()).toISOString(),
        completed: true,
      });
      setPhase("break");
      loggedRef.current = false;
      setStartedAt(new Date());
      audioEngine.setMasterVolume(0.65);
    } else if (phase === "break") {
      setPhase("work");
      setStartedAt(new Date());
    }
  }, [isFinished, phase, workMin, addSession, focusChimeEnabled, hapticsEnabled, startedAt]);

  const handleStart = () => {
    if (!startedAt) setStartedAt(new Date());
    loggedRef.current = false;
    start();
  };

  const skipBreak = () => {
    if (phase !== "break") return;
    setPhase("work");
    setStartedAt(new Date());
    reset(workMin * 60);
    audioEngine.setMasterVolume(0.65);
  };

  const handleReset = () => {
    pause();
    reset((phase === "work" ? workMin : breakMin) * 60);
    setPhase("work");
    setStartedAt(null);
    loggedRef.current = false;
    audioEngine.stopAll();
    releaseKeepAwake();
  };

  const progress = duration > 0 ? 1 - secondsLeft / duration : 0;

  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-quietide-soft">Focus</h1>
      </div>

      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-sm uppercase tracking-widest text-quietide-muted">
          {phase === "work" ? "Deep Work" : "Break"}
        </p>

        <div className="relative flex h-44 w-44 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(var(--q-border) / 0.08)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(var(--q-primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="text-5xl font-light tabular-nums text-quietide-soft">
            {formatTime(secondsLeft)}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={handleStart}>
              {startedAt ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={pause}>
              Pause
            </Button>
          )}
          {phase === "break" && (
            <Button size="lg" variant="ghost" onClick={skipBreak}>
              Skip break
            </Button>
          )}
          <Button size="lg" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <label className="flex items-center justify-between rounded-2xl border border-quietide bg-quietide-card px-4 py-3">
        <span className="text-sm text-quietide-soft">Soft ambient during work</span>
        <input
          type="checkbox"
          checked={focusSoundEnabled}
          onChange={(e) => setFocusSoundEnabled(e.target.checked)}
          className="h-5 w-5 accent-quietide-primary"
        />
      </label>

      {focusSoundEnabled && <SoundMixer />}

      <p className="text-center text-sm text-quietide-muted">
        {workMin} min work · {breakMin} min break · change in Settings
      </p>

      <FocusHistoryChart sessions={sessions} />
    </main>
  );
}
