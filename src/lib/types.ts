export type Mode = "sleep" | "relax" | "focus" | "sos" | "guided";

export type BreathingPattern = "box" | "478" | "coherent";

export type Mood = "calm" | "stressed" | "tired" | "focused" | "anxious" | null;

export type ThemePreference = "dark" | "light" | "system";

export const APP_VERSION = "0.7.0";

export interface SessionRecord {
  id: string;
  mode: Mode;
  durationSeconds: number;
  startedAt: string;
  completed: boolean;
  mood?: Mood;
  guidedId?: string;
}

export interface SoundLayer {
  id: string;
  name: string;
  emoji: string;
  volume: number;
  active: boolean;
  src: string;
}

export interface SoundPreset {
  id: string;
  name: string;
  emoji: string;
  layers: Record<string, number>;
}

export interface GuidedSession {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  category: "sleep" | "stress" | "focus";
  emoji: string;
  cues: { atSec: number; text: string }[];
}

export const DEFAULT_SOUNDS: SoundLayer[] = [
  { id: "rain", name: "Rain", emoji: "🌧️", volume: 0.5, active: false, src: "/sounds/rain.mp3" },
  { id: "ocean", name: "Ocean", emoji: "🌊", volume: 0.4, active: false, src: "/sounds/ocean.mp3" },
  { id: "forest", name: "Forest", emoji: "🌲", volume: 0.35, active: false, src: "/sounds/forest.mp3" },
  { id: "brown", name: "Brown Noise", emoji: "🟤", volume: 0.3, active: false, src: "/sounds/brown.mp3" },
  { id: "wind", name: "Soft Wind", emoji: "🍃", volume: 0.25, active: false, src: "/sounds/wind.mp3" },
];

export const SOUND_PRESETS: SoundPreset[] = [
  { id: "deep-sleep", name: "Deep sleep", emoji: "🌙", layers: { brown: 0.35, rain: 0.25, wind: 0.15 } },
  { id: "soft-focus", name: "Soft focus", emoji: "🎯", layers: { brown: 0.28, forest: 0.18 } },
  { id: "rain-only", name: "Rain only", emoji: "🌧️", layers: { rain: 0.45 } },
  { id: "ocean-night", name: "Ocean night", emoji: "🌊", layers: { ocean: 0.4, wind: 0.12 } },
];

export const GUIDED_SESSIONS: GuidedSession[] = [
  {
    id: "wind-down",
    title: "Sleep wind-down",
    description: "Gentle body release before bed",
    durationMin: 8,
    category: "sleep",
    emoji: "🌙",
    cues: [
      { atSec: 0, text: "Settle in. Let your eyes rest." },
      { atSec: 30, text: "Breathe in slowly… and out a little longer." },
      { atSec: 90, text: "Soften your jaw and shoulders." },
      { atSec: 180, text: "Feel the weight of your body on the surface beneath you." },
      { atSec: 300, text: "If thoughts arise, notice them and return to the breath." },
      { atSec: 420, text: "You’re safe to drift. Nothing else is needed." },
    ],
  },
  {
    id: "evening-calm",
    title: "Evening calm",
    description: "Soft landing after a long day",
    durationMin: 10,
    category: "sleep",
    emoji: "✨",
    cues: [
      { atSec: 0, text: "The day is complete. Nothing more is required." },
      { atSec: 40, text: "Breathe into the belly. Soften on the exhale." },
      { atSec: 120, text: "Release the forehead, the eyes, the tongue." },
      { atSec: 240, text: "Let the mind wander without following it." },
      { atSec: 400, text: "Rest is productive. Allow it." },
      { atSec: 540, text: "Drift when you’re ready." },
    ],
  },
  {
    id: "stress-reset",
    title: "Stress reset",
    description: "Quick nervous-system downshift",
    durationMin: 5,
    category: "stress",
    emoji: "💨",
    cues: [
      { atSec: 0, text: "Pause. You only need these few minutes." },
      { atSec: 20, text: "Inhale for 4… hold… exhale for 6." },
      { atSec: 60, text: "Unclench your hands. Drop your shoulders." },
      { atSec: 120, text: "Name one thing that feels okay right now." },
      { atSec: 200, text: "Slow the breath again. In… and out." },
      { atSec: 270, text: "Carry this steadiness with you." },
    ],
  },
  {
    id: "anxiety-soften",
    title: "Anxiety soften",
    description: "Ground the body, quiet the spiral",
    durationMin: 6,
    category: "stress",
    emoji: "🌊",
    cues: [
      { atSec: 0, text: "Feel your feet on the floor. You are here." },
      { atSec: 25, text: "Inhale through the nose. Exhale longer than the inhale." },
      { atSec: 70, text: "Name five things you can see. Softly." },
      { atSec: 150, text: "Let the next breath be a little slower." },
      { atSec: 240, text: "Anxiety may visit. You do not have to follow it." },
      { atSec: 330, text: "Return when you need to. This calm is yours." },
    ],
  },
  {
    id: "sos-90",
    title: "90-second ground",
    description: "Ultra-short body anchor when spiraling",
    durationMin: 2,
    category: "stress",
    emoji: "⚓",
    cues: [
      { atSec: 0, text: "Feet on the floor. Name one color you see." },
      { atSec: 20, text: "Inhale 4… hold… exhale 6." },
      { atSec: 50, text: "Unclench the jaw. Drop the shoulders." },
      { atSec: 80, text: "You are here. One more slow breath." },
      { atSec: 110, text: "Carry this steadiness with you." },
    ],
  },
  {
    id: "focus-prime",
    title: "Focus priming",
    description: "Clear the noise before deep work",
    durationMin: 4,
    category: "focus",
    emoji: "🎯",
    cues: [
      { atSec: 0, text: "Sit upright. Soften the gaze." },
      { atSec: 20, text: "Three slow breaths. Clear the slate." },
      { atSec: 60, text: "What is the one task that matters most?" },
      { atSec: 120, text: "Let everything else wait. Just this." },
      { atSec: 180, text: "When you’re ready, begin with calm attention." },
    ],
  },
  {
    id: "deep-work-open",
    title: "Deep work open",
    description: "Settle attention for a longer block",
    durationMin: 3,
    category: "focus",
    emoji: "🧠",
    cues: [
      { atSec: 0, text: "Close open loops. Just for now." },
      { atSec: 30, text: "One breath in. One breath out." },
      { atSec: 75, text: "Choose the single next action." },
      { atSec: 140, text: "Begin. Stay with it gently." },
    ],
  },
];
