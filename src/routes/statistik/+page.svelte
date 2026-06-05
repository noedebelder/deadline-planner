<script>
  import { onMount } from 'svelte';
  export let data;

  const maxAufwand = Math.max(...data.module.map(m => m.aufwand), 1);
  const total = data.total || 1;
  const C = 239; // circumference of r=38 circle (2π×38 ≈ 238.76)

  let mounted = false;
  let counters = { total: 0, totalAufwand: 0, erledigt: 0, offen: 0 };

  $: ofenPct     = (data.status.offen / total) * 100;
  $: inBearbPct  = ((data.status['in-bearbeitung'] || 0) / total) * 100;
  $: erlPct      = (data.status.erledigt / total) * 100;
  $: completionPct = Math.round((data.status.erledigt / total) * 100);

  // Segment lengths animate from 0 → target when mounted
  $: erlLen     = mounted ? (erlPct    / 100) * C : 0;
  $: inBearbLen = mounted ? (inBearbPct / 100) * C : 0;
  $: ofenLen    = mounted ? (ofenPct   / 100) * C : 0;

  // Fixed offsets (use final data values, not animated)
  const erlOffset    = -((( data.status.offen + (data.status['in-bearbeitung'] || 0)) / total) * C);
  const inBearbOffset = -((data.status.offen / total) * C);

  onMount(() => {
    requestAnimationFrame(() => { mounted = true; });

    const targets = {
      total:        data.total,
      totalAufwand: data.totalAufwand,
      erledigt:     data.status.erledigt,
      offen:        data.status.offen
    };
    const duration = 1000;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      counters = {
        total:        Math.round(targets.total * e),
        totalAufwand: Math.round(targets.totalAufwand * e),
        erledigt:     Math.round(targets.erledigt * e),
        offen:        Math.round(targets.offen * e)
      };
      if (t < 1) requestAnimationFrame(tick);
      else counters = { ...targets };
    }
    requestAnimationFrame(tick);
  });
</script>

<div class="header">
  <div>
    <h1>Statistiken</h1>
    <p class="subtitle">Übersicht deiner Deadlines</p>
  </div>
  <div class="header-rechts">
    <a href="/api/export/ical" download class="export-btn">📅 iCal Export</a>
    <a href="/api/export" download class="export-btn">⬇️ CSV Export</a>
  </div>
</div>

<!-- Animierte Zähler-Karten -->
<div class="stats-row">
  <div class="stat-card blau">
    <span class="stat-icon">📅</span>
    <span class="stat-zahl">{counters.total}</span>
    <span class="stat-label">Deadlines total</span>
  </div>
  <div class="stat-card orange">
    <span class="stat-icon">⏱️</span>
    <span class="stat-zahl">{counters.totalAufwand}h</span>
    <span class="stat-label">Gesamtaufwand</span>
  </div>
  <div class="stat-card gruen">
    <span class="stat-icon">✅</span>
    <span class="stat-zahl">{counters.erledigt}</span>
    <span class="stat-label">Erledigt</span>
  </div>
  <div class="stat-card rot">
    <span class="stat-icon">📋</span>
    <span class="stat-zahl">{counters.offen}</span>
    <span class="stat-label">Noch offen</span>
  </div>
</div>

