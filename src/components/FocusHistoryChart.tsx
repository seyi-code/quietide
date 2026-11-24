"use client";

import { useMemo } from "react";
import type { SessionRecord } from "@/lib/types";

/** Last 7 local calendar days of completed focus minutes (bar chart). */
export function FocusHistoryChart({ sessions }: { sessions: SessionRecord[] }) {
  const days = useMemo(() => buildLast7Days(sessions), [sessions]);
  const maxMin = Math.max(1, ...days.map((d) => d.minutes));
  const total = days.reduce((a, d) => a + d.minutes, 0);
  const blocks = days.filter((d) => d.count > 0).length;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-quietide bg-quietide-card/50 px-4 py-6 text-center space-y-1">
        <p className="text-sm text-quietide-soft">No focus blocks yet</p>
        <p className="text-xs text-quietide-muted">
          Complete a work session and your last 7 days will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="card-elevated space-y-4 rounded-2xl border border-quietide bg-quietide-card p-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-quietide-muted">
            Focus · last 7 days
          </p>
          <p className="text-sm font-medium text-quietide-soft">
            {total} min · {blocks} day{blocks === 1 ? "" : "s"} with work
          </p>
        </div>
      </div>

      <div
        className="flex h-28 items-end justify-between gap-1.5"
        role="img"
        aria-label={`Focus minutes over the last 7 days, total ${total}`}
      >
        {days.map((d) => {
          const h = Math.max(d.minutes > 0 ? 8 : 2, Math.round((d.minutes / maxMin) * 100));
          return (
            <div key={d.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] tabular-nums text-quietide-muted">
                {d.minutes > 0 ? d.minutes : ""}
              </span>
              <div
                className="w-full max-w-[28px] rounded-t-md bg-quietide-primary/80 transition-all"
                style={{ height: `${h}%`, minHeight: d.minutes > 0 ? 8 : 2 }}
                title={`${d.label}: ${d.minutes} min`}
              />
              <span className="text-[10px] text-quietide-muted">{d.short}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildLast7Days(sessions: SessionRecord[]) {
  const out: {
    key: string;
    label: string;
    short: string;
    minutes: number;
    count: number;
  }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter(
      (s) => s.completed && s.mode === "focus" && s.startedAt.slice(0, 10) === key
    );
    const minutes = Math.round(
      daySessions.reduce((a, s) => a + s.durationSeconds, 0) / 60
    );
    out.push({
      key,
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      short: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      minutes,
      count: daySessions.length,
    });
  }
  return out;
}
