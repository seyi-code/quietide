/**
 * Soft spoken cues via Web Speech API.
 * Fully offline, no audio files. Graceful no-op if unsupported.
 */

let preferredVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer calm, local, English voices
  const preferred =
    voices.find((v) => /samantha|karen|moira|serena|zira|female/i.test(v.name) && v.lang.startsWith("en")) ||
    voices.find((v) => v.lang.startsWith("en") && v.localService) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];

  return preferred ?? null;
}

function ensureVoice() {
  if (preferredVoice) return preferredVoice;
  preferredVoice = pickVoice();
  return preferredVoice;
}

/** Speak a cue softly. Cancels any in-flight utterance first. */
export function speakCue(text: string, enabled = true) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = ensureVoice();
    if (voice) u.voice = voice;
    u.rate = 0.88;
    u.pitch = 0.95;
    u.volume = 0.75;
    window.speechSynthesis.speak(u);
  } catch {
    // silent fail
  }
}

export function stopSpeaking() {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

/** Warm up voices list (some browsers load async) */
export function warmVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  preferredVoice = pickVoice();
  if (!preferredVoice) {
    window.speechSynthesis.onvoiceschanged = () => {
      preferredVoice = pickVoice();
    };
  }
}
