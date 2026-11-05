"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

function resolveTheme(preference: "dark" | "light" | "system"): "dark" | "light" {
  if (preference === "system") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }
  return preference;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const applied = resolveTheme(theme);
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(applied);

    // Update theme-color meta for mobile browser chrome
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", applied === "dark" ? "#0B0F1A" : "#F4F6FB");
    }
  }, [theme]);

  // Follow OS changes when preference is "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const applied = resolveTheme("system");
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(applied);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", applied === "dark" ? "#0B0F1A" : "#F4F6FB");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return <>{children}</>;
}
