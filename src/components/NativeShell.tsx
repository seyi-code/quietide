"use client";

import { useEffect } from "react";

/** Native-only: status bar + Android back button. No-op on web. */
export function NativeShell() {
  useEffect(() => {
    let removeBack: (() => void) | undefined;

    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#0B0F1A" });
        } catch {
          /* optional */
        }

        try {
          const { App } = await import("@capacitor/app");
          const handle = await App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
              window.history.back();
            } else {
              App.exitApp();
            }
          });
          removeBack = () => {
            handle.remove();
          };
        } catch {
          /* optional */
        }
      } catch {
        /* not in Capacitor */
      }
    })();

    return () => {
      removeBack?.();
    };
  }, []);

  return null;
}
