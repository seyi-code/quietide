import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Mode, SessionRecord, BreathingPattern, SoundLayer } from "@/lib/types";
import { DEFAULT_SOUNDS } from "@/lib/types";

interface AppState {
  currentMode: Mode | null;
  sessions: SessionRecord[];
  preferredBreathing: BreathingPattern;
  focusWorkMinutes: number;
  focusBreakMinutes: number;
  sounds: SoundLayer[];
  sleepTimerMinutes: number | null;

  setMode: (mode: Mode | null) => void;
  addSession: (session: Omit<SessionRecord, "id">) => void;
  setPreferredBreathing: (p: BreathingPattern) => void;
  setFocusTimes: (work: number, breakMin: number) => void;
  toggleSound: (id: string) => void;
  setSoundVolume: (id: string, volume: number) => void;
  setSleepTimer: (minutes: number | null) => void;
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

      setMode: (mode) => set({ currentMode: mode }),
      addSession: (session) =>
        set((state) => ({
          sessions: [
            { ...session, id: crypto.randomUUID() },
            ...state.sessions,
          ].slice(0, 50),
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
