import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quietide-primary disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-quietide-primary text-white hover:bg-quietide-primary/90 shadow-lg shadow-quietide-primary/20":
              variant === "primary",
            "bg-quietide-card text-quietide-soft border border-quietide-strong hover:bg-quietide-surface":
              variant === "secondary",
            "bg-transparent text-quietide-muted hover:text-quietide-soft hover:bg-quietide-border/5":
              variant === "ghost",
            "bg-red-500/20 text-red-300 hover:bg-red-500/30": variant === "danger",
            "h-9 px-4 text-sm": size === "sm",
            "h-12 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
