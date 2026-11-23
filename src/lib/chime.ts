/**
 * Soft end-of-phase chime via Web Audio — no external files.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Gentle two-tone chime for focus phase ends */
export function playSoftChime() {
  try {
    const c = getCtx();
    const now = c.currentTime;
    const master = c.createGain();
    master.gain.value = 0.12;
    master.connect(c.destination);

    const tones = [523.25, 659.25]; // C5, E5
    tones.forEach((freq, i) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + i * 0.18);
      g.gain.linearRampToValueAtTime(0.9, now + i * 0.18 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.55);
      osc.connect(g);
      g.connect(master);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.6);
    });
  } catch {
    // ignore
  }
}
