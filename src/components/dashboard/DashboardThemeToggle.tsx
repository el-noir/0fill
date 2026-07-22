"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function DashboardThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    const isLight = resolvedTheme === "light";
    const nextTheme = isLight ? "dark" : "light";

    return (
        <button
            type="button"
            suppressHydrationWarning
            onClick={() => setTheme(nextTheme)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-0"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
    );
}
