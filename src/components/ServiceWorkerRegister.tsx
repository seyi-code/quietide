"use client";

import { useEffect } from "react";

/**
 * Registers the service worker with an explicit scope.
 * Android Chrome needs an active SW + fetch handler to enable Install (WebAPK).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        reg.update().catch(() => {});
      } catch (err) {
        console.warn("[Quietide] Service worker registration failed:", err);
      }
    };

    register();
  }, []);

  return null;
}
