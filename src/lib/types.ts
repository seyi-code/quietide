export type Mode = "sleep" | "relax" | "focus" | "sos";

export type BreathingPattern = "box" | "478" | "coherent";

export interface SessionRecord {
  id: string;
  mode: Mode;
  durationSeconds: number;
  startedAt: string;
  completed: boolean;
}

export interface SoundLayer {
  id: string;
  name: string;
  emoji: string;
  volume: number;
  active: boolean;
  src: string;
}

export const DEFAULT_SOUNDS: SoundLayer[] = [
  { id: "rain", name: "Rain", emoji: "🌧️", volume: 0.5, active: false, src: "/sounds/rain.mp3" },
  { id: "ocean", name: "Ocean", emoji: "🌊", volume: 0.4, active: false, src: "/sounds/ocean.mp3" },
  { id: "forest", name: "Forest", emoji: "🌲", volume: 0.35, active: false, src: "/sounds/forest.mp3" },
  { id: "brown", name: "Brown Noise", emoji: "🟤", volume: 0.3, active: false, src: "/sounds/brown.mp3" },
  { id: "wind", name: "Soft Wind", emoji: "🍃", volume: 0.25, active: false, src: "/sounds/wind.mp3" },
];
