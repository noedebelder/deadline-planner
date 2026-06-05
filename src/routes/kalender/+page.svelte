<script>
  export let data;

  function monatsSchluessel(deadlineStr) {
    const d = new Date(deadlineStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function monatsLabel(schluessel) {
    const [year, month] = schluessel.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, 1);
    return d.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' });
  }

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }

  function istVergangen(schluessel) {
    const heute = new Date();
    const [year, month] = schluessel.split('-');
    return new Date(parseInt(year), parseInt(month), 0) < heute;
  }

  $: gruppen = (() => {
    const map = {};
    for (const d of data.deadlines) {
      const key = monatsSchluessel(d.deadline);
      if (!map[key]) map[key] = [];
      map[key].push(d);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  })();

  const heute = new Date();
  const aktuellerMonat = `${heute.getFullYear()}-${String(heute.getMonth() + 1).padStart(2, '0')}`;
</script>

<div class="header">
  <h1>📅 Kalenderansicht</h1>
  <p class="subtitle">{data.deadlines.length} Deadline{data.deadlines.length !== 1 ? 's' : ''} insgesamt</p>
</div>

{#if data.deadlines.length === 0}
  <div class="leer">
    <p>📭 Noch keine Deadlines vorhanden.</p>
    <a href="/neu" class="btn-primary">Erste Deadline hinzufügen</a>
  </div>
{:else}
  <div class="monate">
    {#each gruppen as [schluessel, deadlines]}
      <div class="monat-section" class:vergangen={istVergangen(schluessel) && schluessel !== aktuellerMonat} class:aktuell={schluessel === aktuellerMonat}>
        <div class="monat-header">
          <h2>
            {monatsLabel(schluessel)}
            {#if schluessel === aktuellerMonat}
              <span class="aktuell-badge">Aktuell</span>
            {/if}
          </h2>
          <span class="monat-anzahl">{deadlines.length} Deadline{deadlines.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="deadline-grid">
          {#each deadlines as d}
            {@const tage = tageVerbleibend(d.deadline)}
            <a href="/deadline/{d.id}" class="deadline-karte status-{d.status} prio-{d.prioritaet}">
              <div class="karte-top">
                <span class="karte-datum">{new Date(d.deadline).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })}</span>
                <span class="karte-prio prio-{d.prioritaet}">{d.prioritaet}</span>
              </div>
              <div class="karte-titel">{d.titel}</div>
              <div class="karte-modul">{d.modul}</div>
              <div class="karte-footer">
                <span class="karte-status status-badge-{d.status}">{d.status}</span>
                {#if d.status !== 'erledigt'}
                  {#if tage < 0}
                    <span class="tage-badge ueberfaellig">Überfällig</span>
                  {:else if tage === 0}
                    <span class="tage-badge heute">Heute!</span>
                  {:else}
                    <span class="tage-badge" class:kritisch={tage <= 3} class:warnung={tage > 3 && tage <= 7}>{tage}d</span>
                  {/if}
                {/if}
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .header { margin-bottom: 1.5rem; }
  h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; }

  .monate {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .monat-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
  }

  .monat-section.vergangen {
    opacity: 0.65;
  }

  .monat-section.aktuell {
    box-shadow: 0 2px 16px rgba(233, 69, 96, 0.2);
    border: 2px solid #e94560;
  }

  .monat-header {
    background: #1a1a2e;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .monat-section.aktuell .monat-header {
    background: linear-gradient(135deg, #e94560, #c73652);
  }

  h2 {
    margin: 0;
    color: white;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .aktuell-badge {
    background: rgba(255,255,255,0.25);
    color: white;
    font-size: 0.75rem;
    padding: 0.15rem 0.6rem;
    border-radius: 20px;
    font-weight: 500;
  }

  .monat-anzahl {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
  }

  .deadline-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .deadline-karte {
    border: 2px solid #f0f0f0;
    border-radius: 10px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    transition: all 0.2s;
    background: #fafafa;
  }

  .deadline-karte:hover {
    border-color: #e94560;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }

  .deadline-karte.status-erledigt {
    background: #f8fff8;
    border-color: #d4edda;
    opacity: 0.8;
  }

  .karte-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .karte-datum {
    font-size: 0.85rem;
    color: #888;
    font-weight: 600;
  }

  .karte-prio {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    font-weight: 600;
  }
  .karte-prio.prio-hoch { background: #ffeaea; color: #e74c3c; }
  .karte-prio.prio-mittel { background: #fef3e2; color: #f39c12; }
  .karte-prio.prio-niedrig { background: #eafaf1; color: #27ae60; }

  .karte-titel {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 0.95rem;
    line-height: 1.3;
  }

  .karte-modul {
    font-size: 0.82rem;
    color: #888;
  }

  .karte-footer {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    margin-top: 0.25rem;
    flex-wrap: wrap;
  }

  .karte-status {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    font-weight: 600;
  }
  .status-badge-offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge-in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge-erledigt { background: #eafaf1; color: #27ae60; }

  .tage-badge {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    font-weight: 600;
    background: #eafaf1;
    color: #27ae60;
  }
  .tage-badge.kritisch { background: #fef3e2; color: #f39c12; }
  .tage-badge.warnung { background: #fefbe6; color: #d4ac0d; }
  .tage-badge.ueberfaellig { background: #ffeaea; color: #e74c3c; }
  .tage-badge.heute { background: #fef3e2; color: #e67e22; }

  .leer {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 12px;
  }
  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #e94560;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    margin-top: 1rem;
    font-weight: 600;
  }
</style>
