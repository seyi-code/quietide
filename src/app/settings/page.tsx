"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Download } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const sessions = useAppStore((s) => s.sessions);
  const clear = () => useAppStore.setState({ sessions: [] });

  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-quietide-soft">Settings</h1>
      </div>

      <section className="rounded-2xl border border-white/5 bg-quietide-card p-5 space-y-1">
        <p className="text-3xl font-light text-quietide-soft">{totalMinutes}</p>
        <p className="text-sm text-quietide-muted">total minutes of calm so far</p>
      </section>

      <div className="flex gap-3">
        <Button variant="secondary" size="sm" onClick={exportJson} disabled={sessions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
            Recent Sessions
          </h2>
          {sessions.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs text-quietide-muted hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-quietide-muted">
            No sessions yet. Start breathing, focusing or sleeping.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 12).map((s) => (
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
        Quietide stores everything locally on your device. No accounts, no tracking,
        no cloud. Audio is generated on-device. You can also drop real looping mp3
        files into /public/sounds/ later for higher-fidelity layers.
      </p>
    </main>
  );
}
