<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  export let data;

  let darkMode = false;

  onMount(() => {
    darkMode = document.documentElement.getAttribute("data-theme") === "dark";
  });

  function toggleDark() {
    darkMode = !darkMode;
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
</script>

<div class="app">
  <nav>
    <a href="/" class="nav-brand">📅 Deadline Planner</a>
    <div class="nav-links">
      <a href="/" class:active={$page.url.pathname === "/"}>
        Übersicht
        {#if data.dieseWoche > 0}
          <span class="nav-badge">{data.dieseWoche}</span>
        {/if}
      </a>
      <a href="/kalender" class:active={$page.url.pathname === "/kalender"}>Kalender</a>
      <a href="/archiv" class:active={$page.url.pathname === "/archiv"}>Archiv</a>
      <a href="/statistik" class:active={$page.url.pathname === "/statistik"}>Statistik</a>
      {#if data.user?.role === "admin"}
        <a href="/admin" class:active={$page.url.pathname === "/admin"}>👑 Admin</a>
      {/if}
      <a href="/neu" class="nav-btn">+ Neue Deadline</a>
      <div class="nav-right">
        <button class="dark-toggle" on:click={toggleDark} title={darkMode ? 'Helles Design' : 'Dunkles Design'} type="button">
          {darkMode ? "☀️" : "🌙"}
        </button>
        {#if data.user}
          <a href="/profil" class="profil-link" class:active={$page.url.pathname === "/profil"}>
            👤 {data.user.username}
          </a>
          <form method="POST" action="/logout">
            <button type="submit" class="logout-btn">Abmelden</button>
          </form>
        {/if}
      </div>
    </div>
  </nav>

  <main>
    <slot />
  </main>
</div>

<style>
  /* ===== BASE ===== */
  :global(body) {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: #f0f2f5;
    color: #1a1a2e;
  }
  :global(*) { box-sizing: border-box; }

  .app { min-height: 100vh; }

  nav {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 0.85rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    gap: 1rem;
  }

  .nav-brand {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .nav-links a {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    transition: all 0.2s;
    white-space: nowrap;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: white;
    background: rgba(255,255,255,0.15);
  }

  .nav-btn {
    background: #e94560 !important;
    color: white !important;
  }
  .nav-btn:hover { background: #c73652 !important; }

  .nav-badge {
    background: #e94560;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    border-radius: 20px;
    line-height: 1.4;
    min-width: 18px;
    text-align: center;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border-left: 1px solid rgba(255,255,255,0.2);
    padding-left: 0.75rem;
    margin-left: 0.25rem;
  }

  .dark-toggle {
    background: rgba(255,255,255,0.1);
    border: none;
    border-radius: 6px;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: background 0.2s;
  }
  .dark-toggle:hover { background: rgba(255,255,255,0.2); }

  .profil-link {
    color: rgba(255,255,255,0.8) !important;
    font-size: 0.9rem;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .profil-link:hover,
  .profil-link.active {
    color: white !important;
    background: rgba(255,255,255,0.15) !important;
  }

  .logout-btn {
    background: rgba(255,255,255,0.12);
    color: white;
    border: none;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .logout-btn:hover { background: rgba(255,255,255,0.22); }

  main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
  }

  /* ===== DARK MODE ===== */
  :global([data-theme="dark"] body) {
    background: #0d1117;
    color: #e6edf3;
  }

  /* White containers */
  :global([data-theme="dark"] .stat-card),
  :global([data-theme="dark"] .tabelle-container),
  :global([data-theme="dark"] .leer),
  :global([data-theme="dark"] .detail-main),
  :global([data-theme="dark"] .monat-section),
  :global([data-theme="dark"] .card),
  :global([data-theme="dark"] .login-card) {
    background: #161b22 !important;
    color: #e6edf3;
  }

  /* Forms (not the logout form in nav) */
  :global([data-theme="dark"] main form) {
    background: #161b22 !important;
  }

  /* Headings */
  :global([data-theme="dark"] h1),
  :global([data-theme="dark"] h2),
  :global([data-theme="dark"] .stat-zahl) {
    color: #e6edf3 !important;
  }

  /* Muted text */
  :global([data-theme="dark"] .subtitle),
  :global([data-theme="dark"] .stat-label),
  :global([data-theme="dark"] .info-label),
  :global([data-theme="dark"] .modul-label),
  :global([data-theme="dark"] .karte-modul),
  :global([data-theme="dark"] .karte-datum),
  :global([data-theme="dark"] .keine-zeile),
  :global([data-theme="dark"] .leer-hint),
  :global([data-theme="dark"] .geschuetzt) {
    color: #8b949e !important;
  }

  /* Labels and normal text */
  :global([data-theme="dark"] main label) {
    color: #c9d1d9 !important;
  }
  :global([data-theme="dark"] td),
  :global([data-theme="dark"] td strong),
  :global([data-theme="dark"] .info-wert),
  :global([data-theme="dark"] .karte-titel) {
    color: #e6edf3 !important;
  }

  /* Table */
  :global([data-theme="dark"] td) {
    border-bottom-color: #21262d !important;
  }
  :global([data-theme="dark"] tr:hover) {
    background: #1c2128 !important;
  }
  :global([data-theme="dark"] tr.ok:hover),
  :global([data-theme="dark"] tr.warnung:hover),
  :global([data-theme="dark"] tr.kritisch:hover),
  :global([data-theme="dark"] tr.ueberfaellig:hover) {
    background: #1c2128 !important;
  }

  /* Inputs */
  :global([data-theme="dark"] input),
  :global([data-theme="dark"] select) {
    background: #0d1117 !important;
    border-color: #30363d !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"] input:focus),
  :global([data-theme="dark"] select:focus) {
    border-color: #e94560 !important;
  }
  :global([data-theme="dark"] input::placeholder) {
    color: #4d5566 !important;
  }
  :global([data-theme="dark"] .suche-input) {
    background: #161b22 !important;
  }

  /* Buttons */
  :global([data-theme="dark"] .btn-icon) {
    background: #21262d !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"] .btn-icon:hover) {
    background: #2d333b !important;
  }
  :global([data-theme="dark"] .abbrechen) {
    background: #21262d !important;
    color: #c9d1d9 !important;
  }
  :global([data-theme="dark"] .abbrechen:hover) {
    background: #2d333b !important;
  }
  :global([data-theme="dark"] .archiv-link),
  :global([data-theme="dark"] .zurueck-link),
  :global([data-theme="dark"] .export-btn) {
    background: #21262d !important;
    color: #c9d1d9 !important;
    box-shadow: none !important;
  }
  :global([data-theme="dark"] .archiv-link:hover),
  :global([data-theme="dark"] .zurueck-link:hover),
  :global([data-theme="dark"] .export-btn:hover) {
    background: #2d333b !important;
  }
  :global([data-theme="dark"] .suche-clear) {
    color: #4d5566 !important;
  }

  /* Borders */
  :global([data-theme="dark"] .info-zeile) {
    border-bottom-color: #21262d !important;
  }
  :global([data-theme="dark"] .info-karte) {
    border-color: #21262d !important;
  }
  :global([data-theme="dark"] .tabs) {
    border-color: #30363d !important;
  }
  :global([data-theme="dark"] .tabs button:not(.active)) {
    background: #161b22 !important;
    color: #8b949e !important;
  }

  /* Calendar */
  :global([data-theme="dark"] .deadline-karte) {
    background: #0d1117 !important;
    border-color: #30363d !important;
  }
  :global([data-theme="dark"] .deadline-karte:hover) {
    background: #161b22 !important;
    border-color: #e94560 !important;
  }
  :global([data-theme="dark"] .deadline-karte.status-erledigt) {
    background: #0d1117 !important;
    border-color: #21262d !important;
  }

  /* Profile */
  :global([data-theme="dark"] .stats-mini) {
    background: #0d1117 !important;
  }
  :global([data-theme="dark"] .stat-zahl.gruen) { color: #4ade80 !important; }
  :global([data-theme="dark"] .stat-zahl.blau) { color: #60a5fa !important; }

  /* Detail page tage-karte */
  :global([data-theme="dark"] .tage-karte.ok) { background: #0a1f11 !important; }
  :global([data-theme="dark"] .tage-karte.warnung) { background: #1f1a0a !important; }
  :global([data-theme="dark"] .tage-karte.kritisch) { background: #1f150a !important; }
  :global([data-theme="dark"] .tage-karte.ueberfaellig) { background: #1f0a0a !important; }
  :global([data-theme="dark"] .tage-karte.erledigt) { background: #0a1f11 !important; }

  /* User badge */
  :global([data-theme="dark"] .user-badge) {
    background: #21262d !important;
    color: #8b949e !important;
  }

  /* Feedback boxes */
  :global([data-theme="dark"] .fehler) {
    background: #3d1212 !important;
    color: #f87171 !important;
  }
  :global([data-theme="dark"] .erfolg) {
    background: #123d1a !important;
    color: #4ade80 !important;
  }

  /* Breadcrumb */
  :global([data-theme="dark"] .breadcrumb) {
    color: #8b949e !important;
  }

  /* Rolle badges (admin panel) */
  :global([data-theme="dark"] .rolle.admin),
  :global([data-theme="dark"] .rolle-badge.admin) {
    background: #3d2a12 !important;
    color: #fbbf24 !important;
  }
  :global([data-theme="dark"] .rolle.user),
  :global([data-theme="dark"] .rolle-badge.user) {
    background: #1e2d4a !important;
    color: #93c5fd !important;
  }

  /* Priority badges */
  :global([data-theme="dark"] .prio.hoch),
  :global([data-theme="dark"] .karte-prio.prio-hoch) {
    background: #3d1212 !important; color: #f87171 !important;
  }
  :global([data-theme="dark"] .prio.mittel),
  :global([data-theme="dark"] .karte-prio.prio-mittel) {
    background: #3d2a12 !important; color: #fbbf24 !important;
  }
  :global([data-theme="dark"] .prio.niedrig),
  :global([data-theme="dark"] .karte-prio.prio-niedrig) {
    background: #123d1a !important; color: #4ade80 !important;
  }

  /* Status badges */
  :global([data-theme="dark"] .status-badge.offen),
  :global([data-theme="dark"] .karte-status.status-badge-offen) {
    background: #1e2d4a !important; color: #93c5fd !important;
  }
  :global([data-theme="dark"] .status-badge.in-bearbeitung),
  :global([data-theme="dark"] .karte-status.status-badge-in-bearbeitung) {
    background: #3d2a12 !important; color: #fbbf24 !important;
  }
  :global([data-theme="dark"] .status-badge.erledigt),
  :global([data-theme="dark"] .karte-status.status-badge-erledigt) {
    background: #123d1a !important; color: #4ade80 !important;
  }

  /* Day badges */
  :global([data-theme="dark"] .badge.rot) { background: #3d1212 !important; color: #f87171 !important; }
  :global([data-theme="dark"] .badge.orange) { background: #3d2a12 !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .badge.kritisch) { background: #3d2a12 !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .badge.warnung) { background: #3d3012 !important; color: #fde047 !important; }
  :global([data-theme="dark"] .badge.ok) { background: #123d1a !important; color: #4ade80 !important; }

  :global([data-theme="dark"] .tage-badge) { background: #123d1a !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .tage-badge.kritisch) { background: #3d2a12 !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .tage-badge.warnung) { background: #3d3012 !important; color: #fde047 !important; }
  :global([data-theme="dark"] .tage-badge.ueberfaellig) { background: #3d1212 !important; color: #f87171 !important; }
  :global([data-theme="dark"] .tage-badge.heute) { background: #3d2a12 !important; color: #fbbf24 !important; }

  /* Admin panel btn-delete */
  :global([data-theme="dark"] .btn-delete) {
    background: #3d1212 !important;
    color: #f87171 !important;
  }
  :global([data-theme="dark"] .btn-delete:hover) {
    background: #5a1a1a !important;
  }

  /* Login page */
  :global([data-theme="dark"] .login-card h1),
  :global([data-theme="dark"] .login-card h2) {
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"] .login-card p) {
    color: #8b949e !important;
  }

  /* Inline-form inputs (admin) */
  :global([data-theme="dark"] .inline-form input),
  :global([data-theme="dark"] .inline-form select) {
    background: #0d1117 !important;
    border-color: #30363d !important;
    color: #e6edf3 !important;
  }
</style>
