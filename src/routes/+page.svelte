<script>
  export let data;

  let suche = '';
  let sortFeld = 'deadline';
  let sortAsc = true;

  const prioritaetOrder = { hoch: 0, mittel: 1, niedrig: 2 };
  const statusOrder = { 'in-bearbeitung': 0, offen: 1 };

  function sort(feld) {
    if (sortFeld === feld) {
      sortAsc = !sortAsc;
    } else {
      sortFeld = feld;
      sortAsc = true;
    }
  }

  function sortPfeil(feld) {
    if (sortFeld !== feld) return '';
    return sortAsc ? ' ↑' : ' ↓';
  }

  $: gefiltert = data.deadlines.filter((d) => {
    if (!suche) return true;
    const s = suche.toLowerCase();
    return d.titel.toLowerCase().includes(s) || d.modul.toLowerCase().includes(s);
  });

  $: sortiert = [...gefiltert].sort((a, b) => {
    let v = 0;
    if (sortFeld === 'deadline') v = new Date(a.deadline) - new Date(b.deadline);
    else if (sortFeld === 'prioritaet') v = (prioritaetOrder[a.prioritaet] ?? 1) - (prioritaetOrder[b.prioritaet] ?? 1);
    else if (sortFeld === 'status') v = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
    else if (sortFeld === 'titel') v = a.titel.localeCompare(b.titel);
    else if (sortFeld === 'modul') v = a.modul.localeCompare(b.modul);
    return sortAsc ? v : -v;
  });

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    return Math.ceil((deadline - heute) / (1000 * 60 * 60 * 24));
  }

  function statusKlasse(deadlineStr) {
    const tage = tageVerbleibend(deadlineStr);
    if (tage < 0) return 'ueberfaellig';
    if (tage <= 3) return 'kritisch';
    if (tage <= 7) return 'warnung';
    return 'ok';
  }
</script>

<div class="header">
  <div>
    <h1>{data.isAdmin ? 'Alle Deadlines' : 'Meine Deadlines'}</h1>
    <p class="subtitle">{sortiert.length} aktive Aufgabe{sortiert.length !== 1 ? 'n' : ''}</p>
  </div>
  <div class="header-rechts">
    <a href="/api/export" download class="export-btn" title="Aktive Deadlines als CSV herunterladen">⬇️ CSV Export</a>
    <a href="/archiv" class="archiv-link">📦 Archiv</a>
  </div>
</div>

<div class="stats-row">
  <div class="stat-card rot">
    <span class="stat-zahl">{data.deadlines.filter((d) => tageVerbleibend(d.deadline) < 0).length}</span>
    <span class="stat-label">Überfällig</span>
  </div>
  <div class="stat-card orange">
    <span class="stat-zahl">{data.deadlines.filter((d) => tageVerbleibend(d.deadline) >= 0 && tageVerbleibend(d.deadline) <= 7).length}</span>
    <span class="stat-label">Diese Woche</span>
  </div>
  <div class="stat-card gruen">
    <span class="stat-zahl">{data.deadlines.filter((d) => tageVerbleibend(d.deadline) > 7).length}</span>
    <span class="stat-label">Geplant</span>
  </div>
  <div class="stat-card blau">
    <span class="stat-zahl">{data.deadlines.reduce((sum, d) => sum + d.aufwand, 0)}h</span>
    <span class="stat-label">Total Aufwand</span>
  </div>
</div>

