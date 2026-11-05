"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { GUIDED_SESSIONS, type GuidedSession } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";
import { speakCue, stopSpeaking, warmVoices } from "@/lib/voice";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function GuidedPage() {
  const [active, setActive] = useState<GuidedSession | null>(null);

  useEffect(() => {
    warmVoices();
  }, []);

  if (active) {
    return <GuidedPlayer session={active} onExit={() => setActive(null)} />;
  }

  const byCat = {
    sleep: GUIDED_SESSIONS.filter((s) => s.category === "sleep"),
    stress: GUIDED_SESSIONS.filter((s) => s.category === "stress"),
    focus: GUIDED_SESSIONS.filter((s) => s.category === "focus"),
  };

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-quietide-soft">Guided</h1>
          <p className="text-sm text-quietide-muted">Short sessions · spoken cues on-device</p>
        </div>
      </div>

      {(["sleep", "stress", "focus"] as const).map((cat) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-quietide-muted">
            {cat === "sleep" ? "Sleep" : cat === "stress" ? "Stress" : "Focus"}
          </h2>
          <ul className="space-y-2">
            {byCat[cat].map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s)}
                  className="card-elevated flex w-full items-center gap-4 rounded-2xl border border-quietide bg-quietide-card p-4 text-left transition-all hover:border-quietide-primary/30 active:scale-[0.99]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-quietide-primary/10 text-2xl">
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-quietide-soft">{s.title}</p>
                    <p className="text-sm text-quietide-muted">{s.description}</p>
                  </div>
                  <span className="text-xs tabular-nums text-quietide-muted">
                    {s.durationMin} min
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function GuidedPlayer({
  session,
  onExit,
}: {
  session: GuidedSession;
  onExit: () => void;
}) {
  const addSession = useAppStore((s) => s.addSession);
  const guidedVoiceEnabled = useAppStore((s) => s.guidedVoiceEnabled);
  const setGuidedVoiceEnabled = useAppStore((s) => s.setGuidedVoiceEnabled);

  const totalSec = session.durationMin * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset } = useTimer(totalSec);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const elapsed = totalSec - secondsLeft;
  const lastSpokenAt = useRef<number>(-1);
  const loggedRef = useRef(false);

  const cue = useMemo(() => {
    let current = session.cues[0]?.text ?? "";
    for (const c of session.cues) {
      if (elapsed >= c.atSec) current = c.text;
    }
    return current;
  }, [elapsed, session.cues]);

  useEffect(() => {
    if (!isRunning || isFinished) return;
    const activeCue = session.cues.reduce(
      (acc, c) => (elapsed >= c.atSec ? c : acc),
      session.cues[0]
    );
    if (!activeCue) return;
    if (activeCue.atSec === lastSpokenAt.current) return;
    if (elapsed >= activeCue.atSec && elapsed < activeCue.atSec + 2) {
      lastSpokenAt.current = activeCue.atSec;
      speakCue(activeCue.text, guidedVoiceEnabled);
    }
  }, [elapsed, isRunning, isFinished, session.cues, guidedVoiceEnabled]);

  useEffect(() => {
    if (isFinished && startedAt && !loggedRef.current) {
      loggedRef.current = true;
      stopSpeaking();
      addSession({
        mode: "guided",
        durationSeconds: totalSec,
        startedAt: startedAt.toISOString(),
        completed: true,
        guidedId: session.id,
      });
      setStartedAt(null);
    }
  }, [isFinished, startedAt, addSession, totalSec, session.id]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleStart = () => {
    loggedRef.current = false;
    setStartedAt(new Date());
    lastSpokenAt.current = -1;
    start();
    const first = session.cues[0];
    if (first) {
      lastSpokenAt.current = first.atSec;
      speakCue(first.text, guidedVoiceEnabled);
    }
  };

  const handleEnd = () => {
    stopSpeaking();
    pause();
    if (startedAt && !loggedRef.current) {
      loggedRef.current = true;
      const dur = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      if (dur >= 5) {
        addSession({
          mode: "guided",
          durationSeconds: dur,
          startedAt: startedAt.toISOString(),
          completed: isFinished,
          guidedId: session.id,
        });
      }
    }
    reset(totalSec);
    setStartedAt(null);
    onExit();
  };

  return (
    <main className="flex min-h-[70vh] flex-col gap-8">
      <div className="flex items-center gap-3">
        <button
          onClick={handleEnd}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-quietide-soft">{session.title}</h1>
          <p className="text-sm text-quietide-muted">{session.durationMin} minutes</p>
        </div>
        <button
          onClick={() => {
            if (guidedVoiceEnabled) stopSpeaking();
            setGuidedVoiceEnabled(!guidedVoiceEnabled);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
          aria-label={guidedVoiceEnabled ? "Mute voice cues" : "Enable voice cues"}
        >
          {guidedVoiceEnabled ? (
            <Volume2 className="h-5 w-5 text-quietide-primary" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <span className="text-5xl">{session.emoji}</span>
        <p className="max-w-xs text-xl leading-relaxed text-quietide-soft transition-opacity duration-700">
          {isFinished ? "Session complete. Well done." : cue}
        </p>
        <p className="text-4xl font-light tabular-nums text-quietide-muted">
          {formatTime(secondsLeft)}
        </p>
        {guidedVoiceEnabled && isRunning && (
          <p className="text-xs text-quietide-muted">Voice cues on · stays on this device</p>
        )}
      </div>

      <div className="flex justify-center gap-3 pb-4">
        {!isRunning && !isFinished ? (
          <Button size="lg" onClick={handleStart}>
            Begin
          </Button>
        ) : isFinished ? (
          <Button size="lg" onClick={handleEnd}>
            Done
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                stopSpeaking();
                pause();
              }}
            >
              Pause
            </Button>
            <Button size="lg" variant="ghost" onClick={handleEnd}>
              End
            </Button>
          </>
        )}
        {!isRunning && !isFinished && startedAt && (
          <Button size="lg" onClick={start}>
            Resume
          </Button>
        )}
      </div>
    </main>
  );
}
