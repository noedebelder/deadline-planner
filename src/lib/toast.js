import { writable } from "svelte/store";

export const toasts = writable([]);
let nextId = 0;

export function addToast(message, type = "success", duration = 3500) {
  const id = nextId++;
  toasts.update((ts) => [...ts, { id, message, type }]);
  setTimeout(() => {
    toasts.update((ts) => ts.filter((t) => t.id !== id));
  }, duration);
}
