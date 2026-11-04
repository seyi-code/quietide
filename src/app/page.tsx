"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ModeCard } from "@/components/ModeCard";
import { Onboarding } from "@/components/Onboarding";
import { useAppStore, computeGentleStreak } from "@/store/useAppStore";
import type { Mood } from "@/lib/types";
import { Settings } from "lucide-react";

const MOODS: { id: NonNullable<Mood>; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "stressed", label: "Stressed", emoji: "🌊" },
  { id: "anxious", label: "Anxious", emoji: "💭" },
  { id: "focused", label: "Focused", emoji: "🎯" },
];

function suggestionForMood(mood: Mood): { title: string; href: string } | null {
  if (!mood) return null;
  if (mood === "stressed" || mood === "anxious")
    return { title: "Try a 5-min stress reset", href: "/guided" };
  if (mood === "tired") return { title: "Wind down with sleep sounds", href: "/sleep" };
  if (mood === "focused") return { title: "Prime focus, then work", href: "/guided" };
  return { title: "A quiet breath is always available", href: "/breathe" };
}

export default function HomePage() {
  const sessions = useAppStore((s) => s.sessions);
  const todayMood = useAppStore((s) => s.todayMood);
  const moodDate = useAppStore((s) => s.moodDate);
  const setTodayMood = useAppStore((s) => s.setTodayMood);

  const [showOnboarding, setShowOnboarding] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const moodIsToday = moodDate === today;
  const activeMood = moodIsToday ? todayMood : null;

  const completed = useMemo(
    () => sessions.filter((s) => s.completed),
    [sessions]
  );
  const recentCount = completed.length;
  const streak = useMemo(() => computeGentleStreak(sessions), [sessions]);
  const suggestion = suggestionForMood(activeMood);

  useEffect(() => {
    const seen = localStorage.getItem("quietide-onboarded");
    if (!seen) setShowOnboarding(true);
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("quietide-onboarded", "1");
    setShowOnboarding(false);
  };

  return (
    <>
      {showOnboarding && <Onboarding onDone={finishOnboarding} />}
      <main className="flex flex-col gap-7">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-widest text-quietide-primary">
              Quietide
            </p>
            <Link
              href="/settings"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted transition-colors hover:text-quietide-soft active:scale-95"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-quietide-soft">
            Find your still point
          </h1>
          <p className="text-quietide-muted">
            Sleep deeper. Focus longer. Let stress leave.
          </p>
        </header>

        <section className="space-y-3">
          <p className="text-sm text-quietide-muted">How are you landing right now?</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setTodayMood(activeMood === m.id ? null : m.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm transition-all active:scale-95 ${
                  activeMood === m.id
                    ? "bg-quietide-primary text-white shadow-lg shadow-quietide-primary/20"
                    : "bg-quietide-card text-quietide-muted hover:text-quietide-soft"
                }`}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
          {suggestion && (
            <Link
              href={suggestion.href}
              className="block rounded-2xl border border-quietide-primary/20 bg-quietide-primary/5 px-4 py-3 text-sm text-quietide-soft"
            >
              {suggestion.title} →
            </Link>
          )}
        </section>

        <section className="grid gap-3">
          <ModeCard title="Sleep" description="Sounds, timer & gentle fade into rest" href="/sleep" icon="sleep" />
          <ModeCard title="Guided" description="Short wind-downs, resets & focus priming" href="/guided" icon="relax" />
          <ModeCard title="Breathe & Relax" description="Box, 4-7-8 and coherent breathing" href="/breathe" icon="relax" />
          <ModeCard title="Focus" description="Deep work timer with calm soundscapes" href="/focus" icon="focus" />
          <ModeCard title="Stress SOS" description="90-second reset when you need it most" href="/breathe?sos=1" icon="sos" />
        </section>

        {(streak > 0 || recentCount > 0) && (
          <section className="rounded-2xl border border-white/5 bg-quietide-card p-4 space-y-1">
            {streak > 0 && (
              <p className="text-sm text-quietide-soft">
                {streak} day{streak === 1 ? "" : "s"} of showing up
              </p>
            )}
            <p className="text-sm text-quietide-muted">
              {recentCount} session{recentCount === 1 ? "" : "s"} completed · no pressure, just presence
            </p>
          </section>
        )}
      </main>
    </>
  );
}
