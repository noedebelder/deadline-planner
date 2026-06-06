<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let data;

  let suche = '';

  $: gefiltert = data.deadlines.filter((d) => {
    if (!suche) return true;
    const s = suche.toLowerCase();
    return d.titel.toLowerCase().includes(s) || d.modul.toLowerCase().includes(s);
  });
</script>

<div class="header">
  <div>
    <h1>📦 Archiv</h1>
    <p class="subtitle">{data.deadlines.length} erledigte Aufgabe{data.deadlines.length !== 1 ? 'n' : ''}</p>
  </div>
  <a href="/" class="zurueck-link">← Aktive Deadlines</a>
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
</div>

{#if data.deadlines.length === 0}
  <div class="leer">
    <p>📭 Noch keine erledigten Deadlines im Archiv.</p>
    <p class="leer-hint">Deadlines werden hier angezeigt, sobald ihr Status auf „Erledigt" gesetzt wird.</p>
    <a href="/" class="btn-primary">Zur Übersicht</a>
  </div>
{:else}
  <div class="tabelle-container">
    <table>
      <thead>
        <tr>
          <th>Titel</th>
          <th>Modul</th>
          <th>Deadline</th>
          <th>Aufwand</th>
          <th>Priorität</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each gefiltert as d}
          <tr>
            <td>
              <a href="/deadline/{d.id}" class="titel-link"><strong>{d.titel}</strong></a>
            </td>
            <td>{d.modul}</td>
            <td>{new Date(d.deadline).toLocaleDateString('de-CH')}</td>
            <td>{d.aufwand}h</td>
            <td><span class="prio {d.prioritaet}">{d.prioritaet}</span></td>
            <td>
              <div class="aktionen">
                <a href="/bearbeiten/{d.id}" class="btn-icon" title="Bearbeiten">✏️</a>
                <form
                  method="POST"
                  action="?/loeschen"
                  use:enhance={({ cancel }) => {
                    if (!confirm("Deadline wirklich löschen?")) { cancel(); return; }
                    return async ({ update }) => {
                      addToast("Deadline gelöscht");
                      await update();
                    };
                  }}
                >
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" class="btn-icon btn-delete" title="Löschen">🗑️</button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
        {#if gefiltert.length === 0 && suche}
          <tr>
            <td colspan="6" class="keine-zeile">Keine Treffer für „{suche}".</td>
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
  h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; }
  .zurueck-link {
    background: white;
    color: #555;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    align-self: center;
  }
  .zurueck-link:hover { background: #f0f2f5; }
  .toolbar {
    margin-bottom: 1rem;
  }
  .suche-wrap {
    position: relative;
    display: flex;
    align-items: center;
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
  .suche-input:focus { outline: none; border-color: #e94560; }
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
  .tabelle-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  table { width: 100%; border-collapse: collapse; }
  th {
    background: #27ae60;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover { background: #f8fff8; }
  .titel-link { color: #1a1a2e; text-decoration: none; }
  .titel-link:hover { color: #27ae60; text-decoration: underline; }
  .prio {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }
  .user-badge {
    font-size: 0.85rem;
    color: #666;
    background: #f0f2f5;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
  }
  .aktionen { display: flex; gap: 0.3rem; }
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
  .leer-hint { color: #999; font-size: 0.9rem; margin-top: 0.5rem; }
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
  .keine-zeile { text-align: center; color: #888; padding: 2rem !important; }
</style>
