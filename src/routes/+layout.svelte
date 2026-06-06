<script>
  import { page, navigating } from "$app/stores";
  import { onMount } from "svelte";
  import Toast from "$lib/Toast.svelte";
  export let data;

  let darkMode = false;
  let menuOffen = false;

  onMount(() => {
    darkMode = document.documentElement.getAttribute("data-theme") === "dark";
  });

  function toggleDark() {
    darkMode = !darkMode;
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  function schliessMenu() {
    menuOffen = false;
  }
</script>

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

<div class="app">
  <nav>
    <a href="/" class="nav-brand" on:click={schliessMenu}>
      <span class="brand-icon">📅</span>
      <span class="brand-text">Deadline Planner</span>
    </a>

    {#if data.user}
      <button
        class="hamburger"
        class:aktiv={menuOffen}
        on:click={() => (menuOffen = !menuOffen)}
        aria-label="Menü"
        type="button"
      >
        <span></span><span></span><span></span>
      </button>
    {/if}

    <div class="nav-links" class:offen={menuOffen}>
      {#if data.user}
        <a href="/" class:active={$page.url.pathname === "/"} on:click={schliessMenu}>
          Übersicht
          {#if data.baldFaellig > 0}
            <span class="nav-badge urgent">{data.baldFaellig}</span>
          {/if}
        </a>
        <a href="/tagesplanung" class:active={$page.url.pathname === "/tagesplanung"} on:click={schliessMenu}>Tagesplanung</a>
        <a href="/module" class:active={$page.url.pathname === "/module"} on:click={schliessMenu}>Module</a>
        <a href="/kalender" class:active={$page.url.pathname === "/kalender"} on:click={schliessMenu}>Kalender</a>
        <a href="/assistent" class:active={$page.url.pathname === "/assistent"} on:click={schliessMenu}>🤖 KI-Assistent</a>
        <a href="/archiv" class:active={$page.url.pathname === "/archiv"} on:click={schliessMenu}>Archiv</a>
        <a href="/statistik" class:active={$page.url.pathname === "/statistik"} on:click={schliessMenu}>Statistik</a>
        {#if data.user.role === "admin"}
          <a href="/admin" class:active={$page.url.pathname === "/admin"} on:click={schliessMenu}>👑 Admin</a>
        {/if}
        <a href="/neu" class="nav-btn" on:click={schliessMenu}>+ Neue Deadline</a>
        <div class="nav-right">
          <button class="dark-toggle" on:click={toggleDark} title={darkMode ? "Helles Design" : "Dunkles Design"} type="button">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <a href="/einstellungen" class="profil-link" class:active={$page.url.pathname === "/einstellungen"} on:click={schliessMenu} title="Einstellungen">⚙️</a>
          <a href="/profil" class="profil-link" class:active={$page.url.pathname === "/profil"} on:click={schliessMenu}>
            👤 {data.user.username}
          </a>
          <form method="POST" action="/logout">
            <button type="submit" class="logout-btn" on:click={schliessMenu}>Abmelden</button>
          </form>
        </div>
      {:else}
        <div class="nav-right">
          <button class="dark-toggle" on:click={toggleDark} title={darkMode ? "Helles Design" : "Dunkles Design"} type="button">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <a href="/login" class="nav-login-btn">Anmelden</a>
          <a href="/login" class="nav-btn">Registrieren</a>
        </div>
      {/if}
    </div>
  </nav>

  <!-- Mobile Overlay -->
  {#if menuOffen}
    <div class="menu-overlay" on:click={schliessMenu} role="button" tabindex="-1" aria-label="Menü schließen"></div>
  {/if}

  <main class:landing-main={$page.data.isLanding}>
    {#key $page.url.pathname}
      <div class="page-content">
        <slot />
      </div>
    {/key}
  </main>
</div>

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
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  :global([data-theme="dark"]) .bg-blobs { opacity: 1; }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }
  .blob-1 {
    width: 700px; height: 700px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%);
  }
  .blob-2 {
    width: 600px; height: 600px;
    bottom: -100px; left: -150px;
    background: radial-gradient(circle, rgba(92,107,192,0.2) 0%, transparent 70%);
  }
  .blob-3 {
    width: 400px; height: 400px;
    top: 40%; right: 25%;
    background: radial-gradient(circle, rgba(39,174,96,0.12) 0%, transparent 70%);
  }

  /* ══════════════════════════════════════════
     PROGRESS BAR
  ══════════════════════════════════════════ */
  .progress-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 3px;
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
     APP WRAPPER
  ══════════════════════════════════════════ */
  .app {
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  /* ══════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════ */
  nav {
    background: rgba(15, 20, 40, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.4);
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    flex-shrink: 0;
  }
  .brand-icon { font-size: 1.3rem; }
  .brand-text {
    color: white;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .nav-links a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.88rem;
    padding: 0.4rem 0.7rem;
    border-radius: 7px;
    transition: all 0.15s ease;
    white-space: nowrap;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    letter-spacing: -0.01em;
  }
  .nav-links a:hover { color: white; background: rgba(255,255,255,0.1); }
  .nav-links a.active { color: white; background: rgba(255,255,255,0.12); }

  .nav-btn {
    background: #e94560 !important;
    color: white !important;
    font-weight: 600 !important;
  }
  .nav-btn:hover { background: #c73652 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(233,69,96,0.4) !important; }

  .nav-login-btn {
    background: rgba(255,255,255,0.1) !important;
    color: white !important;
  }
  .nav-login-btn:hover { background: rgba(255,255,255,0.16) !important; }

  .nav-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.1rem 0.42rem;
    border-radius: 20px;
    line-height: 1.4;
    min-width: 18px;
    text-align: center;
  }
  .nav-badge.urgent {
    background: #e94560;
    color: white;
    animation: badgePulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 0 0 rgba(233,69,96,0.7);
  }
  @keyframes badgePulse {
    0% { box-shadow: 0 0 0 0 rgba(233,69,96,0.6); }
    70% { box-shadow: 0 0 0 6px rgba(233,69,96,0); }
    100% { box-shadow: 0 0 0 0 rgba(233,69,96,0); }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border-left: 1px solid rgba(255,255,255,0.12);
    padding-left: 0.75rem;
    margin-left: 0.25rem;
  }

  .dark-toggle {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 7px;
    padding: 0.35rem 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    line-height: 1;
    transition: all 0.15s;
  }
  .dark-toggle:hover { background: rgba(255,255,255,0.16); }

  .profil-link {
    color: rgba(255,255,255,0.7) !important;
    font-size: 0.88rem;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 7px;
    transition: all 0.15s;
  }
  .profil-link:hover, .profil-link.active {
    color: white !important;
    background: rgba(255,255,255,0.12) !important;
  }

  .logout-btn {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.35rem 0.75rem;
    border-radius: 7px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: inherit;
    white-space: nowrap;
    transition: all 0.15s;
  }
  .logout-btn:hover { background: rgba(255,255,255,0.14); color: white; }

  /* ══════════════════════════════════════════
     HAMBURGER MENU
  ══════════════════════════════════════════ */
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    cursor: pointer;
    padding: 0.5rem 0.6rem;
    flex-shrink: 0;
  }
  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  .hamburger.aktiv span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.aktiv span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.aktiv span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .menu-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 98;
    backdrop-filter: blur(2px);
  }

  /* ══════════════════════════════════════════
     MAIN CONTENT
  ══════════════════════════════════════════ */
  main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
  }
  main.landing-main {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  .page-content {
    animation: pageIn 0.2s ease-out both;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ══════════════════════════════════════════
     GLOBAL INTERACTIVE STYLES
  ══════════════════════════════════════════ */
  :global(button:not(.hamburger):not(.dark-toggle):not(.logout-btn):active) {
    transform: scale(0.97);
  }
  :global(a.btn-primary:active), :global(.cta-primary:active) {
    transform: scale(0.97) !important;
  }

  /* Card hover lift */
  :global(.card), :global(.stat-card), :global(.modul-karte), :global(.zusammenfassung) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  /* Global badge animations */
  :global(.badge.rot) {
    animation: pulseBadge 2s ease-in-out infinite;
  }
  @keyframes pulseBadge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0.5); }
    50% { box-shadow: 0 0 0 4px rgba(231,76,60,0); }
  }
  :global(.badge.kritisch) {
    box-shadow: 0 0 10px rgba(243,156,18,0.4);
  }

  /* ══════════════════════════════════════════
     DARK MODE — GLOBAL
  ══════════════════════════════════════════ */
  :global([data-theme="dark"] body) {
    background: #0d1117;
    color: #e6edf3;
  }

  /* Glassmorphism cards in dark mode */
  :global([data-theme="dark"] .stat-card),
  :global([data-theme="dark"] .tabelle-container),
  :global([data-theme="dark"] .leer),
  :global([data-theme="dark"] .card),
  :global([data-theme="dark"] .modul-karte),
  :global([data-theme="dark"] .zusammenfassung),
  :global([data-theme="dark"] .tages-karte) {
    background: rgba(22, 27, 34, 0.85) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
    color: #e6edf3;
  }

  :global([data-theme="dark"] .detail-main) {
    background: rgba(22, 27, 34, 0.9) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }

  :global([data-theme="dark"] main form) {
    background: rgba(22, 27, 34, 0.85) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }

  :global([data-theme="dark"] .login-card) {
    background: rgba(22, 27, 34, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6) !important;
  }

  :global([data-theme="dark"] .mock-window) {
    background: rgba(13, 17, 23, 0.95) !important;
    border-color: rgba(255,255,255,0.1) !important;
  }

  /* Text colors */
  :global([data-theme="dark"] h1),
  :global([data-theme="dark"] h2),
  :global([data-theme="dark"] h3),
  :global([data-theme="dark"] .stat-zahl) {
    color: #e6edf3 !important;
  }

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
  :global([data-theme="dark"] .leer p) {
    color: #8b949e !important;
  }

  :global([data-theme="dark"] main label) { color: #c9d1d9 !important; }

  :global([data-theme="dark"] td),
  :global([data-theme="dark"] td strong),
  :global([data-theme="dark"] .info-wert),
  :global([data-theme="dark"] .karte-titel),
  :global([data-theme="dark"] .tages-titel),
  :global([data-theme="dark"] .modul-name),
  :global([data-theme="dark"] .dl-titel strong) {
    color: #e6edf3 !important;
  }

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
  :global([data-theme="dark"] .tabs button:not(.active)) {
    background: rgba(255,255,255,0.04) !important; color: #8b949e !important;
  }

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
  :global([data-theme="dark"] .inline-form select) {
    background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.12) !important; color: #e6edf3 !important;
  }

  :global([data-theme="dark"] .feature-card) { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .feature-card h3) { color: #e6edf3 !important; }

  :global([data-theme="dark"] .warnung-banner.gefahr) {
    background: rgba(61,18,18,0.8) !important; color: #f87171 !important; border-color: rgba(231,76,60,0.4) !important;
  }
  :global([data-theme="dark"] .warnung-banner.warnung) {
    background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; border-color: rgba(243,156,18,0.4) !important;
  }
  :global([data-theme="dark"] .warnung-banner.info) {
    background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; border-color: rgba(92,107,192,0.4) !important;
  }
  :global([data-theme="dark"] .warnung-banner.erfolg) {
    background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; border-color: rgba(39,174,96,0.4) !important;
  }

  :global([data-theme="dark"] .fortschritt-popup) {
    background: rgba(22,27,34,0.95) !important; border-color: rgba(255,255,255,0.1) !important;
  }
  :global([data-theme="dark"] .mini-bar-bg) { background: rgba(255,255,255,0.1) !important; }

  :global([data-theme="dark"] .tages-karte) {
    background: rgba(22,27,34,0.85) !important;
    border-left-color: rgba(255,255,255,0.12);
  }
  :global([data-theme="dark"] .tages-karte:hover) {
    background: rgba(30,36,50,0.95) !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.4) !important;
  }
  :global([data-theme="dark"] .tages-gruppe h3) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .gruppe-leer) { color: #8b949e !important; }

  :global([data-theme="dark"] .modul-header:hover) { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile) { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile:hover) { background: rgba(255,255,255,0.03) !important; }
  :global([data-theme="dark"] .toggle-icon) { color: #555 !important; }

  :global([data-theme="dark"] .mini-bar) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-mini) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-gross) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .notizen-text) {
    background: rgba(30,45,74,0.4) !important; color: #c9d1d9 !important; border-color: rgba(92,107,192,0.4) !important;
  }

  :global([data-theme="dark"] .fortschritt-sektion) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .notizen-sektion) { border-color: rgba(255,255,255,0.06) !important; }

  :global([data-theme="dark"] .zf-divider) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .zf-zahl) { color: #e6edf3 !important; }

  :global([data-theme="dark"] .typ-pill) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }

  :global([data-theme="dark"] .leer-emoji) { filter: grayscale(0.2); }

  /* ══════════════════════════════════════════
     MOBILE RESPONSIVE
  ══════════════════════════════════════════ */
  @media (max-width: 900px) {
    .hamburger { display: flex; }
    .menu-overlay { display: block; }

    .nav-links {
      position: fixed;
      top: 0;
      left: 0; right: 0;
      bottom: 0;
      background: rgba(10, 14, 28, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      flex-direction: column;
      align-items: flex-start;
      padding: 5rem 1.5rem 2rem;
      gap: 0.25rem;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 99;
      overflow-y: auto;
    }
    .nav-links.offen { transform: translateX(0); }

    .nav-links a {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border-radius: 10px;
    }

    .nav-right {
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-left: 0;
      padding-top: 1rem;
      margin-left: 0;
      margin-top: 0.5rem;
      width: 100%;
      flex-wrap: wrap;
    }

    .nav-btn { margin-top: 0.5rem; }
  }

  @media (max-width: 640px) {
    main { margin: 1rem auto; padding: 0 1rem; }
    :global(h1) { font-size: 1.6rem; }
  }
</style>
