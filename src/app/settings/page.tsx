"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Download, Moon, Sun, Monitor } from "lucide-react";
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
  const clear = () => useAppStore.setState({ sessions: [] });
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);
  const streak = computeGentleStreak(sessions);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), app: "Quietide", sessions }, null, 2)], { type: "application/json" });
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
        <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-quietide-soft">Settings</h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTheme(id)} className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm ${
              theme === id ? "border-quietide-primary/40 bg-quietide-primary/10 text-quietide-primary" : "border-white/5 bg-quietide-card text-quietide-muted"
            }`}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">Focus defaults</h2>
        <div className="flex flex-wrap gap-2">
          {[15, 25, 45, 50].map((m) => (
            <button key={m} onClick={() => setFocusTimes(m, focusBreakMinutes)} className={`rounded-full px-4 py-2.5 text-sm ${focusWorkMinutes === m ? "bg-quietide-primary text-white" : "bg-quietide-card text-quietide-muted"}`}>{m}m work</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[3, 5, 10].map((m) => (
            <button key={m} onClick={() => setFocusTimes(focusWorkMinutes, m)} className={`rounded-full px-4 py-2.5 text-sm ${focusBreakMinutes === m ? "bg-quietide-primary text-white" : "bg-quietide-card text-quietide-muted"}`}>{m}m break</button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">Preferred breathing</h2>
        <div className="flex flex-wrap gap-2">
          {([["box", "Box"], ["478", "4-7-8"], ["coherent", "Coherent"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setPreferredBreathing(id)} className={`rounded-full px-4 py-2.5 text-sm ${preferredBreathing === id ? "bg-quietide-primary text-white" : "bg-quietide-card text-quietide-muted"}`}>{label}</button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-quietide-card p-5 space-y-1">
        <p className="text-3xl font-light text-quietide-soft">{totalMinutes}</p>
        <p className="text-sm text-quietide-muted">total minutes of calm</p>
        {streak > 0 && <p className="pt-2 text-sm text-quietide-soft">{streak} day{streak === 1 ? "" : "s"} of showing up</p>}
      </section>

      <Button variant="secondary" size="sm" onClick={exportJson} disabled={sessions.length === 0}>
        <Download className="mr-2 h-4 w-4" />Export JSON
      </Button>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">Recent sessions</h2>
          {sessions.length > 0 && (
            <button onClick={clear} className="flex items-center gap-1 text-xs text-quietide-muted"><Trash2 className="h-3.5 w-3.5" />Clear</button>
          )}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-quietide-muted">No sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 15).map((s) => (
              <li key={s.id} className="flex justify-between rounded-xl bg-quietide-card px-4 py-3 text-sm">
                <span className="capitalize text-quietide-soft">{s.mode}</span>
                <span className="text-quietide-muted">{Math.round(s.durationSeconds / 60)} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-quietide-muted">Everything stays on this device. No accounts, no analytics.</p>
    </main>
  );
}
