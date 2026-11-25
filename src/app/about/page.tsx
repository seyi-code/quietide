"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Moon, Shield, WifiOff, Download } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col gap-10 pb-8">
      <header className="space-y-4 text-center pt-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
          <Moon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-quietide-primary">
            Quietide
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-quietide-soft">
            Sleep deeper. Focus longer. Let stress leave.
          </h1>
          <p className="text-quietide-muted max-w-sm mx-auto">
            A private, offline-first calm space. No accounts. No cloud. Nothing leaves this
            device.
          </p>
        </div>
      </header>

      <section className="grid gap-3">
        {[
          {
            icon: Moon,
            title: "Sleep",
            body: "Layer ambient sounds and a timer that fades out as you drift.",
          },
          {
            icon: WifiOff,
            title: "Works offline",
            body: "Open once online. Then sleep, breathe, and focus without a network.",
          },
          {
            icon: Shield,
            title: "Private by design",
            body: "Sessions stay on your phone. Export JSON anytime. No tracking.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="card-elevated flex gap-4 rounded-2xl border border-quietide bg-quietide-card p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-quietide-primary/10 text-quietide-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-quietide-soft">{title}</p>
              <p className="text-sm text-quietide-muted">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3 text-center">
        <Link href="/">
          <Button size="lg" className="w-full max-w-xs">
            Open Quietide
          </Button>
        </Link>
        <p className="text-xs text-quietide-muted flex items-center justify-center gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Install from Chrome: menu → Install app
        </p>
      </section>

      <p className="text-center text-xs text-quietide-muted">
        Built for real rest — not streaks that punish you.
      </p>
    </main>
  );
}
