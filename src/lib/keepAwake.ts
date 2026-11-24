/**
 * Keep screen awake during sleep / focus sessions.
 * Prefer Capacitor KeepAwake on native; fall back to Wake Lock API on web.
 */

let wakeLock: WakeLockSentinel | null = null;
let nativeHeld = false;

async function isNative(): Promise<boolean> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function requestKeepAwake(): Promise<void> {
  try {
    if (await isNative()) {
      try {
        const { KeepAwake } = await import("@capacitor-community/keep-awake");
        await KeepAwake.keepAwake();
        nativeHeld = true;
        return;
      } catch {
        // Plugin missing — fall through to web API
      }
    }

    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    }
  } catch {
    // Denied or unsupported
  }
}

export async function releaseKeepAwake(): Promise<void> {
  try {
    if (nativeHeld) {
      try {
        const { KeepAwake } = await import("@capacitor-community/keep-awake");
        await KeepAwake.allowSleep();
      } catch {
        /* ignore */
      }
      nativeHeld = false;
    }
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch {
    wakeLock = null;
    nativeHeld = false;
  }
}
