"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { audioEngine } from "@/lib/audioEngine";
import { cn } from "@/lib/utils";
import type { SoundLayer } from "@/lib/types";

export function SoundMixer() {
  const sounds = useAppStore((s) => s.sounds);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const setSoundVolume = useAppStore((s) => s.setSoundVolume);

  useEffect(() => {
    sounds.forEach((s) => {
      audioEngine.setLayer(s.id as any, s.active, s.volume);
    });
  }, [sounds]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
          Soundscape
        </h3>
        <span className="text-xs text-quietide-muted">
          {sounds.filter((s) => s.active).length} active
        </span>
      </div>
      <ul className="space-y-2">
        {sounds.map((sound) => (
          <SoundRow
            key={sound.id}
            sound={sound}
            onToggle={() => toggleSound(sound.id)}
            onVolume={(v) => setSoundVolume(sound.id, v)}
          />
        ))}
      </ul>
    </div>
  );
}

function SoundRow({
  sound,
  onToggle,
  onVolume,
}: {
  sound: SoundLayer;
  onToggle: () => void;
  onVolume: (v: number) => void;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/5 bg-quietide-card px-4 py-3 transition-all",
        sound.active && "border-quietide-primary/30 bg-quietide-surface shadow-sm shadow-quietide-primary/10"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg transition-all active:scale-95",
          sound.active
            ? "bg-quietide-primary/20 text-quietide-primary"
            : "bg-white/5 text-quietide-muted hover:bg-white/10"
        )}
        aria-label={`Toggle ${sound.name}`}
        aria-pressed={sound.active}
      >
        {sound.emoji}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-quietide-soft">{sound.name}</span>
          <span className="text-xs tabular-nums text-quietide-muted">
            {Math.round(sound.volume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={sound.volume}
          onChange={(e) => onVolume(parseFloat(e.target.value))}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-quietide-primary disabled:opacity-40"
          disabled={!sound.active}
          aria-label={`${sound.name} volume`}
        />
      </div>
    </li>
  );
}
