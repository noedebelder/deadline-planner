<script>
  import { toasts } from "./toast.js";
  import { fly } from "svelte/transition";

  const iconMap = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };
</script>

<div class="toast-container" aria-live="polite">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast {toast.type}"
      role="alert"
      transition:fly={{ y: -16, duration: 280 }}
    >
      <span class="toast-icon">{iconMap[toast.type] ?? "✓"}</span>
      <span class="toast-msg">{toast.message}</span>
      <button
        class="toast-close"
        type="button"
        on:click={() => toasts.update((ts) => ts.filter((t) => t.id !== toast.id))}
        aria-label="Schließen"
      >✕</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    pointer-events: all;
    min-width: 240px;
    max-width: 360px;
  }

  .toast.success {
    background: #1a3a22;
    color: #4ade80;
    border: 1px solid #2d6a3f;
  }
  .toast.error {
    background: #3a1a1a;
    color: #f87171;
    border: 1px solid #6a2d2d;
  }
  .toast.info {
    background: #1a2a3a;
    color: #60a5fa;
    border: 1px solid #2d4a6a;
  }
  .toast.warning {
    background: #3a2a1a;
    color: #fbbf24;
    border: 1px solid #6a4a2d;
  }

  .toast-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .toast-msg {
    flex: 1;
  }

  .toast-close {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    font-size: 0.8rem;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .toast-close:hover {
    opacity: 1;
  }
</style>
