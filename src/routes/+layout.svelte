<script>
  import { page, navigating } from "$app/stores";
  import { onMount } from "svelte";
  import Toast from "$lib/Toast.svelte";
  export let data;

  let darkMode = false;
  let notifOffen = false;

  onMount(() => {
    darkMode = document.documentElement.getAttribute("data-theme") === "dark";
  });

  function toggleDark() {
    darkMode = !darkMode;
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleNotif() {
    notifOffen = !notifOffen;
  }
</script>

<svelte:window on:click={() => (notifOffen = false)} />

<!-- Navigations-Ladebalken -->
{#if $navigating}
  <div class="progress-bar"></div>
{/if}

<Toast />

<!-- Hintergrund-Blobs für Glassmorphism -->
<div class="bg-blobs" aria-hidden="true">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
</div>

{#if data.user}
  <!-- ═══ EINGELOGGT: Sidebar + Inhalt ═══ -->
  <div class="app-layout">

    <aside class="sidebar">

      <!-- Logo -->
      <a href="/" class="sidebar-brand" title="Deadline Planner">
        <span class="brand-icon">📅</span>
        <span class="brand-text">Deadline Planner</span>
      </a>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <a href="/" title="Übersicht" class:active={$page.url.pathname === "/"}>
          <i class="icon">
            🏠
            {#if data.baldFaellig > 0}
              <span class="icon-badge">{data.baldFaellig}</span>
            {/if}
          </i>
          <span class="label">
            Übersicht
            {#if data.baldFaellig > 0}
              <span class="label-badge">{data.baldFaellig}</span>
            {/if}
          </span>
        </a>

        <a href="/neu" title="Neue Deadline" class="neu-link" class:active={$page.url.pathname === "/neu"}>
          <i class="icon">➕</i>
          <span class="label">Neue Deadline</span>
        </a>

        <a href="/tagesplanung" title="Tagesplanung" class:active={$page.url.pathname === "/tagesplanung"}>
          <i class="icon">📋</i>
          <span class="label">Tagesplanung</span>
        </a>

        <a href="/kalender" title="Kalender" class:active={$page.url.pathname === "/kalender"}>
          <i class="icon">📅</i>
          <span class="label">Kalender</span>
        </a>

        <a href="/module" title="Module" class:active={$page.url.pathname === "/module"}>
          <i class="icon">📚</i>
          <span class="label">Module</span>
        </a>

        <a href="/statistik" title="Statistik" class:active={$page.url.pathname === "/statistik"}>
          <i class="icon">📊</i>
          <span class="label">Statistik</span>
        </a>

        <a href="/assistent" title="KI-Assistent" class:active={$page.url.pathname === "/assistent"}>
          <i class="icon">🤖</i>
          <span class="label">KI-Assistent</span>
        </a>

        <a href="/archiv" title="Archiv" class:active={$page.url.pathname === "/archiv"}>
          <i class="icon">🗂️</i>
          <span class="label">Archiv</span>
        </a>

        {#if data.user.role === "admin"}
          <a href="/admin" title="Admin" class:active={$page.url.pathname === "/admin"}>
            <i class="icon">👑</i>
            <span class="label">Admin</span>
          </a>
        {/if}

      </nav>

      <!-- Footer: Einstellungen, Dark Mode, User, Logout -->
      <div class="sidebar-footer">

        <a href="/einstellungen" title="Einstellungen" class:active={$page.url.pathname === "/einstellungen"}>
          <i class="icon">⚙️</i>
          <span class="label">Einstellungen</span>
        </a>

        <button class="sidebar-btn" on:click={toggleDark} title={darkMode ? "Helles Design" : "Dunkles Design"} type="button">
          <i class="icon">{darkMode ? "☀️" : "🌙"}</i>
          <span class="label">{darkMode ? "Helles Design" : "Dunkles Design"}</span>
        </button>

        <div class="user-info" title={data.user.username}>
          <i class="icon">👤</i>
          <span class="label">{data.user.username}</span>
        </div>

        <form method="POST" action="/logout">
          <button type="submit" class="sidebar-btn logout-btn" title="Abmelden">
            <i class="icon">🚪</i>
            <span class="label">Abmelden</span>
          </button>
        </form>

      </div>
    </aside>

    <!-- Hauptinhalt -->
    <main class="main-content">

      <!-- Top-Bar mit Benachrichtigungs-Glocke -->
      <header class="top-bar">
        <div class="top-bar-links"></div>
        <div class="top-bar-rechts">
          <div class="notification-menu">
            <button
              class="notif-glocke"
              on:click|stopPropagation={toggleNotif}
              title="Benachrichtigungen"
              type="button"
              class:aktiv={notifOffen}
            >
              🔔
              {#if (data.benachrichtigungen?.length ?? 0) > 0}
                <span class="notif-badge-dot">{data.benachrichtigungen.length}</span>
              {/if}
            </button>

            {#if notifOffen}
              <div class="notif-dropdown">
                <div class="notif-kopf">
                  <span class="notif-kopf-titel">Benachrichtigungen</span>
                  <span class="notif-kopf-zaehler {(data.benachrichtigungen?.length ?? 0) === 0 ? 'leer' : ''}">
                    {data.benachrichtigungen?.length ?? 0}
                  </span>
                </div>

                {#if !(data.benachrichtigungen?.length)}
                  <div class="notif-leer">✅ Keine dringenden Deadlines</div>
                {:else}
                  <div class="notif-liste">
                    {#each data.benachrichtigungen as n}
                      <a
                        href="/deadline/{n.id}"
                        class="notif-zeile {n.typ}"
                        on:click={() => (notifOffen = false)}
                      >
                        <span class="notif-typ-icon">
                          {#if n.typ === "ueberfaellig"}🔴{:else if n.typ === "heute"}🟠{:else}🟡{/if}
                        </span>
                        <div class="notif-info">
                          <p class="notif-name">{n.titel}</p>
                          <p class="notif-meta">
                            {n.modul} ·
                            {#if n.tage < 0}
                              Überfällig seit {Math.abs(n.tage)} Tag{Math.abs(n.tage) !== 1 ? "en" : ""}
                            {:else if n.tage === 0}
                              Heute fällig!
                            {:else}
                              In {n.tage} Tag{n.tage !== 1 ? "en" : ""} fällig
                            {/if}
                          </p>
                        </div>
                        <span class="notif-pfeil">→</span>
                      </a>
                    {/each}
                  </div>
                  <a href="/" class="notif-footer-link" on:click={() => (notifOffen = false)}>
                    Alle Deadlines ansehen →
                  </a>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </header>

      {#key $page.url.pathname}
        <div class="page-content">
          <slot />
        </div>
      {/key}
    </main>

  </div>

{:else}
  <!-- ═══ NICHT EINGELOGGT: Kein Sidebar (Landing / Login) ═══ -->
  <main class="no-auth-main">
    {#key $page.url.pathname}
      <div class="page-content">
        <slot />
      </div>
    {/key}
  </main>
{/if}

<style>
  /* ══════════════════════════════════════════
     GLOBAL RESET + TYPOGRAPHY
  ══════════════════════════════════════════ */
  :global(*) { box-sizing: border-box; }

  :global(body) {
    margin: 0;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    font-size: 0.95rem;
    line-height: 1.6;
    background: #f0f2f5;
    color: #1a1a2e;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  :global(h1) { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 0.25rem; }
  :global(h2) { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.01em; }
  :global(h3) { font-size: 1.1rem; font-weight: 700; }
  :global(button) { font-family: inherit; }
  :global(input), :global(select), :global(textarea) {
    font-family: inherit;
    font-size: 0.95rem;
  }

  /* ══════════════════════════════════════════
     BACKGROUND BLOBS
  ══════════════════════════════════════════ */
  .bg-blobs {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    overflow: hidden; opacity: 0;
    transition: opacity 0.5s ease;
  }
  :global([data-theme="dark"]) .bg-blobs { opacity: 1; }

  .blob { position: absolute; border-radius: 50%; filter: blur(80px); }
  .blob-1 {
    width: 700px; height: 700px; top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%);
  }
  .blob-2 {
    width: 600px; height: 600px; bottom: -100px; left: -150px;
    background: radial-gradient(circle, rgba(92,107,192,0.2) 0%, transparent 70%);
  }
  .blob-3 {
    width: 400px; height: 400px; top: 40%; right: 25%;
    background: radial-gradient(circle, rgba(39,174,96,0.12) 0%, transparent 70%);
  }

  /* ══════════════════════════════════════════
     PROGRESS BAR
  ══════════════════════════════════════════ */
  .progress-bar {
    position: fixed; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #e94560, #ff6b6b, #e94560);
    background-size: 200% 100%;
    z-index: 10000;
    animation: progress-anim 1.2s ease-in-out infinite;
  }
  @keyframes progress-anim {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* ══════════════════════════════════════════
     LAYOUT
  ══════════════════════════════════════════ */
  .app-layout {
    display: flex;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  /* ══════════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════════ */
  .sidebar {
    width: 64px;
    min-height: 100vh;
    background: #1a1a2e;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0;
    z-index: 200;
    overflow: hidden;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border-right: 1px solid rgba(255,255,255,0.08);
    box-shadow: 2px 0 12px rgba(0,0,0,0.15);
  }
  .sidebar:hover { width: 220px; }

  /* Brand / Logo */
  .sidebar-brand {
    display: flex; align-items: center; gap: 12px;
    padding: 18px; min-height: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    text-decoration: none; white-space: nowrap;
    flex-shrink: 0;
  }
  .brand-icon { font-size: 22px; flex-shrink: 0; line-height: 1; }
  .brand-text {
    font-size: 0.95rem; font-weight: 800; color: white;
    letter-spacing: -0.02em;
    opacity: 0; transition: opacity 0.15s ease;
    overflow: hidden;
  }
  .sidebar:hover .brand-text { opacity: 1; }

  /* Nav */
  .sidebar-nav {
    flex: 1; display: flex; flex-direction: column;
    padding: 10px 8px; gap: 2px; overflow: hidden;
  }

  .sidebar-nav a,
  .sidebar-footer a,
  .sidebar-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 10px; border-radius: 9px;
    color: rgba(255,255,255,0.55);
    text-decoration: none; white-space: nowrap;
    transition: background 0.15s, color 0.15s;
    font-size: 0.875rem; font-weight: 500;
    background: none; border: none; cursor: pointer;
    width: 100%; text-align: left;
    flex-shrink: 0;
  }

  .sidebar-nav a:hover,
  .sidebar-footer a:hover,
  .sidebar-btn:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }

  .sidebar-nav a.active {
    background: rgba(233,69,96,0.18);
    color: #e94560;
    font-weight: 600;
  }

  .neu-link {
    background: rgba(233,69,96,0.12) !important;
    color: #e94560 !important;
    font-weight: 600 !important;
    margin-bottom: 6px;
  }
  .neu-link:hover {
    background: #e94560 !important;
    color: white !important;
  }
  .neu-link.active {
    background: #e94560 !important;
    color: white !important;
  }

  /* Icon */
  .icon {
    font-size: 20px; flex-shrink: 0;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  /* Badge auf Icon (Collapsed-Modus sichtbar) */
  .icon-badge {
    position: absolute; top: -5px; right: -5px;
    background: #e94560; color: white;
    border-radius: 50%; font-size: 0.58rem;
    width: 16px; height: 16px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; line-height: 1;
    border: 1.5px solid #1a1a2e;
    animation: badgePulse 2s ease-in-out infinite;
  }
  @keyframes badgePulse {
    0% { box-shadow: 0 0 0 0 rgba(233,69,96,0.6); }
    70% { box-shadow: 0 0 0 5px rgba(233,69,96,0); }
    100% { box-shadow: 0 0 0 0 rgba(233,69,96,0); }
  }

  /* Label (expanded) */
  .label {
    opacity: 0;
    transition: opacity 0.15s ease;
    overflow: hidden; white-space: nowrap;
    display: flex; align-items: center; gap: 8px;
  }
  .sidebar:hover .label { opacity: 1; }

  /* Badge im Label-Text */
  .label-badge {
    background: #e94560; color: white;
    border-radius: 20px; font-size: 0.65rem;
    padding: 0.1rem 0.45rem; font-weight: 700;
    line-height: 1.4; min-width: 18px; text-align: center;
  }

  /* Footer */
  .sidebar-footer {
    padding: 8px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; gap: 2px;
    flex-shrink: 0;
  }
  .sidebar-footer form { width: 100%; }

  .user-info {
    display: flex; align-items: center; gap: 12px;
    padding: 10px; border-radius: 9px;
    color: rgba(255,255,255,0.3);
    font-size: 0.875rem; white-space: nowrap;
    cursor: default;
  }

  .logout-btn {
    color: rgba(255,255,255,0.5) !important;
  }
  .logout-btn:hover {
    background: rgba(233,69,96,0.15) !important;
    color: #e94560 !important;
  }

  /* ══════════════════════════════════════════
     HAUPTINHALT
  ══════════════════════════════════════════ */
  .main-content {
    margin-left: 64px;
    flex: 1;
    padding: 2rem;
    min-height: 100vh;
    transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative; z-index: 1;
    max-width: calc(100vw - 64px);
  }

  /* Wenn Sidebar gehovert: Content verschiebt sich mit */
  .sidebar:hover ~ .main-content {
    margin-left: 220px;
    max-width: calc(100vw - 220px);
  }

  /* Nicht eingeloggt */
  .no-auth-main {
    min-height: 100vh;
    position: relative; z-index: 1;
  }

  /* Seiten-Übergangs-Animation */
  .page-content {
    animation: pageIn 0.2s ease-out both;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ══════════════════════════════════════════
     INTERACTIVE GLOBALS
  ══════════════════════════════════════════ */
  :global(.card), :global(.stat-card), :global(.modul-karte), :global(.zusammenfassung) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  :global(.badge.rot) {
    animation: pulseBadge 2s ease-in-out infinite;
  }
  @keyframes pulseBadge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0.5); }
    50% { box-shadow: 0 0 0 4px rgba(231,76,60,0); }
  }
  :global(.badge.kritisch) { box-shadow: 0 0 10px rgba(243,156,18,0.4); }

  /* ══════════════════════════════════════════
     DARK MODE — GLOBAL
  ══════════════════════════════════════════ */
  :global([data-theme="dark"] body) {
    background: #0d1117;
    color: #e6edf3;
  }

  :global([data-theme="dark"] .stat-card),
  :global([data-theme="dark"] .tabelle-container),
  :global([data-theme="dark"] .leer),
  :global([data-theme="dark"] .card),
  :global([data-theme="dark"] .modul-karte),
  :global([data-theme="dark"] .zusammenfassung),
  :global([data-theme="dark"] .tages-karte) {
    background: rgba(22,27,34,0.85) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
    color: #e6edf3;
  }
  :global([data-theme="dark"] .detail-main) {
    background: rgba(22,27,34,0.9) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }
  :global([data-theme="dark"] main form) {
    background: rgba(22,27,34,0.85) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }
  :global([data-theme="dark"] .login-card) {
    background: rgba(22,27,34,0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6) !important;
  }
  :global([data-theme="dark"] .mock-window) {
    background: rgba(13,17,23,0.95) !important;
    border-color: rgba(255,255,255,0.1) !important;
  }

  :global([data-theme="dark"] h1),
  :global([data-theme="dark"] h2),
  :global([data-theme="dark"] h3),
  :global([data-theme="dark"] .stat-zahl) { color: #e6edf3 !important; }

  :global([data-theme="dark"] .subtitle),
  :global([data-theme="dark"] .stat-label),
  :global([data-theme="dark"] .info-label),
  :global([data-theme="dark"] .modul-label),
  :global([data-theme="dark"] .karte-modul),
  :global([data-theme="dark"] .karte-datum),
  :global([data-theme="dark"] .keine-zeile),
  :global([data-theme="dark"] .leer-hint),
  :global([data-theme="dark"] .geschuetzt),
  :global([data-theme="dark"] .features-sub),
  :global([data-theme="dark"] .feature-card p),
  :global([data-theme="dark"] .optional),
  :global([data-theme="dark"] .tages-modul),
  :global([data-theme="dark"] .modul-meta),
  :global([data-theme="dark"] .dl-datum),
  :global([data-theme="dark"] .fortschritt-meta),
  :global([data-theme="dark"] .leer p) { color: #8b949e !important; }

  :global([data-theme="dark"] main label) { color: #c9d1d9 !important; }

  :global([data-theme="dark"] td),
  :global([data-theme="dark"] td strong),
  :global([data-theme="dark"] .info-wert),
  :global([data-theme="dark"] .karte-titel),
  :global([data-theme="dark"] .tages-titel),
  :global([data-theme="dark"] .modul-name),
  :global([data-theme="dark"] .dl-titel strong) { color: #e6edf3 !important; }

  :global([data-theme="dark"] td) { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] tr:hover) { background: rgba(255,255,255,0.03) !important; }

  :global([data-theme="dark"] input),
  :global([data-theme="dark"] select),
  :global([data-theme="dark"] textarea) {
    background: rgba(13,17,23,0.8) !important;
    border-color: rgba(255,255,255,0.12) !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"] input:focus),
  :global([data-theme="dark"] select:focus),
  :global([data-theme="dark"] textarea:focus) { border-color: #e94560 !important; box-shadow: 0 0 0 3px rgba(233,69,96,0.15) !important; }
  :global([data-theme="dark"] input::placeholder),
  :global([data-theme="dark"] textarea::placeholder) { color: #4d5566 !important; }
  :global([data-theme="dark"] .suche-input) { background: rgba(22,27,34,0.9) !important; }

  :global([data-theme="dark"] .btn-icon) { background: rgba(255,255,255,0.06) !important; color: #e6edf3 !important; border: 1px solid rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .btn-icon:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .abbrechen) { background: rgba(255,255,255,0.06) !important; color: #c9d1d9 !important; border: 1px solid rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .abbrechen:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .archiv-link),
  :global([data-theme="dark"] .zurueck-link),
  :global([data-theme="dark"] .export-btn) {
    background: rgba(255,255,255,0.06) !important; color: #c9d1d9 !important;
    border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: none !important;
  }
  :global([data-theme="dark"] .archiv-link:hover),
  :global([data-theme="dark"] .zurueck-link:hover),
  :global([data-theme="dark"] .export-btn:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .suche-clear) { color: #4d5566 !important; }
  :global([data-theme="dark"] .info-karte) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .tabs) { border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .tabs button:not(.active)) { background: rgba(255,255,255,0.04) !important; color: #8b949e !important; }
  :global([data-theme="dark"] .deadline-karte) { background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .deadline-karte:hover) { background: rgba(22,27,34,0.95) !important; border-color: #e94560 !important; }
  :global([data-theme="dark"] .deadline-karte.status-erledigt) { background: rgba(13,17,23,0.5) !important; }
  :global([data-theme="dark"] .monat-section) { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .stats-mini) { background: rgba(13,17,23,0.6) !important; }
  :global([data-theme="dark"] .tage-karte.ok) { background: rgba(10,31,17,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.warnung) { background: rgba(31,26,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.kritisch) { background: rgba(31,21,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.ueberfaellig) { background: rgba(31,10,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.erledigt) { background: rgba(10,31,17,0.8) !important; }
  :global([data-theme="dark"] .user-badge) { background: rgba(255,255,255,0.06) !important; color: #8b949e !important; }
  :global([data-theme="dark"] .fehler) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .erfolg) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .breadcrumb) { color: #8b949e !important; }
  :global([data-theme="dark"] .rolle.admin),
  :global([data-theme="dark"] .rolle-badge.admin) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .rolle.user),
  :global([data-theme="dark"] .rolle-badge.user) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .prio.hoch),
  :global([data-theme="dark"] .karte-prio.prio-hoch) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .prio.mittel),
  :global([data-theme="dark"] .karte-prio.prio-mittel) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .prio.niedrig),
  :global([data-theme="dark"] .karte-prio.prio-niedrig) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .status-badge.offen),
  :global([data-theme="dark"] .karte-status.status-badge-offen) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .status-badge.in-bearbeitung),
  :global([data-theme="dark"] .karte-status.status-badge-in-bearbeitung) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .status-badge.erledigt),
  :global([data-theme="dark"] .karte-status.status-badge-erledigt) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .badge.rot) { background: rgba(61,18,18,0.9) !important; color: #f87171 !important; border: 1px solid rgba(231,76,60,0.3) !important; }
  :global([data-theme="dark"] .badge.orange) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .badge.kritisch) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; box-shadow: 0 0 10px rgba(243,156,18,0.2) !important; }
  :global([data-theme="dark"] .badge.warnung) { background: rgba(61,48,18,0.8) !important; color: #fde047 !important; }
  :global([data-theme="dark"] .badge.ok) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .tage-badge.ueberfaellig) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .tage-badge.heute) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .tage-badge.kritisch) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .tage-badge.warnung) { background: rgba(61,48,18,0.8) !important; color: #fde047 !important; }
  :global([data-theme="dark"] .tage-badge.ok) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .btn-delete) { background: rgba(61,18,18,0.6) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .btn-delete:hover) { background: rgba(90,26,26,0.8) !important; }
  :global([data-theme="dark"] .login-card h1) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .login-card p) { color: #8b949e !important; }
  :global([data-theme="dark"] .inline-form input),
  :global([data-theme="dark"] .inline-form select) { background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.12) !important; color: #e6edf3 !important; }
  :global([data-theme="dark"] .feature-card) { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .feature-card h3) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .warnung-banner.gefahr) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; border-color: rgba(231,76,60,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.warnung) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; border-color: rgba(243,156,18,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.info) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; border-color: rgba(92,107,192,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.erfolg) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; border-color: rgba(39,174,96,0.4) !important; }
  :global([data-theme="dark"] .fortschritt-popup) { background: rgba(22,27,34,0.95) !important; border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .mini-bar-bg) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .tages-karte) { background: rgba(22,27,34,0.85) !important; border-left-color: rgba(255,255,255,0.12); }
  :global([data-theme="dark"] .tages-karte:hover) { background: rgba(30,36,50,0.95) !important; box-shadow: 0 6px 24px rgba(0,0,0,0.4) !important; }
  :global([data-theme="dark"] .tages-gruppe h3) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .gruppe-leer) { color: #8b949e !important; }
  :global([data-theme="dark"] .modul-header:hover) { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile) { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile:hover) { background: rgba(255,255,255,0.03) !important; }
  :global([data-theme="dark"] .toggle-icon) { color: #555 !important; }
  :global([data-theme="dark"] .mini-bar) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-mini) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-gross) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .notizen-text) { background: rgba(30,45,74,0.4) !important; color: #c9d1d9 !important; border-color: rgba(92,107,192,0.4) !important; }
  :global([data-theme="dark"] .fortschritt-sektion) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .notizen-sektion) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .zf-divider) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .zf-zahl) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .typ-pill) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .leer-emoji) { filter: grayscale(0.2); }

  /* ══════════════════════════════════════════
     MOBILE: Sidebar als Bottom-Bar
  ══════════════════════════════════════════ */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: 56px;
      min-height: unset;
      flex-direction: row;
      top: auto; bottom: 0; left: 0; right: 0;
      overflow-x: auto; overflow-y: hidden;
      border-right: none;
      border-top: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
    }
    /* Hover-Effekt auf Mobile deaktivieren */
    .sidebar:hover { width: 100%; height: 56px; }

    .sidebar-brand { display: none; }

    .sidebar-nav {
      flex-direction: row;
      flex: 1;
      padding: 0 4px;
      gap: 0;
      align-items: center;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .sidebar-nav::-webkit-scrollbar { display: none; }
    .sidebar-nav a { padding: 8px 10px; border-radius: 8px; }

    .sidebar-footer {
      flex-direction: row; border-top: none;
      border-left: 1px solid rgba(255,255,255,0.08);
      padding: 0 4px; align-items: center;
      flex-shrink: 0;
    }
    .sidebar-footer form { width: auto; }
    .sidebar-footer .sidebar-btn,
    .sidebar-footer a { padding: 8px 10px; }
    .user-info { display: none; }

    /* Labels auf Mobile immer versteckt */
    .label { display: none !important; }
    .brand-text { display: none; }

    .main-content {
      margin-left: 0 !important;
      margin-bottom: 56px;
      padding: 1rem;
      max-width: 100%;
    }
    .sidebar:hover ~ .main-content {
      margin-left: 0 !important;
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    :global(h1) { font-size: 1.6rem; }
    .main-content { padding: 0.75rem; }
  }

  /* ══════════════════════════════════════════
     TOP-BAR (Notification-Leiste)
  ══════════════════════════════════════════ */
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0;
    margin-bottom: 1.5rem;
    position: sticky;
    top: 0;
    z-index: 50;
    /* Negiert main-content padding seitlich → volle Breite */
    margin-left: -2rem;
    margin-right: -2rem;
    margin-top: -2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    background: rgba(240, 242, 245, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  }

  .top-bar-links { flex: 1; }
  .top-bar-rechts { display: flex; align-items: center; gap: 0.5rem; }

  /* ══════════════════════════════════════════
     BENACHRICHTIGUNGS-GLOCKE
  ══════════════════════════════════════════ */
  .notification-menu { position: relative; }

  .notif-glocke {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.08);
    cursor: pointer; font-size: 1.15rem;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: background 0.15s, transform 0.15s;
    color: #1a1a2e;
  }
  .notif-glocke:hover { background: rgba(0, 0, 0, 0.09); transform: scale(1.05); }
  .notif-glocke.aktiv {
    background: rgba(233, 69, 96, 0.1);
    border-color: rgba(233, 69, 96, 0.25);
  }

  /* Badge-Punkt auf der Glocke */
  .notif-badge-dot {
    position: absolute; top: -4px; right: -4px;
    background: #e94560; color: white;
    font-size: 0.58rem; font-weight: 700;
    border-radius: 50%;
    min-width: 18px; height: 18px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid rgba(240, 242, 245, 0.9);
    animation: glockenPuls 2s ease-in-out infinite;
    line-height: 1; padding: 0 2px;
  }
  @keyframes glockenPuls {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(233,69,96,0.5); }
    50% { transform: scale(1.1); box-shadow: 0 0 0 4px rgba(233,69,96,0); }
  }

  /* ══════════════════════════════════════════
     DROPDOWN
  ══════════════════════════════════════════ */
  .notif-dropdown {
    position: absolute;
    right: 0; top: calc(100% + 10px);
    width: 320px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: dropIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 300;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .notif-kopf {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  .notif-kopf-titel { font-weight: 700; font-size: 0.9rem; color: #1a1a2e; }
  .notif-kopf-zaehler {
    background: #e94560; color: white;
    font-size: 0.7rem; font-weight: 700;
    padding: 0.15rem 0.55rem; border-radius: 20px; min-width: 22px; text-align: center;
  }
  .notif-kopf-zaehler.leer { background: #e0e0e0; color: #999; }

  .notif-leer {
    padding: 1.75rem 1rem;
    text-align: center; color: #888; font-size: 0.875rem;
  }

  .notif-liste { max-height: 300px; overflow-y: auto; }
  .notif-liste::-webkit-scrollbar { width: 4px; }
  .notif-liste::-webkit-scrollbar-track { background: transparent; }
  .notif-liste::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

  .notif-zeile {
    display: flex; align-items: flex-start; gap: 0.65rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f5f5f5;
    text-decoration: none; color: inherit;
    transition: background 0.12s;
  }
  .notif-zeile:last-child { border-bottom: none; }
  .notif-zeile:hover { background: #f8f9ff; }

  .notif-zeile.ueberfaellig { border-left: 3px solid #e74c3c; }
  .notif-zeile.heute { border-left: 3px solid #f39c12; }
  .notif-zeile.bald { border-left: 3px solid #f1c40f; }

  .notif-typ-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }

  .notif-info { flex: 1; min-width: 0; }
  .notif-name {
    font-size: 0.875rem; font-weight: 600; color: #1a1a2e;
    margin: 0 0 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .notif-meta { font-size: 0.75rem; color: #888; margin: 0; }

  .notif-zeile.ueberfaellig .notif-name { color: #e74c3c; }
  .notif-zeile.heute .notif-name { color: #e67e22; }

  .notif-pfeil { color: #ccc; font-size: 0.85rem; align-self: center; flex-shrink: 0; }

  .notif-footer-link {
    display: block; text-align: center;
    padding: 0.7rem; font-size: 0.82rem;
    color: #e94560; text-decoration: none; font-weight: 600;
    border-top: 1px solid #f0f0f0;
    background: #fafbff;
    transition: background 0.12s;
  }
  .notif-footer-link:hover { background: #f0f2ff; }

  /* Dark Mode – Top-Bar & Dropdown */
  :global([data-theme="dark"]) .top-bar {
    background: rgba(13, 17, 23, 0.9) !important;
    border-bottom-color: rgba(255,255,255,0.06) !important;
  }
  :global([data-theme="dark"]) .notif-glocke {
    background: rgba(255,255,255,0.08) !important;
    border-color: rgba(255,255,255,0.1) !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"]) .notif-glocke:hover { background: rgba(255,255,255,0.12) !important; }
  :global([data-theme="dark"]) .notif-glocke.aktiv {
    background: rgba(233,69,96,0.15) !important;
    border-color: rgba(233,69,96,0.3) !important;
  }
  :global([data-theme="dark"]) .notif-badge-dot { border-color: rgba(13,17,23,0.9) !important; }
  :global([data-theme="dark"]) .notif-dropdown {
    background: rgba(22,27,34,0.98) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08) !important;
  }
  :global([data-theme="dark"]) .notif-kopf { border-bottom-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .notif-kopf-titel { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .notif-zeile { border-bottom-color: rgba(255,255,255,0.05) !important; }
  :global([data-theme="dark"]) .notif-zeile:hover { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"]) .notif-name { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .notif-zeile.ueberfaellig .notif-name { color: #f87171 !important; }
  :global([data-theme="dark"]) .notif-zeile.heute .notif-name { color: #fbbf24 !important; }
  :global([data-theme="dark"]) .notif-footer-link { background: rgba(13,17,23,0.5) !important; border-top-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .notif-footer-link:hover { background: rgba(30,45,74,0.5) !important; }
  :global([data-theme="dark"]) .notif-leer { color: #4d5566 !important; }

  @media (max-width: 768px) {
    .top-bar {
      margin-left: -1rem; margin-right: -1rem;
      margin-top: -1rem;
      padding-left: 1rem; padding-right: 1rem;
    }
    .notif-dropdown { width: 290px; right: -8px; }
  }
  @media (max-width: 480px) {
    .top-bar { margin-left: -0.75rem; margin-right: -0.75rem; padding-left: 0.75rem; padding-right: 0.75rem; }
    .notif-dropdown { width: calc(100vw - 2rem); right: -0.75rem; }
  }
</style>
