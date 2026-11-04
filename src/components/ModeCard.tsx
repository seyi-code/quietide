"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Moon, Wind, Target, AlertCircle } from "lucide-react";

interface ModeCardProps {
  title: string;
  description: string;
  href: string;
  icon: "sleep" | "relax" | "focus" | "sos";
  className?: string;
}

const icons = {
  sleep: Moon,
  relax: Wind,
  focus: Target,
  sos: AlertCircle,
};

export function ModeCard({ title, description, href, icon, className }: ModeCardProps) {
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-white/5 bg-quietide-card p-6 transition-all hover:border-quietide-primary/40 hover:bg-quietide-surface hover:shadow-xl hover:shadow-quietide-primary/10",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-quietide-primary/10 text-quietide-primary transition-colors group-hover:bg-quietide-primary/20">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-quietide-soft">{title}</h3>
        <p className="mt-1 text-sm text-quietide-muted">{description}</p>
      </div>
    </Link>
  );
}
