"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SoundMixer } from "@/components/SoundMixer";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { audioEngine } from "@/lib/audioEngine";
import { hapticLight } from "@/lib/haptics";
import { requestKeepAwake, releaseKeepAwake } from "@/lib/keepAwake";
import { ArrowLeft, Moon } from "lucide-react";

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];
const FADE_SECONDS = 30;
const WARN_SECONDS = 5 * 60;

export default function SleepPage() {
  const sleepTimerMinutes = useAppStore((s) => s.sleepTimerMinutes);
  const setSleepTimer = useAppStore((s) => s.setSleepTimer);
  const addSession = useAppStore((s) => s.addSession);
  const sounds = useAppStore((s) => s.sounds);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);

  const duration = (sleepTimerMinutes ?? 0) * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset, setDuration } =
    useTimer(duration);

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const fadeTriggered = useRef(false);
  const warnTriggered = useRef(false);
  const activeCount = sounds.filter((s) => s.active).length;
  const isFading = isRunning && secondsLeft <= FADE_SECONDS && secondsLeft > 0;
  const fadeProgress = isFading ? 1 - secondsLeft / FADE_SECONDS : 0;
  const totalProgress = duration > 0 && isRunning ? 1 - secondsLeft / duration : 0;

  useEffect(() => {
    if (sleepTimerMinutes) setDuration(sleepTimerMinutes * 60);
  }, [sleepTimerMinutes, setDuration]);

  useEffect(() => {
    if (isRunning) {
      audioEngine.setAllowBackground(true);
      requestKeepAwake();
    } else {
      audioEngine.setAllowBackground(false);
      releaseKeepAwake();
    }
    return () => {
      audioEngine.setAllowBackground(false);
      releaseKeepAwake();
    };
  }, [isRunning]);

  useEffect(() => {
    if (
      isRunning &&
      secondsLeft <= WARN_SECONDS &&
      secondsLeft > WARN_SECONDS - 2 &&
      !warnTriggered.current &&
      duration > WARN_SECONDS
    ) {
      warnTriggered.current = true;
      if (hapticsEnabled) hapticLight();
    }
  }, [isRunning, secondsLeft, duration, hapticsEnabled]);

  useEffect(() => {
    if (isRunning && secondsLeft <= FADE_SECONDS && secondsLeft > 0 && !fadeTriggered.current) {
      fadeTriggered.current = true;
      audioEngine.fadeOut(FADE_SECONDS - 2);
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
      setSleepTimer(sleepTimerMinutes);
      fadeTriggered.current = false;
      warnTriggered.current = false;
      audioEngine.stopAll();
      releaseKeepAwake();
    }
  }, [isFinished, startedAt, addSession, setSleepTimer, sleepTimerMinutes]);

  const handleStart = () => {
    if (!sleepTimerMinutes) setSleepTimer(30);
    setStartedAt(new Date());
    fadeTriggered.current = false;
    warnTriggered.current = false;
    sounds.forEach((s) => {
      if (s.active) {
        audioEngine.setLayer(
          s.id as "brown" | "rain" | "ocean" | "forest" | "wind",
          true,
          s.volume
        );
      }
    });
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
        completed: elapsed >= 60,
      });
    }
    setStartedAt(null);
    fadeTriggered.current = false;
    warnTriggered.current = false;
    releaseKeepAwake();
  };

  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-quietide-soft">Sleep</h1>
          <p className="text-sm text-quietide-muted">Sounds · timer · gentle fade</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
          <Moon className="h-7 w-7" />
        </div>

        <div className="relative flex h-40 w-40 items-center justify-center">
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
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - totalProgress)}`}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="text-4xl font-light tabular-nums text-quietide-soft">
            {sleepTimerMinutes ? formatTime(secondsLeft) : "--:--"}
          </div>
        </div>

        {isFading ? (
          <div className="w-full max-w-xs space-y-2">
            <p className="text-center text-sm text-quietide-primary">Gently fading out… {secondsLeft}s</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-quietide-border/10">
              <div
                className="h-full rounded-full bg-quietide-primary transition-all duration-300 ease-linear"
                style={{ width: `${fadeProgress * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-quietide-muted">
            {isRunning
              ? secondsLeft <= WARN_SECONDS && duration > WARN_SECONDS
                ? "Almost there — rest well"
                : "Rest well · screen can sleep"
              : activeCount > 0
              ? `${activeCount} sound layer${activeCount > 1 ? "s" : ""} ready`
              : "Choose sounds & a timer"}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {TIMER_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSleepTimer(m);
                reset(m * 60);
                fadeTriggered.current = false;
                warnTriggered.current = false;
              }}
              disabled={isRunning}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                sleepTimerMinutes === m
                  ? "bg-quietide-primary text-white"
                  : "bg-quietide-border/5 text-quietide-muted hover:text-quietide-soft"
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
              warnTriggered.current = false;
              audioEngine.stopAll();
              releaseKeepAwake();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <SoundMixer live={isRunning} />
    </main>
  );
}
