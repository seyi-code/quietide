"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wind, Moon, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/guided", label: "Guided", icon: Sparkles },
  { href: "/breathe", label: "Breathe", icon: Wind },
  { href: "/sleep", label: "Sleep", icon: Moon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-quietide bg-quietide-bg/95 backdrop-blur-md safe-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-2 pt-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] transition-colors",
                active
                  ? "text-quietide-primary"
                  : "text-quietide-muted hover:text-quietide-soft"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
