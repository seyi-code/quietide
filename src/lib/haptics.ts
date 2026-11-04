/**
 * Soft haptic feedback for breathe phases.
 * Works on Capacitor (native) and is a no-op on web.
 */
export async function hapticLight() {
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Web or plugin not available – silent
  }
}

export async function hapticMedium() {
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // ignore
  }
}