<div class="toolbar">
  <div class="suche-wrap">
    <span class="suche-icon">🔍</span>
    <input
      type="text"
      placeholder="Nach Titel oder Modul suchen..."
      bind:value={suche}
      class="suche-input"
    />
    {#if suche}
      <button class="suche-clear" on:click={() => (suche = '')} type="button">✕</button>
    {/if}
  </div>
  {#if suche && sortiert.length === 0}
    <span class="keine-treffer">Keine Treffer für „{suche}"</span>
  {/if}
</div>

{#if data.deadlines.length === 0}
  <div class="leer">
    <p>📭 Noch keine Deadlines erfasst.</p>
    <a href="/neu" class="btn-primary">Erste Deadline hinzufügen</a>
  </div>
{:else}
  <div class="tabelle-container">
    <table>
      <thead>
        <tr>
          <th class="sortierbar" on:click={() => sort('titel')}>Titel{sortPfeil('titel')}</th>
          <th class="sortierbar" on:click={() => sort('modul')}>Modul{sortPfeil('modul')}</th>
          <th class="sortierbar" on:click={() => sort('deadline')}>Deadline{sortPfeil('deadline')}</th>
          <th>Tage</th>
          <th>Aufwand</th>
          <th class="sortierbar" on:click={() => sort('prioritaet')}>Priorität{sortPfeil('prioritaet')}</th>
          <th class="sortierbar" on:click={() => sort('status')}>Status{sortPfeil('status')}</th>
          {#if data.isAdmin}<th>Benutzer</th>{/if}
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each sortiert as d}
          <tr class={statusKlasse(d.deadline)}>
            <td>
              <a href="/deadline/{d.id}" class="titel-link"><strong>{d.titel}</strong></a>
            </td>
            <td>{d.modul}</td>
            <td>{new Date(d.deadline).toLocaleDateString('de-CH')}</td>
            <td>
              {#if tageVerbleibend(d.deadline) < 0}
                <span class="badge rot">Überfällig</span>
              {:else if tageVerbleibend(d.deadline) === 0}
                <span class="badge orange">Heute!</span>
              {:else}
                <span class="badge {statusKlasse(d.deadline)}">{tageVerbleibend(d.deadline)}d</span>
              {/if}
            </td>
            <td>{d.aufwand}h</td>
            <td><span class="prio {d.prioritaet}">{d.prioritaet}</span></td>
            <td><span class="status-badge {d.status}">{d.status}</span></td>
            {#if data.isAdmin}
              <td><span class="user-badge">{d.benutzername || '—'}</span></td>
            {/if}
            <td>
              <div class="aktionen">
                <a href="/deadline/{d.id}" class="btn-icon" title="Details">👁️</a>
                <a href="/bearbeiten/{d.id}" class="btn-icon" title="Bearbeiten">✏️</a>
                <form method="POST" action="?/loeschen">
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" class="btn-icon btn-delete" title="Löschen">🗑️</button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
        {#if sortiert.length === 0 && suche}
          <tr>
            <td colspan={data.isAdmin ? 9 : 8} class="keine-zeile">Keine Deadlines für „{suche}" gefunden.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #1a1a2e;
  }
  .subtitle {
    color: #666;
    margin: 0.25rem 0 0;
  }
  .header-rechts {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    align-self: center;
  }
  .archiv-link,
  .export-btn {
    background: white;
    color: #555;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    white-space: nowrap;
  }
  .archiv-link:hover,
  .export-btn:hover {
    background: #f0f2f5;
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
    border-top: 4px solid transparent;
  }
  .stat-card.rot { border-color: #e74c3c; }
  .stat-card.orange { border-color: #f39c12; }
  .stat-card.gruen { border-color: #27ae60; }
  .stat-card.blau { border-color: #3498db; }
  .stat-zahl {
    font-size: 2rem;
    font-weight: 700;
  }
  .stat-label {
    color: #666;
    font-size: 0.85rem;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .suche-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 420px;
  }
  .suche-icon {
    position: absolute;
    left: 0.8rem;
    font-size: 1rem;
    pointer-events: none;
  }
  .suche-input {
    width: 100%;
    padding: 0.65rem 2.5rem 0.65rem 2.4rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    background: white;
    transition: border-color 0.2s;
  }
  .suche-input:focus {
    outline: none;
    border-color: #e94560;
  }
  .suche-clear {
    position: absolute;
    right: 0.6rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #aaa;
    font-size: 0.9rem;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  .suche-clear:hover { color: #666; }
  .keine-treffer {
    color: #888;
    font-size: 0.9rem;
  }
  .tabelle-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    background: #1a1a2e;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
  }
  th.sortierbar {
    cursor: pointer;
    user-select: none;
  }
  th.sortierbar:hover {
    background: #2a2a4e;
  }
  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover {
    background: #f8f9ff;
  }
  .titel-link {
    color: #1a1a2e;
    text-decoration: none;
  }
  .titel-link:hover {
    color: #e94560;
    text-decoration: underline;
  }
  .badge {
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .badge.rot { background: #ffeaea; color: #e74c3c; }
  .badge.orange { background: #fef3e2; color: #f39c12; }
  .badge.kritisch { background: #fef3e2; color: #f39c12; }
  .badge.warnung { background: #fefbe6; color: #d4ac0d; }
  .badge.ok { background: #eafaf1; color: #27ae60; }
  .prio {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }
  .status-badge {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .status-badge.offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge.in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge.erledigt { background: #eafaf1; color: #27ae60; }
  .user-badge {
    font-size: 0.85rem;
    color: #666;
    background: #f0f2f5;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
  }
  .aktionen {
    display: flex;
    gap: 0.3rem;
  }
  .btn-icon {
    padding: 0.3rem 0.55rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    font-size: 0.95rem;
    background: #f0f2f5;
    text-decoration: none;
    display: inline-block;
    line-height: 1;
  }
  .btn-icon:hover { background: #dde4ff; }
  .btn-delete:hover { background: #ffeaea !important; }
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
  .keine-zeile {
    text-align: center;
    color: #888;
    padding: 2rem !important;
  }
</style>
