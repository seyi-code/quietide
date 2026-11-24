"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import type { Mood } from "@/lib/types";
import { Moon, Wind, Target, Shield } from "lucide-react";

const MOODS: { id: NonNullable<Mood>; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "stressed", label: "Stressed", emoji: "🌊" },
  { id: "anxious", label: "Anxious", emoji: "💭" },
  { id: "focused", label: "Focused", emoji: "🎯" },
];

function pathForMood(mood: NonNullable<Mood>): {
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: typeof Moon;
} {
  if (mood === "stressed" || mood === "anxious") {
    return {
      title: "A short reset helps",
      body: "Stress SOS is 90 seconds of box breathing. No account. Optional sound stays off unless you turn it on.",
      href: "/breathe/?sos=1",
      cta: "Try Stress SOS",
      icon: Wind,
    };
  }
  if (mood === "tired") {
    return {
      title: "Ease toward rest",
      body: "Layer soft sounds and set a timer that fades out as you drift. Everything stays on this device.",
      href: "/sleep/",
      cta: "Open Sleep",
      icon: Moon,
    };
  }
  if (mood === "focused") {
    return {
      title: "Steady presence",
      body: "A simple work and break timer with optional ambient sound. No streaks that punish you.",
      href: "/focus/",
      cta: "Start Focus",
      icon: Target,
    };
  }
  return {
    title: "A quiet breath",
    body: "Box, 4-7-8, or coherent breathing with a calm visual pacer whenever you need it.",
    href: "/breathe/",
    cta: "Open Breathe",
    icon: Wind,
  };
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  const setTodayMood = useAppStore((s) => s.setTodayMood);
  const [step, setStep] = useState<"mood" | "path" | "privacy">("mood");
  const [picked, setPicked] = useState<NonNullable<Mood> | null>(null);

  const path = picked ? pathForMood(picked) : null;
  const PathIcon = path?.icon ?? Shield;

  if (step === "mood") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quietide-bg px-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-widest text-quietide-primary">
              Quietide
            </p>
            <h2 className="text-2xl font-semibold text-quietide-soft">
              How are you landing?
            </h2>
            <p className="text-quietide-muted">
              One tap. We will suggest a gentle next step — nothing is tracked off this device.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setPicked(m.id);
                  setTodayMood(m.id);
                  setStep("path");
                }}
                className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-quietide-card px-3.5 py-2.5 text-sm text-quietide-muted transition-all hover:text-quietide-soft active:scale-95"
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep("privacy")}
            className="text-sm text-quietide-muted hover:text-quietide-soft"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  if (step === "path" && path) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quietide-bg px-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
            <PathIcon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-quietide-soft">{path.title}</h2>
            <p className="text-quietide-muted">{path.body}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={path.href}
              onClick={onDone}
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-quietide-primary px-8 text-lg font-medium text-white shadow-lg shadow-quietide-primary/20"
            >
              {path.cta}
            </Link>
            <Button size="lg" variant="ghost" onClick={() => setStep("privacy")}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quietide-bg px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
          <Shield className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-quietide-soft">Private by design</h2>
          <p className="text-quietide-muted">
            No accounts. No cloud. Sessions stay on this phone. Add Quietide to your home
            screen for offline use anytime.
          </p>
          <p className="text-xs text-quietide-muted">
            Chrome: menu → Install app / Add to Home screen
          </p>
        </div>
        <Button size="lg" onClick={onDone}>
          Enter Quietide
        </Button>
      </div>
    </div>
  );
}
