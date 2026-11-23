"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ModeCard } from "@/components/ModeCard";
import { Onboarding } from "@/components/Onboarding";
import { useAppStore, computeGentleStreak } from "@/store/useAppStore";
import { GUIDED_SESSIONS, type Mood } from "@/lib/types";
import { weeklyGlance, moodHint } from "@/lib/insights";
import { Settings, Download } from "lucide-react";

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
    return { title: "Try a 5‑min stress reset", href: "/guided/" };
  if (mood === "tired") return { title: "Wind down with sleep sounds", href: "/sleep/" };
  if (mood === "focused") return { title: "Prime focus, then work", href: "/guided/" };
  return { title: "A quiet breath is always available", href: "/breathe/" };
}

export default function HomePage() {
  const sessions = useAppStore((s) => s.sessions);
  const todayMood = useAppStore((s) => s.todayMood);
  const moodDate = useAppStore((s) => s.moodDate);
  const setTodayMood = useAppStore((s) => s.setTodayMood);
  const favoriteGuidedId = useAppStore((s) => s.favoriteGuidedId);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const moodIsToday = moodDate === today;
  const activeMood = moodIsToday ? todayMood : null;

  const completed = useMemo(() => sessions.filter((s) => s.completed), [sessions]);
  const recentCount = completed.length;
  const streak = useMemo(() => computeGentleStreak(sessions), [sessions]);
  const suggestion = suggestionForMood(activeMood);
  const glance = useMemo(() => weeklyGlance(sessions), [sessions]);
  const hint = useMemo(() => moodHint(sessions, activeMood), [sessions, activeMood]);
  const favorite = favoriteGuidedId
    ? GUIDED_SESSIONS.find((g) => g.id === favoriteGuidedId)
    : null;

  useEffect(() => {
    const seen = localStorage.getItem("quietide-onboarded");
    if (!seen) setShowOnboarding(true);
    const tipDismissed = localStorage.getItem("quietide-install-tip");
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    if (!tipDismissed && !isStandalone && seen) setShowInstallTip(true);
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("quietide-onboarded", "1");
    setShowOnboarding(false);
  };

  const dismissInstall = () => {
    localStorage.setItem("quietide-install-tip", "1");
    setShowInstallTip(false);
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
              href="/settings/"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted transition-colors hover:text-quietide-soft active:scale-95"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-quietide-soft">
            Find your still point
          </h1>
          <p className="text-quietide-muted">Sleep deeper. Focus longer. Let stress leave.</p>
          {streak > 0 && (
            <p className="text-sm text-quietide-primary">
              {streak} day{streak === 1 ? "" : "s"} of showing up
              {recentCount > 0 ? ` · ${recentCount} sessions` : ""}
            </p>
          )}
          {glance && <p className="text-sm text-quietide-muted">{glance}</p>}
        </header>

        {showInstallTip && (
          <div className="card-elevated flex items-start gap-3 rounded-2xl border border-quietide bg-quietide-card p-4">
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-quietide-primary" />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-quietide-soft">Add to Home Screen</p>
              <p className="text-xs text-quietide-muted">
                Works offline. Nothing leaves this device. In Chrome: menu → Install app / Add to Home screen.
              </p>
            </div>
            <button type="button" onClick={dismissInstall} className="text-xs text-quietide-muted hover:text-quietide-soft">
              Got it
            </button>
          </div>
        )}

        <section className="space-y-3">
          <p className="text-sm text-quietide-muted">How are you landing right now?</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setTodayMood(activeMood === m.id ? null : m.id)}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm transition-all active:scale-95 ${
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
          {hint && <p className="text-xs text-quietide-muted">{hint}</p>}
        </section>

        {favorite && (
          <Link
            href="/guided/"
            className="card-elevated flex items-center gap-3 rounded-2xl border border-quietide-primary/25 bg-quietide-primary/5 p-4"
          >
            <span className="text-2xl">{favorite.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-quietide-muted">Favorite guided</p>
              <p className="text-sm font-medium text-quietide-soft">{favorite.title}</p>
            </div>
            <span className="text-quietide-primary">→</span>
          </Link>
        )}

        <section className="grid gap-3">
          <ModeCard title="Sleep" description="Sounds, timer & gentle fade into rest" href="/sleep/" icon="sleep" />
          <ModeCard title="Guided" description="Short sessions with on-device cues" href="/guided/" icon="guided" />
          <ModeCard title="Breathe & Relax" description="Box, 4-7-8, coherent · Stress SOS" href="/breathe/" icon="breathe" />
          <ModeCard title="Focus" description="Work / break timer with optional ambient" href="/focus/" icon="focus" />
        </section>

        <p className="text-center text-xs text-quietide-muted">Private · offline-first · no accounts</p>
      </main>
    </>
  );
}
