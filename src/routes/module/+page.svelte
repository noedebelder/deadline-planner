<script>
  export let data;

  let offen = {};

  function toggle(modul) {
    offen[modul] = !offen[modul];
  }

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }

  function tageKlasse(tage, status) {
    if (status === "erledigt") return "erledigt";
    if (tage < 0) return "ueberfaellig";
    if (tage <= 3) return "kritisch";
    if (tage <= 7) return "warnung";
    return "ok";
  }
</script>

<div class="header">
  <div>
    <h1>📚 Module</h1>
    <p class="subtitle">{data.module.length} Module — {data.module.reduce((s, m) => s + m.total, 0)} Deadlines gesamt</p>
  </div>
  <a href="/" class="zurueck-link">← Zur Übersicht</a>
</div>

{#if data.module.length === 0}
  <div class="leer">
    <p>📭 Noch keine Deadlines erfasst.</p>
    <a href="/neu" class="btn-primary">Erste Deadline hinzufügen</a>
  </div>
{:else}
  <div class="modul-liste">
    {#each data.module as m}
      <div class="modul-karte">
        <button class="modul-header" on:click={() => toggle(m.modul)} type="button">
          <div class="modul-info">
            <div class="modul-name">{m.modul}</div>
            <div class="modul-meta">
              <span>{m.total} Deadline{m.total !== 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{m.gesamtAufwand}h Gesamtaufwand</span>
              <span>·</span>
              <span class="erledigt-info">{m.erledigt} erledigt</span>
            </div>
          </div>
          <div class="modul-rechts">
            <div class="fortschritt-info">
              <span class="fortschritt-zahl">{m.fortschrittGesamt}%</span>
              <div class="fortschritt-bar-mini">
                <div class="fortschritt-fill-mini"
                  style="width: {m.fortschrittGesamt}%; background: {m.fortschrittGesamt === 100 ? '#27ae60' : m.fortschrittGesamt >= 50 ? '#f39c12' : '#e94560'}"
                ></div>
              </div>
            </div>
            <span class="toggle-icon">{offen[m.modul] ? "▲" : "▼"}</span>
          </div>
        </button>

        {#if offen[m.modul]}
          <div class="deadline-liste">
            {#each m.deadlines as d}
              {@const tage = tageVerbleibend(d.deadline)}
              <a href="/deadline/{d.id}" class="modul-deadline-zeile">
                <div class="dl-titel">
                  <strong>{d.titel}</strong>
                  {#if d.typ}<span class="typ-pill">{d.typ}</span>{/if}
                </div>
                <div class="dl-meta">
                  <span class="dl-datum">{new Date(d.deadline).toLocaleDateString("de-CH", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span class="tage-badge {tageKlasse(tage, d.status)}">
                    {#if d.status === "erledigt"}✅ Erledigt
                    {:else if tage < 0}Überfällig
                    {:else if tage === 0}Heute!
                    {:else}{tage}d
                    {/if}
                  </span>
                  <span class="dl-aufwand">{d.aufwand}h</span>
                  <span class="prio {d.prioritaet}">{d.prioritaet}</span>
                  <div class="dl-bar-wrap">
                    <div class="dl-bar">
                      <div class="dl-fill" style="width: {d.fortschritt}%; background: {d.fortschritt === 100 ? '#27ae60' : '#5c6bc0'}"></div>
                    </div>
                    <span class="dl-pct">{d.fortschritt}%</span>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem;
  }
  h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; }
  .zurueck-link {
    background: white; color: #555; text-decoration: none; padding: 0.5rem 1rem;
    border-radius: 8px; font-size: 0.9rem; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.08); align-self: center;
  }
  .zurueck-link:hover { background: #f0f2f5; }

  .modul-liste { display: flex; flex-direction: column; gap: 1rem; }

  .modul-karte {
    background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;
  }

  .modul-header {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem; gap: 1rem; text-align: left; transition: background 0.15s;
  }
  .modul-header:hover { background: #f8f9ff; }

  .modul-info { flex: 1; }
  .modul-name { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
  .modul-meta {
    display: flex; gap: 0.5rem; align-items: center; font-size: 0.83rem; color: #888; flex-wrap: wrap;
  }
  .erledigt-info { color: #27ae60; font-weight: 600; }

  .modul-rechts { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
  .fortschritt-info { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }
  .fortschritt-zahl { font-size: 1.1rem; font-weight: 800; color: #1a1a2e; }
  .fortschritt-bar-mini {
    width: 120px; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;
  }
  .fortschritt-fill-mini { height: 100%; border-radius: 4px; transition: width 0.3s; }
  .toggle-icon { font-size: 0.85rem; color: #aaa; }

  .deadline-liste { border-top: 1px solid #f0f0f0; }

  .modul-deadline-zeile {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    padding: 0.9rem 1.5rem; border-bottom: 1px solid #f0f0f0; gap: 0.5rem;
    text-decoration: none; color: inherit; transition: background 0.15s;
  }
  .modul-deadline-zeile:last-child { border-bottom: none; }
  .modul-deadline-zeile:hover { background: #f8f9ff; }

  .dl-titel { display: flex; align-items: center; gap: 0.4rem; min-width: 200px; }
  .dl-titel strong { color: #1a1a2e; font-size: 0.9rem; }
  .typ-pill {
    font-size: 0.72rem; background: #eef2ff; color: #5c6bc0;
    padding: 0.1rem 0.4rem; border-radius: 10px;
  }

  .dl-meta {
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; font-size: 0.83rem;
  }
  .dl-datum { color: #888; }
  .dl-aufwand { color: #555; font-weight: 600; }

  .tage-badge {
    padding: 0.15rem 0.55rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;
  }
  .tage-badge.erledigt { background: #eafaf1; color: #27ae60; }
  .tage-badge.ueberfaellig { background: #ffeaea; color: #e74c3c; }
  .tage-badge.kritisch { background: #fef3e2; color: #f39c12; }
  .tage-badge.warnung { background: #fefbe6; color: #d4ac0d; }
  .tage-badge.ok { background: #eafaf1; color: #27ae60; }

  .prio { padding: 0.15rem 0.55rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }

  .dl-bar-wrap { display: flex; align-items: center; gap: 0.4rem; }
  .dl-bar { width: 60px; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
  .dl-fill { height: 100%; border-radius: 3px; }
  .dl-pct { font-size: 0.75rem; color: #888; font-weight: 600; min-width: 28px; }

  .leer { text-align: center; padding: 4rem; background: white; border-radius: 12px; }
  .btn-primary {
    display: inline-block; padding: 0.75rem 1.5rem; background: #e94560; color: white;
    text-decoration: none; border-radius: 8px; margin-top: 1rem; font-weight: 600;
  }
</style>
