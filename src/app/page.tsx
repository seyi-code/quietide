"use client";

import { useState, useEffect } from "react";
import { ModeCard } from "@/components/ModeCard";
import { Onboarding } from "@/components/Onboarding";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const sessions = useAppStore((s) => s.sessions);
  const recentCount = sessions.filter((s) => s.completed).length;
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      <main className="flex flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-quietide-primary">
            Quietide
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-quietide-soft">
            Find your still point
          </h1>
          <p className="text-quietide-muted">
            Sleep deeper. Focus longer. Let stress leave.
          </p>
        </header>

        <section className="grid gap-4">
          <ModeCard
            title="Sleep"
            description="Sounds, timer & gentle fade into rest"
            href="/sleep"
            icon="sleep"
          />
          <ModeCard
            title="Breathe & Relax"
            description="Box, 4-7-8 and coherent breathing"
            href="/breathe"
            icon="relax"
          />
          <ModeCard
            title="Focus"
            description="Deep work timer with calm soundscapes"
            href="/focus"
            icon="focus"
          />
          <ModeCard
            title="Stress SOS"
            description="60–90 second reset when you need it most"
            href="/breathe?sos=1"
            icon="sos"
          />
        </section>

        {recentCount > 0 && (
          <section className="rounded-2xl border border-white/5 bg-quietide-card p-4">
            <p className="text-sm text-quietide-muted">
              You have completed <span className="text-quietide-soft">{recentCount}</span>{" "}
              sessions recently. Keep the streak gentle.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
