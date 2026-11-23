import type { Mood, SessionRecord } from "@/lib/types";

/** Sessions completed in the last 7 calendar days (local) */
export function sessionsThisWeek(sessions: SessionRecord[]): SessionRecord[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return sessions.filter((s) => {
    if (!s.completed) return false;
    const d = new Date(s.startedAt);
    return d >= start && d <= now;
  });
}

export function weeklyGlance(sessions: SessionRecord[]): string | null {
  const week = sessionsThisWeek(sessions);
  if (week.length === 0) return null;

  const sleepNights = week.filter((s) => s.mode === "sleep").length;
  const sos = week.filter((s) => s.mode === "sos").length;
  const focus = week.filter((s) => s.mode === "focus").length;
  const guided = week.filter((s) => s.mode === "guided").length;
  const totalMin = Math.round(
    week.reduce((a, s) => a + s.durationSeconds, 0) / 60
  );

  if (sleepNights >= 3) {
    return `${sleepNights} calm nights this week · ${totalMin} min total`;
  }
  if (sos >= 2) {
    return `${sos} short resets this week · showing up counts`;
  }
  if (focus >= 2) {
    return `${focus} focus blocks this week · ${totalMin} min of presence`;
  }
  if (guided >= 2) {
    return `${guided} guided sessions this week`;
  }
  if (week.length === 1) {
    return `1 session this week · a quiet start`;
  }
  return `${week.length} sessions this week · ${totalMin} min of calm`;
}

/** Soft one-line mood → mode correlation (never judgmental) */
export function moodHint(
  sessions: SessionRecord[],
  recentMood: Mood
): string | null {
  if (!recentMood) return null;
  const relevant = sessions.filter((s) => s.completed && s.mood === recentMood);
  if (relevant.length < 2) return null;

  const counts: Record<string, number> = {};
  for (const s of relevant) {
    counts[s.mode] = (counts[s.mode] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] < 2) return null;

  const label: Record<string, string> = {
    sleep: "Sleep",
    sos: "Stress SOS",
    guided: "Guided",
    focus: "Focus",
    relax: "Breathe",
  };
  const moodLabel =
    recentMood === "tired"
      ? "Tired"
      : recentMood === "stressed"
      ? "Stressed"
      : recentMood === "anxious"
      ? "Anxious"
      : recentMood === "focused"
      ? "Focused"
      : "Calm";

  return `You often choose ${label[top[0]] || top[0]} when ${moodLabel}`;
}
