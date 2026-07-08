import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
export type TextSize = "sm" | "md" | "lg";

type Prefs = { theme: Theme; textSize: TextSize };

const KEY = "samagra:prefs";
const DEFAULTS: Prefs = { theme: "system", textSize: "md" };

const READER_PX: Record<TextSize, string> = {
  sm: "14px",
  md: "15px",
  lg: "18px",
};

let cache: Prefs = { ...DEFAULTS };
let hydrated = false;
const listeners = new Set<() => void>();

function read(): Prefs {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const p = JSON.parse(raw);
    return {
      theme: (["light", "dark", "system"] as const).includes(p.theme) ? p.theme : "system",
      textSize: (["sm", "md", "lg"] as const).includes(p.textSize) ? p.textSize : "md",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
}

let mql: MediaQueryList | null = null;
function applyDom() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark = mql ? mql.matches : false;
  const isDark = cache.theme === "dark" || (cache.theme === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
  root.style.setProperty("--reader-size", READER_PX[cache.textSize]);
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  cache = read();
  hydrated = true;
  mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener?.("change", () => {
    if (cache.theme === "system") applyDom();
    listeners.forEach((l) => l());
  });
  applyDom();
}

function emit() {
  applyDom();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  ensureHydrated();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  ensureHydrated();
  return cache;
}
function getServerSnapshot(): Prefs {
  return DEFAULTS;
}

export function usePrefs() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...prefs,
    setTheme(theme: Theme) {
      cache = { ...cache, theme };
      persist();
      emit();
    },
    setTextSize(textSize: TextSize) {
      cache = { ...cache, textSize };
      persist();
      emit();
    },
  };
}

/** Mounts the DOM effect early (no render output). */
export function PrefsMount() {
  usePrefs();
  return null;
}
