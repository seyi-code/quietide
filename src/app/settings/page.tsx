"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Download,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Vibrate,
} from "lucide-react";
import { useAppStore, computeGentleStreak } from "@/store/useAppStore";
import type { ThemePreference } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const THEME_OPTIONS: { id: ThemePreference; label: string; icon: typeof Moon }[] = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const sessions = useAppStore((s) => s.sessions);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const focusWorkMinutes = useAppStore((s) => s.focusWorkMinutes);
  const focusBreakMinutes = useAppStore((s) => s.focusBreakMinutes);
  const setFocusTimes = useAppStore((s) => s.setFocusTimes);
  const preferredBreathing = useAppStore((s) => s.preferredBreathing);
  const setPreferredBreathing = useAppStore((s) => s.setPreferredBreathing);
  const sosSoundEnabled = useAppStore((s) => s.sosSoundEnabled);
  const setSosSoundEnabled = useAppStore((s) => s.setSosSoundEnabled);
  const guidedVoiceEnabled = useAppStore((s) => s.guidedVoiceEnabled);
  const setGuidedVoiceEnabled = useAppStore((s) => s.setGuidedVoiceEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const setHapticsEnabled = useAppStore((s) => s.setHapticsEnabled);

  const [confirmClear, setConfirmClear] = useState(false);

  const clear = () => {
    useAppStore.setState({ sessions: [] });
    setConfirmClear(false);
  };

  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );
  const streak = computeGentleStreak(sessions);

  const exportJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      app: "Quietide",
      sessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quietide-sessions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-2xl font-semibold text-quietide-soft">Settings</h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm transition-all active:scale-95 ${
                theme === id
                  ? "border-quietide-primary/40 bg-quietide-primary/10 text-quietide-primary"
                  : "border-quietide bg-quietide-card text-quietide-muted hover:text-quietide-soft"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-quietide-muted">
          Dark is the default calm mode. Theme is saved on this device.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
          Comfort
        </h2>
        <div className="space-y-2">
          <ToggleRow
            icon={<Volume2 className="h-4 w-4" />}
            label="Guided voice cues"
            description="Soft spoken prompts during guided sessions"
            checked={guidedVoiceEnabled}
            onChange={setGuidedVoiceEnabled}
          />
          <ToggleRow
            icon={<Volume2 className="h-4 w-4" />}
            label="SOS soft sound"
            description="Optional brown noise under Stress SOS (off by default)"
            checked={sosSoundEnabled}
            onChange={setSosSoundEnabled}
          />
          <ToggleRow
            icon={<Vibrate className="h-4 w-4" />}
            label="Breathing haptics"
            description="Light pulse on inhale and exhale (native only)"
            checked={hapticsEnabled}
            onChange={setHapticsEnabled}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
          Focus defaults
        </h2>
        <div className="flex flex-wrap gap-2">
          {[15, 25, 45, 50].map((m) => (
            <button
              key={m}
              onClick={() => setFocusTimes(m, focusBreakMinutes)}
              className={`rounded-full px-4 py-2.5 text-sm ${
                focusWorkMinutes === m
                  ? "bg-quietide-primary text-white"
                  : "bg-quietide-card text-quietide-muted"
              }`}
            >
              {m}m work
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[3, 5, 10].map((m) => (
            <button
              key={m}
              onClick={() => setFocusTimes(focusWorkMinutes, m)}
              className={`rounded-full px-4 py-2.5 text-sm ${
                focusBreakMinutes === m
                  ? "bg-quietide-primary text-white"
                  : "bg-quietide-card text-quietide-muted"
              }`}
            >
              {m}m break
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
          Preferred breathing
        </h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["box", "Box"],
              ["478", "4-7-8"],
              ["coherent", "Coherent"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPreferredBreathing(id)}
              className={`rounded-full px-4 py-2.5 text-sm ${
                preferredBreathing === id
                  ? "bg-quietide-primary text-white"
                  : "bg-quietide-card text-quietide-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card-elevated rounded-2xl border border-quietide bg-quietide-card p-5 space-y-1">
        <p className="text-3xl font-light text-quietide-soft">{totalMinutes}</p>
        <p className="text-sm text-quietide-muted">total minutes of calm</p>
        {streak > 0 && (
          <p className="pt-2 text-sm text-quietide-soft">
            {streak} day{streak === 1 ? "" : "s"} of showing up
          </p>
        )}
      </section>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={exportJson}
          disabled={sessions.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
            Recent sessions
          </h2>
          {sessions.length > 0 && !confirmClear && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1 text-xs text-quietide-muted hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {confirmClear && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
            <p className="text-sm text-quietide-soft">
              Clear all session history? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="danger" onClick={clear}>
                Yes, clear history
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {sessions.length === 0 ? (
          <p className="text-sm text-quietide-muted">
            No sessions yet. Start breathing, focusing, or sleeping.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 15).map((s) => (
              <li
                key={s.id}
                className="flex justify-between rounded-xl bg-quietide-card px-4 py-3 text-sm"
              >
                <span className="capitalize text-quietide-soft">{s.mode}</span>
                <span className="text-quietide-muted">
                  {Math.round(s.durationSeconds / 60)} min
                  {!s.completed && " · stopped"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs leading-relaxed text-quietide-muted">
        Everything stays on this device. No accounts, no analytics, no cloud.
        Notifications and Health integrations can come later — kept optional and quiet.
      </p>
    </main>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-2xl border border-quietide bg-quietide-card px-4 py-3 text-left transition-colors active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-quietide-primary/10 text-quietide-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-quietide-soft">{label}</p>
        <p className="text-xs text-quietide-muted">{description}</p>
      </div>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-quietide-primary" : "bg-quietide-border/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
