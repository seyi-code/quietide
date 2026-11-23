import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Mode,
  SessionRecord,
  BreathingPattern,
  SoundLayer,
  Mood,
  ThemePreference,
  SoundPreset,
} from "@/lib/types";
import { DEFAULT_SOUNDS, SOUND_PRESETS } from "@/lib/types";

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
  sosSoundEnabled: boolean;
  guidedVoiceEnabled: boolean;
  hapticsEnabled: boolean;
  focusSoundEnabled: boolean;
  focusChimeEnabled: boolean;
  favoriteGuidedId: string | null;
  lastPresetId: string | null;

  setMode: (mode: Mode | null) => void;
  addSession: (session: Omit<SessionRecord, "id">) => void;
  removeSession: (id: string) => void;
  setPreferredBreathing: (p: BreathingPattern) => void;
  setFocusTimes: (work: number, breakMin: number) => void;
  toggleSound: (id: string) => void;
  setSoundVolume: (id: string, volume: number) => void;
  applyPreset: (preset: SoundPreset) => void;
  setSleepTimer: (minutes: number | null) => void;
  setTheme: (theme: ThemePreference) => void;
  setTodayMood: (mood: Mood) => void;
  setSosSoundEnabled: (v: boolean) => void;
  setGuidedVoiceEnabled: (v: boolean) => void;
  setHapticsEnabled: (v: boolean) => void;
  setFocusSoundEnabled: (v: boolean) => void;
  setFocusChimeEnabled: (v: boolean) => void;
  setFavoriteGuidedId: (id: string | null) => void;
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
      sosSoundEnabled: false,
      guidedVoiceEnabled: true,
      hapticsEnabled: true,
      focusSoundEnabled: true,
      focusChimeEnabled: true,
      favoriteGuidedId: null,
      lastPresetId: null,

      setMode: (mode) => set({ currentMode: mode }),
      setTheme: (theme) => set({ theme }),
      setTodayMood: (mood) => set({ todayMood: mood, moodDate: todayKey() }),
      setSosSoundEnabled: (v) => set({ sosSoundEnabled: v }),
      setGuidedVoiceEnabled: (v) => set({ guidedVoiceEnabled: v }),
      setHapticsEnabled: (v) => set({ hapticsEnabled: v }),
      setFocusSoundEnabled: (v) => set({ focusSoundEnabled: v }),
      setFocusChimeEnabled: (v) => set({ focusChimeEnabled: v }),
      setFavoriteGuidedId: (id) => set({ favoriteGuidedId: id }),
      addSession: (session) =>
        set((state) => ({
          sessions: [
            { ...session, id: crypto.randomUUID() },
            ...state.sessions,
          ].slice(0, 100),
        })),
      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
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
      applyPreset: (preset) =>
        set((state) => ({
          lastPresetId: preset.id,
          sounds: state.sounds.map((s) => {
            const vol = preset.layers[s.id];
            if (vol !== undefined) {
              return { ...s, active: true, volume: vol };
            }
            return { ...s, active: false };
          }),
        })),
      setSleepTimer: (minutes) => set({ sleepTimerMinutes: minutes }),
    }),
    { name: "quietide-storage" }
  )
);

export function computeGentleStreak(sessions: SessionRecord[]): number {
  const days = new Set(
    sessions
      .filter((s) => s.completed)
      .map((s) => s.startedAt.slice(0, 10))
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

export { SOUND_PRESETS };
