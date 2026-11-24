"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
  durationMs = 4000,
}: {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[60] w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-quietide bg-quietide-card px-4 py-3 text-sm text-quietide-soft shadow-lg card-elevated"
    >
      {message}
    </div>
  );
}
