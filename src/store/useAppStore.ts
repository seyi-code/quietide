import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Mode,
  SessionRecord,
  BreathingPattern,
  SoundLayer,
  Mood,
  ThemePreference,
} from "@/lib/types";
import { DEFAULT_SOUNDS } from "@/lib/types";

interface AppState {
  currentMode: Mode | null;
  sessions: SessionRecord[];
  preferredBreathing: BreathingPattern;
  focusWorkMinutes: number;
  focusBreakMinutes: number;
  sounds: SoundLayer[];
  sleepTimerMinutes: number | null;
  theme: ThemePreference;
  todayMood: Mood;
  moodDate: string | null;

  setMode: (mode: Mode | null) => void;
  addSession: (session: Omit<SessionRecord, "id">) => void;
  setPreferredBreathing: (p: BreathingPattern) => void;
  setFocusTimes: (work: number, breakMin: number) => void;
  toggleSound: (id: string) => void;
  setSoundVolume: (id: string, volume: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  setTheme: (theme: ThemePreference) => void;
  setTodayMood: (mood: Mood) => void;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentMode: null,
      sessions: [],
      preferredBreathing: "box",
      focusWorkMinutes: 25,
      focusBreakMinutes: 5,
      sounds: DEFAULT_SOUNDS,
      sleepTimerMinutes: null,
      theme: "dark",
      todayMood: null,
      moodDate: null,

      setMode: (mode) => set({ currentMode: mode }),
      setTheme: (theme) => set({ theme }),
      setTodayMood: (mood) => set({ todayMood: mood, moodDate: todayKey() }),
      addSession: (session) =>
        set((state) => ({
          sessions: [
            { ...session, id: crypto.randomUUID() },
            ...state.sessions,
          ].slice(0, 100),
        })),
      setPreferredBreathing: (p) => set({ preferredBreathing: p }),
      setFocusTimes: (work, breakMin) =>
        set({ focusWorkMinutes: work, focusBreakMinutes: breakMin }),
      toggleSound: (id) =>
        set((state) => ({
          sounds: state.sounds.map((s) =>
            s.id === id ? { ...s, active: !s.active } : s
          ),
        })),
      setSoundVolume: (id, volume) =>
        set((state) => ({
          sounds: state.sounds.map((s) =>
            s.id === id ? { ...s, volume: Math.max(0, Math.min(1, volume)) } : s
          ),
        })),
      setSleepTimer: (minutes) => set({ sleepTimerMinutes: minutes }),
    }),
    { name: "quietide-storage" }
  )
);

export function computeGentleStreak(sessions: SessionRecord[]): number {
  const days = new Set(
    sessions.filter((s) => s.completed).map((s) => s.startedAt.slice(0, 10))
  );
  if (days.size === 0) return 0;
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
