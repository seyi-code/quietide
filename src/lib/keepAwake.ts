/**
 * Screen wake lock helpers.
 * Uses the browser Wake Lock API when available; Capacitor keep-awake is optional.
 */

let wakeLock: WakeLockSentinel | null = null;

export async function requestKeepAwake(): Promise<void> {
  try {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    }
  } catch {
    // Not supported or denied — fine offline / low power
  }
}

export async function releaseKeepAwake(): Promise<void> {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch {
    wakeLock = null;
  }
}
