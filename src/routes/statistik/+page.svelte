<script>
  export let data;

  const maxAufwand = Math.max(...data.module.map((m) => m.aufwand), 1);
  const total = data.total || 1;
</script>

<div class="header">
  <h1>📊 Statistiken</h1>
  <p class="subtitle">Übersicht deiner Deadlines</p>
</div>

<!-- Übersichtskarten -->
<div class="stats-row">
  <div class="stat-card blau">
    <span class="zahl">{data.total}</span>
    <span class="label">Deadlines total</span>
  </div>
  <div class="stat-card orange">
    <span class="zahl">{data.totalAufwand}h</span>
    <span class="label">Gesamtaufwand</span>
  </div>
  <div class="stat-card gruen">
    <span class="zahl">{data.status.erledigt}</span>
    <span class="label">Erledigt</span>
  </div>
  <div class="stat-card rot">
    <span class="zahl">{data.status.offen}</span>
    <span class="label">Noch offen</span>
  </div>
</div>

<div class="charts-grid">
  <!-- Aufwand pro Modul -->
  <div class="card">
    <h2>⏱️ Aufwand pro Modul (Stunden)</h2>
    {#if data.module.length === 0}
      <p class="leer">Keine Daten vorhanden</p>
    {:else}
      <div class="bar-chart">
        {#each data.module as m}
          <div class="bar-row">
            <span class="bar-label">{m.modul}</span>
            <div class="bar-track">
              <div
                class="bar-fill blau"
                style="width: {(m.aufwand / maxAufwand) * 100}%"
              >
                {m.aufwand}h
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Status-Verteilung -->
  <div class="card">
    <h2>📋 Status-Verteilung</h2>
    <div class="donut-chart">
      <div class="status-item">
        <div class="status-bar">
          <div
            class="status-fill"
            style="width: {(data.status.offen / total) *
              100}%; background: #5c6bc0"
          ></div>
        </div>
        <span>📋 Offen: <strong>{data.status.offen}</strong></span>
      </div>
      <div class="status-item">
        <div class="status-bar">
          <div
            class="status-fill"
            style="width: {(data.status['in-bearbeitung'] / total) *
              100}%; background: #f39c12"
          ></div>
        </div>
        <span
          >⚙️ In Bearbeitung: <strong>{data.status["in-bearbeitung"]}</strong
          ></span
        >
      </div>
      <div class="status-item">
        <div class="status-bar">
          <div
            class="status-fill"
            style="width: {(data.status.erledigt / total) *
              100}%; background: #27ae60"
          ></div>
        </div>
        <span>✅ Erledigt: <strong>{data.status.erledigt}</strong></span>
      </div>
    </div>
  </div>

  <!-- Prioritäts-Verteilung -->
  <div class="card">
    <h2>🎯 Prioritäts-Verteilung</h2>
    <div class="prio-grid">
      <div class="prio-card rot">
        <span class="prio-zahl">{data.prioritaet.hoch}</span>
        <span>🔴 Hoch</span>
      </div>
      <div class="prio-card orange">
        <span class="prio-zahl">{data.prioritaet.mittel}</span>
        <span>🟡 Mittel</span>
      </div>
      <div class="prio-card gruen">
        <span class="prio-zahl">{data.prioritaet.niedrig}</span>
        <span>🟢 Niedrig</span>
      </div>
    </div>
  </div>
</div>

<style>
  .header {
    margin-bottom: 1.5rem;
  }
  h1 {
    margin: 0;
    color: #1a1a2e;
  }
  .subtitle {
    color: #666;
    margin: 0.25rem 0 0;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-top: 4px solid;
  }

  .stat-card.blau {
    border-color: #3498db;
  }
  .stat-card.orange {
    border-color: #f39c12;
  }
  .stat-card.gruen {
    border-color: #27ae60;
  }
  .stat-card.rot {
    border-color: #e74c3c;
  }

  .zahl {
    font-size: 2rem;
    font-weight: 700;
  }
  .label {
    color: #666;
    font-size: 0.85rem;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .card:first-child {
    grid-column: 1 / -1;
  }

  h2 {
    margin: 0 0 1.2rem;
    color: #1a1a2e;
    font-size: 1rem;
  }

  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .bar-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .bar-label {
    width: 120px;
    font-size: 0.9rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  .bar-track {
    flex: 1;
    background: #f0f2f5;
    border-radius: 20px;
    height: 32px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding-left: 0.75rem;
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
    min-width: 40px;
    transition: width 0.5s ease;
  }
  .bar-fill.blau {
    background: linear-gradient(90deg, #3498db, #5dade2);
  }

  .donut-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .status-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
  }
  .status-bar {
    background: #f0f2f5;
    border-radius: 20px;
    height: 24px;
    overflow: hidden;
  }
  .status-fill {
    height: 100%;
    border-radius: 20px;
    transition: width 0.5s ease;
  }

  .prio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .prio-card {
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .prio-card.rot {
    background: #fde;
    color: #e74c3c;
  }
  .prio-card.orange {
    background: #fef3e2;
    color: #f39c12;
  }
  .prio-card.gruen {
    background: #eafaf1;
    color: #27ae60;
  }
  .prio-zahl {
    font-size: 2rem;
    font-weight: 700;
  }

  .leer {
    color: #999;
    text-align: center;
    padding: 2rem;
  }
</style>
