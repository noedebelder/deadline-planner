<script>
  export let data;

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
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
  <h1>Meine Deadlines</h1>
  <p class="subtitle">{data.deadlines.length} Aufgabe{data.deadlines.length !== 1 ? 'n' : ''} erfasst</p>
</div>

<div class="stats-row">
  <div class="stat-card rot">
    <span class="stat-zahl">{data.deadlines.filter(d => tageVerbleibend(d.deadline) < 0).length}</span>
    <span class="stat-label">Überfällig</span>
  </div>
  <div class="stat-card orange">
    <span class="stat-zahl">{data.deadlines.filter(d => tageVerbleibend(d.deadline) >= 0 && tageVerbleibend(d.deadline) <= 7).length}</span>
    <span class="stat-label">Diese Woche</span>
  </div>
  <div class="stat-card gruen">
    <span class="stat-zahl">{data.deadlines.filter(d => tageVerbleibend(d.deadline) > 7).length}</span>
    <span class="stat-label">Geplant</span>
  </div>
  <div class="stat-card blau">
    <span class="stat-zahl">{data.deadlines.reduce((sum, d) => sum + d.aufwand, 0)}h</span>
    <span class="stat-label">Total Aufwand</span>
  </div>
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
          <th>Titel</th>
          <th>Modul</th>
          <th>Deadline</th>
          <th>Tage</th>
          <th>Aufwand</th>
          <th>Priorität</th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each data.deadlines as d}
          <tr class={statusKlasse(d.deadline)}>
            <td><strong>{d.titel}</strong></td>
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
            <td><span class="status-badge {d.status || 'offen'}">{d.status || 'Offen'}</span></td>
            <td>
              <div class="aktionen">
                <a href="/bearbeiten/{d.id}" class="btn-edit">✏️</a>
                <form method="POST" action="?/loeschen">
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" class="btn-delete">🗑️</button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .header {
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
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
  .tabelle-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
  }
  .status-badge.offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge.in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge.erledigt { background: #eafaf1; color: #27ae60; }
  .aktionen {
    display: flex;
    gap: 0.4rem;
  }
  .btn-edit {
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    background: #f0f2f5;
    text-decoration: none;
  }
  .btn-edit:hover { background: #dde4ff; }
  .btn-delete {
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    background: #f0f2f5;
  }
  .btn-delete:hover { background: #ffeaea; }
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
  }
</style>