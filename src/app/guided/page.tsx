"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GUIDED_SESSIONS, type GuidedSession } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function GuidedPage() {
  const [active, setActive] = useState<GuidedSession | null>(null);
  if (active) return <GuidedPlayer session={active} onExit={() => setActive(null)} />;

  const byCat = {
    sleep: GUIDED_SESSIONS.filter((s) => s.category === "sleep"),
    stress: GUIDED_SESSIONS.filter((s) => s.category === "stress"),
    focus: GUIDED_SESSIONS.filter((s) => s.category === "focus"),
  };

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-quietide-soft">Guided</h1>
          <p className="text-sm text-quietide-muted">Short sessions · on-device cues</p>
        </div>
      </div>
      {(["sleep", "stress", "focus"] as const).map((cat) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-quietide-muted">{cat}</h2>
          <ul className="space-y-2">
            {byCat[cat].map((s) => (
              <li key={s.id}>
                <button onClick={() => setActive(s)} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-quietide-card p-4 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-quietide-primary/10 text-2xl">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-quietide-soft">{s.title}</p>
                    <p className="text-sm text-quietide-muted">{s.description}</p>
                  </div>
                  <span className="text-xs text-quietide-muted">{s.durationMin} min</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function GuidedPlayer({ session, onExit }: { session: GuidedSession; onExit: () => void }) {
  const addSession = useAppStore((s) => s.addSession);
  const totalSec = session.durationMin * 60;
  const { secondsLeft, isRunning, isFinished, start, pause, reset } = useTimer(totalSec);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const elapsed = totalSec - secondsLeft;
  const cue = useMemo(() => {
    let current = session.cues[0]?.text ?? "";
    for (const c of session.cues) if (elapsed >= c.atSec) current = c.text;
    return current;
  }, [elapsed, session.cues]);

  useEffect(() => {
    if (isFinished && startedAt) {
      addSession({ mode: "guided", durationSeconds: totalSec, startedAt: startedAt.toISOString(), completed: true, guidedId: session.id });
    }
  }, [isFinished, startedAt, addSession, totalSec, session.id]);

  const handleEnd = () => {
    pause();
    if (startedAt) {
      const dur = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      addSession({ mode: "guided", durationSeconds: dur, startedAt: startedAt.toISOString(), completed: isFinished, guidedId: session.id });
    }
    reset(totalSec);
    setStartedAt(null);
    onExit();
  };

  return (
    <main className="flex min-h-[70vh] flex-col gap-8">
      <div className="flex items-center gap-3">
        <button onClick={handleEnd} className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-quietide-soft">{session.title}</h1>
          <p className="text-sm text-quietide-muted">{session.durationMin} minutes</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <span className="text-5xl">{session.emoji}</span>
        <p className="max-w-xs text-xl leading-relaxed text-quietide-soft">{isFinished ? "Session complete. Well done." : cue}</p>
        <p className="text-4xl font-light tabular-nums text-quietide-muted">{formatTime(secondsLeft)}</p>
      </div>
      <div className="flex justify-center gap-3 pb-4">
        {!isRunning && !isFinished ? (
          <Button size="lg" onClick={() => { setStartedAt(new Date()); start(); }}>Begin</Button>
        ) : isFinished ? (
          <Button size="lg" onClick={handleEnd}>Done</Button>
        ) : (
          <><Button size="lg" variant="secondary" onClick={pause}>Pause</Button><Button size="lg" variant="ghost" onClick={handleEnd}>End</Button></>
        )}
      </div>
    </main>
  );
}
