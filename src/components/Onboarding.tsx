"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Moon, Wind, Target, AlertCircle } from "lucide-react";

const STEPS = [
  {
    icon: Moon,
    title: "Sleep deeper",
    body: "Layer ambient sounds and set a gentle timer that fades out as you drift off.",
  },
  {
    icon: Wind,
    title: "Breathe & reset",
    body: "Box, 4-7-8 or coherent breathing with a calm visual pacer. Stress SOS is only 90 seconds.",
  },
  {
    icon: Target,
    title: "Focus longer",
    body: "A simple work / break timer. No noise, no guilt, just steady presence.",
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [showSosOffer, setShowSosOffer] = useState(false);
  const current = STEPS[step];
  const Icon = current.icon;

  if (showSosOffer) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quietide-bg px-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-quietide-soft">
              Try a 90-second reset?
            </h2>
            <p className="text-quietide-muted">
              Stress SOS is a short box-breathing session. No sound unless you want it.
              You can always find it on the home screen.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/breathe?sos=1"
              onClick={onDone}
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-quietide-primary px-8 text-lg font-medium text-white shadow-lg shadow-quietide-primary/20"
            >
              Try Stress SOS
            </Link>
            <Button size="lg" variant="ghost" onClick={onDone}>
              Maybe later
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
          <Icon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-quietide-soft">{current.title}</h2>
          <p className="text-quietide-muted">{current.body}</p>
        </div>
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i === step ? "bg-quietide-primary" : "bg-quietide-border/10"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          {step < STEPS.length - 1 ? (
            <Button size="lg" onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={() => setShowSosOffer(true)}>
              Get started
            </Button>
          )}
        </div>
        <button
          onClick={onDone}
          className="text-sm text-quietide-muted hover:text-quietide-soft"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
