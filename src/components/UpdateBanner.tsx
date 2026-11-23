"use client";

import { useEffect, useState } from "react";

export function UpdateBanner() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onController = () => {
      // optional: soft reload after activation
    };

    navigator.serviceWorker.addEventListener("controllerchange", onController);

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      const check = () => {
        if (reg.waiting) setWaiting(reg.waiting);
      };
      check();
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            setWaiting(reg.waiting);
          }
        });
      });
      const id = window.setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      return () => clearInterval(id);
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onController);
    };
  }, []);

  if (!waiting) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-2xl border border-quietide-primary/30 bg-quietide-card px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-quietide-soft">Update available</p>
        <button
          type="button"
          className="rounded-full bg-quietide-primary px-4 py-2 text-sm font-medium text-white active:scale-95"
          onClick={() => {
            waiting.postMessage("SKIP_WAITING");
            window.location.reload();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
