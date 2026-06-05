<script>
  export let data;

  const d = data.deadline;

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }

  $: tage = tageVerbleibend(d.deadline);

  function tageText(tage) {
    if (d.status === 'erledigt') return '✅ Erledigt';
    if (tage < 0) return `${Math.abs(tage)} Tage überfällig`;
    if (tage === 0) return 'Heute fällig!';
    if (tage === 1) return 'Morgen fällig';
    return `${tage} Tage verbleibend`;
  }

  function tageKlasse(tage) {
    if (d.status === 'erledigt') return 'erledigt';
    if (tage < 0) return 'ueberfaellig';
    if (tage <= 3) return 'kritisch';
    if (tage <= 7) return 'warnung';
    return 'ok';
  }
</script>

<div class="breadcrumb">
  <a href="/">Übersicht</a> <span>›</span> <span>{d.titel}</span>
</div>

<div class="detail-layout">
  <div class="detail-main">
    <div class="detail-header">
      <div>
        <h1>{d.titel}</h1>
        <p class="modul-label">📚 {d.modul}</p>
      </div>
      <div class="header-aktionen">
        <a href="/bearbeiten/{d.id}" class="btn-edit">✏️ Bearbeiten</a>
        <a href="/" class="btn-back">← Zurück</a>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-karte">
        <span class="info-icon">📅</span>
        <div>
          <div class="info-titel">Deadline</div>
          <div class="info-wert">
            {new Date(d.deadline).toLocaleDateString('de-CH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div class="info-karte tage-karte {tageKlasse(tage)}">
        <span class="info-icon">⏱️</span>
        <div>
          <div class="info-titel">Zeit</div>
          <div class="info-wert">{tageText(tage)}</div>
        </div>
      </div>

      <div class="info-karte">
        <span class="info-icon">⚡</span>
        <div>
          <div class="info-titel">Priorität</div>
          <div class="info-wert">
            <span class="prio {d.prioritaet}">{d.prioritaet}</span>
          </div>
        </div>
      </div>

      <div class="info-karte">
        <span class="info-icon">📋</span>
        <div>
          <div class="info-titel">Status</div>
          <div class="info-wert">
            <span class="status-badge {d.status}">{d.status}</span>
          </div>
        </div>
      </div>

      <div class="info-karte">
        <span class="info-icon">🕐</span>
        <div>
          <div class="info-titel">Geschätzter Aufwand</div>
          <div class="info-wert">{d.aufwand} Stunden</div>
        </div>
      </div>

      {#if d.erstellt}
        <div class="info-karte">
          <span class="info-icon">📝</span>
          <div>
            <div class="info-titel">Erfasst am</div>
            <div class="info-wert">{d.erstellt}</div>
          </div>
        </div>
      {/if}

      {#if data.isAdmin && d.benutzername}
        <div class="info-karte">
          <span class="info-icon">👤</span>
          <div>
            <div class="info-titel">Benutzer</div>
            <div class="info-wert">{d.benutzername}</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .breadcrumb {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .breadcrumb a { color: #e94560; text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }

  .detail-layout {
    max-width: 780px;
  }

  .detail-main {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
  }

  .detail-header {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  h1 {
    margin: 0;
    color: white;
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .modul-label {
    margin: 0.4rem 0 0;
    color: rgba(255,255,255,0.65);
    font-size: 0.9rem;
  }

  .header-aktionen {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    align-items: center;
  }

  .btn-edit {
    padding: 0.5rem 1rem;
    background: #e94560;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .btn-edit:hover { background: #c73652; }

  .btn-back {
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.15);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  .btn-back:hover { background: rgba(255,255,255,0.25); }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0;
  }

  .info-karte {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
  }

  .info-icon { font-size: 1.3rem; margin-top: 0.1rem; }

  .info-titel { font-size: 0.78rem; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
  .info-wert { font-size: 0.95rem; color: #1a1a2e; font-weight: 500; }

  .tage-karte.ok { background: #f0fff4; }
  .tage-karte.warnung { background: #fffbf0; }
  .tage-karte.kritisch { background: #fff8f0; }
  .tage-karte.ueberfaellig { background: #fff0f0; }
  .tage-karte.erledigt { background: #f0fff4; }

  .prio {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }

  .status-badge {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .status-badge.offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge.in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge.erledigt { background: #eafaf1; color: #27ae60; }
</style>
