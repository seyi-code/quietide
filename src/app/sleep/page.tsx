"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SoundMixer } from "@/components/SoundMixer";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { audioEngine } from "@/lib/audioEngine";
import { ArrowLeft, Moon } from "lucide-react";

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function SleepPage() {
  const sleepTimerMinutes = useAppStore((s) => s.sleepTimerMinutes);
  const setSleepTimer = useAppStore((s) => s.setSleepTimer);
  const addSession = useAppStore((s) => s.addSession);
  const sounds = useAppStore((s) => s.sounds);

  const duration = (sleepTimerMinutes ?? 0) * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset, setDuration } =
    useTimer(duration);

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const fadeTriggered = useRef(false);
  const activeCount = sounds.filter((s) => s.active).length;

  useEffect(() => {
    if (sleepTimerMinutes) setDuration(sleepTimerMinutes * 60);
  }, [sleepTimerMinutes, setDuration]);

  useEffect(() => {
    if (isRunning && secondsLeft <= 30 && secondsLeft > 0 && !fadeTriggered.current) {
      fadeTriggered.current = true;
      audioEngine.fadeOut(28);
    }
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (isFinished && startedAt) {
      const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      addSession({
        mode: "sleep",
        durationSeconds: elapsed,
        startedAt: startedAt.toISOString(),
        completed: true,
      });
      setStartedAt(null);
      setSleepTimer(null);
      fadeTriggered.current = false;
      audioEngine.stopAll();
    }
  }, [isFinished, startedAt, addSession, setSleepTimer]);

  const handleStart = () => {
    if (!sleepTimerMinutes) setSleepTimer(30);
    setStartedAt(new Date());
    fadeTriggered.current = false;
    start();
  };

  const handleStop = () => {
    pause();
    audioEngine.stopAll();
    if (startedAt) {
      const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      addSession({
        mode: "sleep",
        durationSeconds: elapsed,
        startedAt: startedAt.toISOString(),
        completed: false,
      });
    }
    setStartedAt(null);
    fadeTriggered.current = false;
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
        <h1 className="text-2xl font-semibold text-quietide-soft">Sleep</h1>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/5 bg-quietide-card p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-quietide-primary/10 text-quietide-primary">
          <Moon className="h-7 w-7" />
        </div>
        <div className="text-5xl font-light tabular-nums text-quietide-soft">
          {sleepTimerMinutes ? formatTime(secondsLeft) : "--:--"}
        </div>
        <p className="text-sm text-quietide-muted text-center">
          {isRunning && secondsLeft <= 30
            ? "Gently fading out…"
            : isRunning
            ? "Rest well"
            : activeCount > 0
            ? `${activeCount} sound layer${activeCount > 1 ? "s" : ""} ready`
            : "Choose sounds & a timer"}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {TIMER_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSleepTimer(m);
                reset(m * 60);
                fadeTriggered.current = false;
              }}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                sleepTimerMinutes === m
                  ? "bg-quietide-primary text-white"
                  : "bg-white/5 text-quietide-muted hover:text-quietide-soft"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={handleStart} disabled={!sleepTimerMinutes}>
              Start Sleep
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={handleStop}>
              End Session
            </Button>
          )}
          <Button
            size="lg"
            variant="ghost"
            onClick={() => {
              reset(duration);
              setStartedAt(null);
              fadeTriggered.current = false;
              audioEngine.stopAll();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <SoundMixer />
    </main>
  );
}
