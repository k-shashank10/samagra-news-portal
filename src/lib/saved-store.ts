import { useSyncExternalStore } from "react";

const KEY = "samagra:saved";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

let cache: number[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    cache = read();
    hydrated = true;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // ignore quota errors
  }
}

function emit() {
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
const emptySnapshot: number[] = [];
function getServerSnapshot() {
  return emptySnapshot;
}

export function useSavedIds(): number[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsSaved(id: number): boolean {
  const ids = useSavedIds();
  return ids.includes(id);
}

export function toggleSaved(id: number) {
  ensureHydrated();
  cache = cache.includes(id) ? cache.filter((x) => x !== id) : [id, ...cache];
  persist();
  emit();
}

export function clearSaved() {
  cache = [];
  persist();
  emit();
}
