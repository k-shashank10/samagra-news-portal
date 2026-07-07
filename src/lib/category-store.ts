import { useSyncExternalStore } from "react";

let current: string | null = null;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return current;
}

export function useCategoryFilter() {
  const category = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    category,
    setCategory: (c: string | null) => {
      current = c;
      listeners.forEach((l) => l());
    },
  };
}