<div class="charts-grid">
  <!-- Animierter Balken-Chart (full width) -->
  <div class="card card-full">
    <h2>⏱️ Aufwand pro Modul (Stunden)</h2>
    {#if data.module.length === 0}
      <p class="leer-text">Noch keine Daten vorhanden.</p>
    {:else}
      <div class="bar-chart">
        {#each data.module as m, i}
          <div class="bar-row" style="animation-delay: {i * 0.05}s">
            <span class="bar-label">{m.modul}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                style="width: {mounted ? (m.aufwand / maxAufwand) * 100 : 0}%;
                       transition: width 0.8s cubic-bezier(0.4,0,0.2,1) {i * 0.07}s"
              >
                {#if (m.aufwand / maxAufwand) * 100 > 12}{m.aufwand}h{/if}
              </div>
            </div>
            <span class="bar-value">{m.aufwand}h</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- CSS Donut-Chart für Status -->
  <div class="card">
    <h2>📊 Status-Verteilung</h2>
    <div class="donut-layout">
      <div class="donut-wrap">
        <svg viewBox="0 0 100 100" class="donut-svg" aria-label="Status-Verteilung">
          <!-- Hintergrund-Ring -->
          <circle cx="50" cy="50" r="38" fill="none"
            stroke="currentColor" stroke-width="13" opacity="0.07"/>
          <!-- Erledigt (grün) -->
          <circle cx="50" cy="50" r="38" fill="none"
            stroke="#27ae60" stroke-width="13"
            stroke-dasharray="{erlLen} 999"
            stroke-dashoffset="{erlOffset}"
            transform="rotate(-90 50 50)"
            style="transition: stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1) 0.4s"
          />
          <!-- In Bearbeitung (orange) -->
          <circle cx="50" cy="50" r="38" fill="none"
            stroke="#f39c12" stroke-width="13"
            stroke-dasharray="{inBearbLen} 999"
            stroke-dashoffset="{inBearbOffset}"
            transform="rotate(-90 50 50)"
            style="transition: stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s"
          />
          <!-- Offen (blau) -->
          <circle cx="50" cy="50" r="38" fill="none"
            stroke="#5c6bc0" stroke-width="13"
            stroke-dasharray="{ofenLen} 999"
            stroke-dashoffset="0"
            transform="rotate(-90 50 50)"
            style="transition: stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1) 0s"
          />
        </svg>
        <div class="donut-center">
          <span class="donut-pct">{completionPct}%</span>
          <span class="donut-sub">erledigt</span>
        </div>
      </div>
      <div class="legende">
        <div class="legende-item">
          <span class="legende-dot" style="background:#5c6bc0"></span>
          <span class="legende-name">Offen</span>
          <span class="legende-val">{data.status.offen}</span>
        </div>
        <div class="legende-item">
          <span class="legende-dot" style="background:#f39c12"></span>
          <span class="legende-name">In Bearbeitung</span>
          <span class="legende-val">{data.status['in-bearbeitung'] || 0}</span>
        </div>
        <div class="legende-item">
          <span class="legende-dot" style="background:#27ae60"></span>
          <span class="legende-name">Erledigt</span>
          <span class="legende-val">{data.status.erledigt}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Prioritäts-Verteilung mit Mini-Balken -->
  <div class="card">
    <h2>🎯 Prioritäts-Verteilung</h2>
    <div class="prio-grid">
      {#each [
        { label: 'Hoch',    icon: '🔴', color: '#e74c3c', bg: 'rgba(231,76,60,0.08)',  border: 'rgba(231,76,60,0.2)',  val: data.prioritaet.hoch    },
        { label: 'Mittel',  icon: '🟡', color: '#f39c12', bg: 'rgba(243,156,18,0.08)', border: 'rgba(243,156,18,0.2)', val: data.prioritaet.mittel  },
        { label: 'Niedrig', icon: '🟢', color: '#27ae60', bg: 'rgba(39,174,96,0.08)',  border: 'rgba(39,174,96,0.2)',  val: data.prioritaet.niedrig }
      ] as p, i}
        <div class="prio-card" style="background:{p.bg}; border-color:{p.border}">
          <div class="prio-icon">{p.icon}</div>
          <span class="prio-zahl" style="color:{p.color}">{p.val}</span>
          <span class="prio-label">{p.label}</span>
          <div class="prio-track">
            <div class="prio-fill" style="
              width: {mounted && data.total > 0 ? (p.val / data.total) * 100 : 0}%;
              background: {p.color};
              transition: width 0.8s ease-out {0.3 + i * 0.1}s
            "></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .header {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 1.5rem;
  }
  .header-rechts { display: flex; gap: 0.5rem; align-items: center; align-self: center; }
  h1 { margin: 0; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
  .export-btn {
    background: white; color: #555; text-decoration: none;
    padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem;
    font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    white-space: nowrap; border: 1px solid rgba(0,0,0,0.06); transition: all 0.15s;
  }
  .export-btn:hover { background: #f0f2f5; transform: translateY(-1px); }

  /* ── Stat-Karten ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .stat-card {
    background: white; border-radius: 14px; padding: 1.25rem 1rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.05);
    border-top: 3px solid transparent;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .stat-card:hover { transform: translateY(-3px); }
  .stat-card.blau  { border-top-color: #3498db; }
  .stat-card.blau:hover  { box-shadow: 0 8px 24px rgba(52,152,219,0.18); }
  .stat-card.orange{ border-top-color: #f39c12; }
  .stat-card.orange:hover { box-shadow: 0 8px 24px rgba(243,156,18,0.18); }
  .stat-card.gruen { border-top-color: #27ae60; }
  .stat-card.gruen:hover { box-shadow: 0 8px 24px rgba(39,174,96,0.18); }
  .stat-card.rot   { border-top-color: #e74c3c; }
  .stat-card.rot:hover   { box-shadow: 0 8px 24px rgba(231,76,60,0.18); }
  .stat-icon { font-size: 1.4rem; margin-bottom: 0.1rem; }
  .stat-zahl { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: #1a1a2e; }
  .stat-label { color: #666; font-size: 0.8rem; font-weight: 500; }

  /* ── Charts ── */
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .card {
    background: white; border-radius: 14px; padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
  .card-full { grid-column: 1 / -1; }
  h2 { margin: 0 0 1.25rem; font-size: 1rem; font-weight: 700; color: #1a1a2e; }

  /* ── Balken-Chart ── */
  .bar-chart { display: flex; flex-direction: column; gap: 0.75rem; }
  .bar-row {
    display: flex; align-items: center; gap: 0.85rem;
    animation: rowIn 0.3s ease-out both;
  }
  @keyframes rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
  .bar-label {
    width: 130px; font-size: 0.88rem; font-weight: 600; flex-shrink: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333;
  }
  .bar-track {
    flex: 1; background: #f0f2f5; border-radius: 8px; height: 28px; overflow: hidden;
  }
  .bar-fill {
    height: 100%; border-radius: 8px;
    background: linear-gradient(90deg, #3498db, #5dade2);
    display: flex; align-items: center; padding-left: 0.7rem;
    color: white; font-weight: 700; font-size: 0.82rem;
    white-space: nowrap; overflow: hidden; min-width: 0;
  }
  .bar-value {
    font-size: 0.82rem; font-weight: 700; color: #666;
    width: 35px; text-align: right; flex-shrink: 0;
  }

  /* ── Donut Chart ── */
  .donut-layout { display: flex; align-items: center; gap: 2rem; }
  .donut-wrap { position: relative; flex-shrink: 0; width: 160px; height: 160px; }
  .donut-svg { width: 100%; height: 100%; overflow: visible; }
  .donut-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center;
    pointer-events: none; gap: 0.05rem;
  }
  .donut-pct { font-size: 1.65rem; font-weight: 800; letter-spacing: -0.04em; color: #1a1a2e; }
  .donut-sub { font-size: 0.72rem; color: #888; font-weight: 500; }

  .legende { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
  .legende-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; }
  .legende-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .legende-name { flex: 1; color: #555; }
  .legende-val { font-weight: 800; font-size: 1rem; }

  /* ── Priorität ── */
  .prio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }
  .prio-card {
    border-radius: 12px; padding: 1.1rem 0.85rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    border: 1px solid transparent;
    transition: transform 0.2s ease;
  }
  .prio-card:hover { transform: translateY(-2px); }
  .prio-icon { font-size: 1.6rem; }
  .prio-zahl { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.03em; }
  .prio-label { font-size: 0.82rem; font-weight: 600; color: #666; }
  .prio-track {
    width: 100%; height: 4px; background: rgba(0,0,0,0.08); border-radius: 4px;
    margin-top: 0.5rem; overflow: hidden;
  }
  .prio-fill { height: 100%; border-radius: 4px; }

  .leer-text { color: #999; text-align: center; padding: 2rem; margin: 0; }

  /* ── Dark Mode ── */
  :global([data-theme="dark"]) .stat-label,
  :global([data-theme="dark"]) .subtitle,
  :global([data-theme="dark"]) .bar-value,
  :global([data-theme="dark"]) .legende-name,
  :global([data-theme="dark"]) .donut-sub,
  :global([data-theme="dark"]) .prio-label  { color: #8b949e !important; }

  :global([data-theme="dark"]) .stat-zahl,
  :global([data-theme="dark"]) .donut-pct,
  :global([data-theme="dark"]) .legende-val { color: #e6edf3 !important; }

  :global([data-theme="dark"]) h1,
  :global([data-theme="dark"]) h2           { color: #e6edf3 !important; }

  :global([data-theme="dark"]) .bar-track,
  :global([data-theme="dark"]) .prio-track  { background: rgba(255,255,255,0.08) !important; }

  :global([data-theme="dark"]) .bar-label   { color: #c9d1d9 !important; }

  :global([data-theme="dark"]) .export-btn {
    background: rgba(255,255,255,0.06) !important; color: #c9d1d9 !important;
    border-color: rgba(255,255,255,0.08) !important; box-shadow: none !important;
  }
  :global([data-theme="dark"]) .export-btn:hover { background: rgba(255,255,255,0.1) !important; }

  :global([data-theme="dark"]) .prio-card {
    background: rgba(255,255,255,0.04) !important;
    border-color: rgba(255,255,255,0.08) !important;
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
    .card-full { grid-column: 1; }
    .donut-layout { flex-direction: column; gap: 1.25rem; }
    .header { flex-direction: column; gap: 0.75rem; }
    .header-rechts { align-self: flex-start; }
    .bar-label { width: 90px; }
  }
  @media (max-width: 480px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .stat-zahl { font-size: 1.6rem; }
    .donut-wrap { width: 130px; height: 130px; }
  }
</style>
