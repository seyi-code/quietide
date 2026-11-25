"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SOUND_PRESETS, type SoundLayer } from "@/lib/types";
import { audioEngine } from "@/lib/audioEngine";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/Toast";

/**
 * @param live When false, only edits the mix in state — audio stays silent
 * until the parent starts a session (Sleep / Focus).
 */
export function SoundMixer({ live = false }: { live?: boolean }) {
  const sounds = useAppStore((s) => s.sounds);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const setSoundVolume = useAppStore((s) => s.setSoundVolume);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const lastPresetId = useAppStore((s) => s.lastPresetId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!live) return;
    try {
      sounds.forEach((s) => {
        audioEngine.setLayer(
          s.id as "rain" | "ocean" | "forest" | "brown" | "wind",
          s.active,
          s.volume
        );
      });
    } catch {
      setError("Sound could not start. Tap a layer after interacting with the page.");
    }
  }, [sounds, live]);

  useEffect(() => {
    if (!live) {
      audioEngine.stopAll();
    }
  }, [live]);

  const clearMix = () => {
    useAppStore.setState((state) => ({
      lastPresetId: null,
      sounds: state.sounds.map((s) => ({ ...s, active: false })),
    }));
    if (live) audioEngine.stopAll();
  };

  return (
    <div className="space-y-4">
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-wider text-quietide-muted">
            Presets
          </h3>
          {lastPresetId && (
            <button
              type="button"
              onClick={clearMix}
              className="text-xs text-quietide-muted hover:text-quietide-soft"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SOUND_PRESETS.map((p) => {
            const selected = lastPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  try {
                    if (selected) clearMix();
                    else applyPreset(p);
                  } catch {
                    setError("Could not apply preset. Try again.");
                  }
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors active:scale-95",
                  selected
                    ? "bg-quietide-primary text-white"
                    : "bg-quietide-card text-quietide-muted hover:text-quietide-soft border border-quietide"
                )}
                aria-pressed={selected}
              >
                <span className="mr-1">{p.emoji}</span>
                {p.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-quietide-muted">
          Tap a preset again to turn it off. Sounds start only when you press Start.
        </p>
      </div>

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
              onToggle={() => {
                try {
                  toggleSound(sound.id);
                  useAppStore.setState({ lastPresetId: null });
                } catch {
                  setError("Sound blocked until you tap once on the page.");
                }
              }}
              onVolume={(v) => setSoundVolume(sound.id, v)}
            />
          ))}
        </ul>
      </div>
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
        "rounded-2xl border border-quietide bg-quietide-card px-4 py-3 transition-colors",
        sound.active && "border-quietide-primary/30 bg-quietide-primary/5"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.99]"
        >
          <span className="text-xl">{sound.emoji}</span>
          <span className="text-sm font-medium text-quietide-soft">{sound.name}</span>
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-xs",
              sound.active
                ? "bg-quietide-primary/20 text-quietide-primary"
                : "text-quietide-muted"
            )}
          >
            {sound.active ? "On" : "Off"}
          </span>
        </button>
      </div>
      {sound.active && (
        <div className="mt-3 flex items-center gap-3 pl-9">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={sound.volume}
            onChange={(e) => onVolume(parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-quietide-border/15 accent-[rgb(var(--q-primary))]"
            aria-label={`${sound.name} volume`}
          />
          <span className="w-8 text-right text-xs text-quietide-muted">
            {Math.round(sound.volume * 100)}
          </span>
        </div>
      )}
    </li>
  );
}
