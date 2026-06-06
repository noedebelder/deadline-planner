<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let data;

  let suche = "";
  let sortFeld = "deadline";
  let sortAsc = true;
  let fortschrittEdit = null;
  let subtaskDropdown = null; // ID der Deadline mit geöffnetem Subtask-Dropdown

  const prioritaetOrder = { hoch: 0, mittel: 1, niedrig: 2 };
  const statusOrder = { "in-bearbeitung": 0, offen: 1, erledigt: 2 };

  function sort(feld) {
    if (sortFeld === feld) sortAsc = !sortAsc;
    else { sortFeld = feld; sortAsc = true; }
  }
  function sortPfeil(feld) {
    if (sortFeld !== feld) return "";
    return sortAsc ? " ↑" : " ↓";
  }

  $: gefiltert = (data.deadlines ?? []).filter((d) => {
    if (!suche) return true;
    const s = suche.toLowerCase();
    return d.titel.toLowerCase().includes(s) || d.modul.toLowerCase().includes(s);
  });

  $: sortiert = [...gefiltert].sort((a, b) => {
    let v = 0;
    if (sortFeld === "deadline") v = new Date(a.deadline) - new Date(b.deadline);
    else if (sortFeld === "prioritaet") v = (prioritaetOrder[a.prioritaet] ?? 1) - (prioritaetOrder[b.prioritaet] ?? 1);
    else if (sortFeld === "status") v = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
    else if (sortFeld === "titel") v = a.titel.localeCompare(b.titel);
    else if (sortFeld === "modul") v = a.modul.localeCompare(b.modul);
    return sortAsc ? v : -v;
  });

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }
  function statusKlasse(deadlineStr) {
    const tage = tageVerbleibend(deadlineStr);
    if (tage < 0) return "ueberfaellig";
    if (tage <= 3) return "kritisch";
    if (tage <= 7) return "warnung";
    return "ok";
  }

  $: aktiveDeadlines = (data.deadlines ?? []).filter(d => d.status !== "erledigt");

  $: warnungen = (() => {
    const result = [];
    const ueberfaellig = aktiveDeadlines.filter(d => tageVerbleibend(d.deadline) < 0);
    const dieseWoche = aktiveDeadlines.filter(d => {
      const t = tageVerbleibend(d.deadline);
      return t >= 0 && t <= 7;
    });
    if (ueberfaellig.length > 0) {
      const names = ueberfaellig.slice(0, 2).map(d => d.titel).join(", ");
      const mehr = ueberfaellig.length > 2 ? ` +${ueberfaellig.length - 2} weitere` : "";
      result.push({ typ: "gefahr", text: `🔥 Überfällig: ${names}${mehr}` });
    }
    if (dieseWoche.length > 0) {
      const restAufwand = dieseWoche
        .reduce((s, d) => s + d.aufwand * (1 - (d.fortschritt ?? 0) / 100), 0)
        .toFixed(1);
      result.push({ typ: "warnung", text: `⚡ ${dieseWoche.length} Deadline${dieseWoche.length > 1 ? "s" : ""} diese Woche — noch ${restAufwand}h Restaufwand` });
    }
    return result;
  })();

  let fortschrittWerte = {};
  $: {
    (data.deadlines ?? []).forEach(d => {
      if (!(d.id in fortschrittWerte)) {
        fortschrittWerte[d.id] = d.fortschritt ?? 0;
      }
    });
  }
</script>

<!-- ═══ LANDING PAGE ═══ -->
{#if data.isLanding}
<div class="landing">
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <div class="hero-badge">✨ Studiums-Planer</div>
        <h1 class="hero-titel">
          Deine Deadlines.<br />
          <span class="accent">Immer im Blick.</span>
        </h1>
        <p class="hero-sub">
          Organisiere alle Abgaben und Prüfungen. Plane deinen Tag intelligent.
          Nie wieder einen wichtigen Termin verpassen.
        </p>
        <div class="hero-ctas">
          <a href="/login" class="cta-primary">Jetzt kostenlos starten →</a>
          <a href="/login" class="cta-secondary">Anmelden</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><span class="hs-zahl">📅</span><span>Kalender</span></div>
          <div class="hero-stat"><span class="hs-zahl">📊</span><span>Statistiken</span></div>
          <div class="hero-stat"><span class="hs-zahl">🔔</span><span>Warnungen</span></div>
        </div>
      </div>
      <div class="hero-preview">
        <div class="mock-window">
          <div class="mock-bar"><span></span><span></span><span></span></div>
          <div class="mock-content">
            <div class="mock-row header-row">
              <span>Titel</span><span>Modul</span><span>Tage</span><span>Prio</span>
            </div>
            <div class="mock-row urgent">
              <span>Projektarbeit</span><span>Prototyping</span>
              <span class="mock-badge red">2d</span>
              <span class="mock-badge-prio high">hoch</span>
            </div>
            <div class="mock-row warn">
              <span>Portfolio</span><span>UX Design</span>
              <span class="mock-badge orange">5d</span>
              <span class="mock-badge-prio mid">mittel</span>
            </div>
            <div class="mock-row ok">
              <span>Seminararbeit</span><span>Ethik</span>
              <span class="mock-badge green">14d</span>
              <span class="mock-badge-prio low">niedrig</span>
            </div>
            <div class="mock-row done">
              <span>Reflexion</span><span>Praxis</span>
              <span class="mock-badge done-b">✓</span>
              <span class="mock-badge-prio low">niedrig</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="features-inner">
      <h2>Alles was du brauchst</h2>
      <p class="features-sub">Ein Tool für alle Deadlines deines Studiums — schön, schnell, smart.</p>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Smarte Übersicht</h3>
          <p>Alle Deadlines sortierbar nach Datum, Priorität oder Status. Mit Echtzeit-Suche und Fortschritts-Tracking.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📆</div>
          <h3>Tagesplanung</h3>
          <p>Intelligente Stundenberechnung — sieh genau wieviel du täglich arbeiten musst, um pünktlich fertig zu sein.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Modul-Ansicht</h3>
          <p>Alle Deadlines nach Modul gruppiert mit Gesamtaufwand, Fortschritt und Status auf einen Blick.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>iCal Export</h3>
          <p>Exportiere deine Deadlines als iCal oder CSV — kompatibel mit Google Calendar, Outlook und Co.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="cta-glow"></div>
    <h2>Bereit? Starte jetzt kostenlos.</h2>
    <p>Keine Kreditkarte. Keine Hürden. Einfach loslegen.</p>
    <div class="hero-ctas">
      <a href="/login" class="cta-primary cta-gross">Konto erstellen →</a>
    </div>
  </section>
</div>

<!-- ═══ ÜBERSICHT ═══ -->
{:else}
<div class="header">
  <div>
    <h1>Meine Deadlines</h1>
    <p class="subtitle">{sortiert.filter(d => d.status !== 'erledigt').length} aktive Aufgabe{sortiert.filter(d => d.status !== 'erledigt').length !== 1 ? "n" : ""}</p>
  </div>
  <div class="header-rechts">
    <a href="/api/export/ical" download class="export-btn" title="iCal herunterladen">📅 iCal</a>
    <a href="/api/export" download class="export-btn" title="CSV herunterladen">⬇️ CSV</a>
  </div>
</div>

{#if warnungen.length > 0}
  <div class="warnungen-container">
    {#each warnungen as w}
      <div class="warnung-banner {w.typ}">{w.text}</div>
    {/each}
  </div>
{/if}

<div class="stats-row">
  <div class="stat-card rot">
    <span class="stat-icon">🔥</span>
    <span class="stat-zahl">{aktiveDeadlines.filter(d => tageVerbleibend(d.deadline) < 0).length}</span>
    <span class="stat-label">Überfällig</span>
  </div>
  <div class="stat-card orange">
    <span class="stat-icon">⚡</span>
    <span class="stat-zahl">{aktiveDeadlines.filter(d => tageVerbleibend(d.deadline) >= 0 && tageVerbleibend(d.deadline) <= 7).length}</span>
    <span class="stat-label">Diese Woche</span>
  </div>
  <div class="stat-card gruen">
    <span class="stat-icon">📅</span>
    <span class="stat-zahl">{aktiveDeadlines.filter(d => tageVerbleibend(d.deadline) > 7).length}</span>
    <span class="stat-label">Geplant</span>
  </div>
  <div class="stat-card blau">
    <span class="stat-icon">⏱️</span>
    <span class="stat-zahl">{aktiveDeadlines.reduce((sum, d) => sum + d.aufwand, 0)}h</span>
    <span class="stat-label">Total Aufwand</span>
  </div>
</div>

<div class="toolbar">
  <div class="suche-wrap">
    <span class="suche-icon">🔍</span>
    <input type="text" placeholder="Nach Titel oder Modul suchen..." bind:value={suche} class="suche-input" />
    {#if suche}
      <button class="suche-clear" on:click={() => (suche = "")} type="button">✕</button>
    {/if}
  </div>
</div>

{#if (data.deadlines ?? []).length === 0}
  <div class="leer">
    <div class="leer-emoji">🚀</div>
    <h2 class="leer-titel">Noch keine Deadlines!</h2>
    <p class="leer-text">Leg jetzt los und behalte alle Abgaben im Blick.<br />Dein zukünftiges Ich wird es dir danken.</p>
    <a href="/neu" class="btn-primary leer-btn">+ Erste Deadline erfassen</a>
    <div class="leer-tipps">
      <span>💡 Tipp: Nutze die Tagesplanung für smarte Stundenplanung</span>
    </div>
  </div>
{:else}
  <div class="tabelle-container">
    <table>
      <thead>
        <tr>
          <th class="sortierbar" on:click={() => sort("titel")}>Titel{sortPfeil("titel")}</th>
          <th class="sortierbar" on:click={() => sort("modul")}>Modul{sortPfeil("modul")}</th>
          <th class="sortierbar" on:click={() => sort("deadline")}>Deadline{sortPfeil("deadline")}</th>
          <th>Tage</th>
          <th>Aufwand</th>
          <th class="sortierbar" on:click={() => sort("prioritaet")}>Priorität{sortPfeil("prioritaet")}</th>
          <th class="sortierbar" on:click={() => sort("status")}>Status{sortPfeil("status")}</th>
          <th>Fortschritt</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each sortiert as d}
          <tr class="{d.status === 'erledigt' ? 'zeile-erledigt' : statusKlasse(d.deadline)}">
            <td data-label="Titel">
              {#if d.status === 'erledigt'}<span class="erledigt-haken">✅</span>{/if}
              <a href="/deadline/{d.id}" class="titel-link" class:durchgestrichen={d.status === 'erledigt'}>
                <strong>{d.titel}</strong>
              </a>
              {#if d.typ && d.typ !== "Sonstiges"}
                <span class="typ-pill">{d.typ}</span>
              {/if}
              {#if d.subtaskCount > 0}
                <span class="subtask-pill {d.subtaskErledigt === d.subtaskCount ? 'subtask-done' : ''}">
                  ✓ {d.subtaskErledigt}/{d.subtaskCount}
                </span>
              {/if}
              <!-- Subtask-Dropdown -->
              {#if d.subtasks && d.subtasks.filter(s => !s.erledigt).length > 0}
                <div class="subtask-bereich">
                  <button
                    type="button"
                    class="subtask-dropdown-btn"
                    on:click|stopPropagation={() => subtaskDropdown = subtaskDropdown === d.id ? null : d.id}
                  >
                    Subtask erledigen ▾
                  </button>
                  {#if subtaskDropdown === d.id}
                    <div class="subtask-dropdown">
                      {#each d.subtasks.filter(s => !s.erledigt) as st}
                        <form method="POST" action="?/subtaskErledigen"
                          use:enhance={() => {
                            return async ({ result, update }) => {
                              if (result.type === 'success') {
                                addToast("Subtask erledigt ✓");
                                subtaskDropdown = null;
                                await update({ reset: false });
                              }
                            };
                          }}
                        >
                          <input type="hidden" name="deadlineId" value={d.id} />
                          <input type="hidden" name="subtaskId" value={st.id} />
                          <button type="submit" class="subtask-zeile">
                            <span class="subtask-info">
                              <span class="subtask-name">{st.titel}</span>
                              {#if st.aufwand}<span class="subtask-aufwand">{st.aufwand}h</span>{/if}
                            </span>
                            <span class="subtask-check">✓</span>
                          </button>
                        </form>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}
            </td>
            <td data-label="Modul">{d.modul}</td>
            <td data-label="Deadline">{new Date(d.deadline).toLocaleDateString("de-CH")}</td>
            <td data-label="Tage">
              {#if d.status === 'erledigt'}
                <span class="badge ok">✅ Erledigt</span>
              {:else if tageVerbleibend(d.deadline) < 0}
                <span class="badge rot">
                  <span class="pulse-dot"></span> Überfällig
                </span>
              {:else if tageVerbleibend(d.deadline) === 0}
                <span class="badge orange">Heute!</span>
              {:else}
                <span class="badge {statusKlasse(d.deadline)}">{tageVerbleibend(d.deadline)}d</span>
              {/if}
            </td>
            <td data-label="Aufwand">
              {#if d.subtaskCount > 0}
                <span title="{d.aufwand}h total">{d.aufwandVerbleibend}h</span>
              {:else}
                {d.aufwand}h
              {/if}
            </td>
            <td data-label="Priorität"><span class="prio {d.prioritaet}">{d.prioritaet}</span></td>
            <td data-label="Status">
              {#if d.status === 'erledigt'}
                <span class="status-badge erledigt">✅ Erledigt</span>
              {:else}
                <span class="status-badge {d.status}">{d.status}</span>
              {/if}
            </td>
            <td data-label="Fortschritt" class="fortschritt-zelle">
              {#if d.status !== 'erledigt'}
                {#if fortschrittEdit === d.id}
                  <form method="POST" action="?/fortschritt"
                    use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.type === "success") {
                          addToast("Fortschritt aktualisiert ✓");
                          fortschrittEdit = null;
                          await update({ reset: false });
                        }
                      };
                    }}
                  >
                    <input type="hidden" name="id" value={d.id} />
                    <div class="fortschritt-popup">
                      <input type="range" name="fortschritt" min="0" max="100" step="5"
                        bind:value={fortschrittWerte[d.id]} class="range-mini" />
                      <span class="pct-label">{fortschrittWerte[d.id]}%</span>
                      <button type="submit" class="btn-save">✓</button>
                      <button type="button" class="btn-cancel" on:click={() => { fortschrittEdit = null; fortschrittWerte[d.id] = d.fortschritt; }}>✕</button>
                    </div>
                  </form>
                {:else}
                  <button class="fortschritt-btn" on:click={() => { fortschrittWerte[d.id] = d.fortschritt; fortschrittEdit = d.id; }} title="Klicken zum Bearbeiten">
                    <div class="mini-bar-bg">
                      <div class="mini-bar-fill" style="width: {d.fortschritt}%; background: {d.fortschritt === 100 ? '#27ae60' : d.fortschritt >= 50 ? '#f39c12' : '#e94560'}"></div>
                    </div>
                    <span class="pct-text">{d.fortschritt}%</span>
                  </button>
                {/if}
              {:else}
                <div class="mini-bar-bg"><div class="mini-bar-fill" style="width: 100%; background: #27ae60;"></div></div>
              {/if}
            </td>
            <td data-label="Aktionen">
              <div class="aktionen">
                <a href="/deadline/{d.id}" class="btn-icon" title="Details">👁️</a>
                <a href="/bearbeiten/{d.id}" class="btn-icon" title="Bearbeiten">✏️</a>
                <!-- Status Toggle -->
                <form method="POST" action="?/statusToggle"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      if (result.type === "success") {
                        addToast(d.status === 'erledigt' ? "Wieder geöffnet" : "Als erledigt markiert ✅");
                        await update({ reset: false });
                      }
                    };
                  }}
                >
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="status" value={d.status} />
                  <button
                    type="submit"
                    class="btn-icon"
                    title={d.status === 'erledigt' ? 'Wieder öffnen' : 'Als erledigt markieren'}
                  >{d.status === 'erledigt' ? '↩️' : '✅'}</button>
                </form>
                <form method="POST" action="?/loeschen"
                  use:enhance={({ cancel }) => {
                    if (!confirm("Deadline wirklich löschen?")) { cancel(); return; }
                    return async ({ update }) => { addToast("Deadline gelöscht"); await update(); };
                  }}
                >
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" class="btn-icon btn-delete" title="Löschen">🗑️</button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
        {#if sortiert.length === 0 && suche}
          <tr>
            <td colspan="9" class="keine-zeile">Keine Deadlines für „{suche}" gefunden.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
{/if}
{/if}

<style>
  /* ════════════════ LANDING ════════════════ */
  .landing { margin: -2rem -1.5rem 0; }

  .hero {
    background: linear-gradient(135deg, #080c18 0%, #0f1525 40%, #141a30 100%);
    padding: 5rem 2rem 5rem;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: "";
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 75% 50%, rgba(233,69,96,0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 20% 80%, rgba(92,107,192,0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  .hero-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
    position: relative; z-index: 1;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(233,69,96,0.12); color: #e94560;
    border: 1px solid rgba(233,69,96,0.25);
    padding: 0.35rem 0.9rem; border-radius: 20px;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 1.25rem;
    animation: fadeInUp 0.6s ease-out both;
  }

  .hero-titel {
    font-size: 3.2rem; font-weight: 800; color: #e6edf3;
    line-height: 1.1; margin: 0 0 1.25rem;
    letter-spacing: -0.03em;
    animation: fadeInUp 0.6s 0.1s ease-out both;
  }
  .accent {
    background: linear-gradient(90deg, #e94560 0%, #ff8fa3 45%, #e94560 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 0%   center; }
    100% { background-position: 200% center; }
  }

  .hero-sub {
    color: rgba(230,237,243,0.6); font-size: 1.05rem; line-height: 1.65;
    margin: 0 0 2rem; max-width: 440px;
    animation: fadeInUp 0.6s 0.2s ease-out both;
  }

  .hero-ctas {
    display: flex; gap: 1rem; flex-wrap: wrap;
    animation: fadeInUp 0.6s 0.3s ease-out both;
  }

  .cta-primary {
    background: linear-gradient(135deg, #e94560, #c73652);
    color: white; text-decoration: none;
    padding: 0.9rem 1.75rem; border-radius: 10px;
    font-weight: 700; font-size: 1rem;
    box-shadow: 0 4px 20px rgba(233,69,96,0.4);
    transition: all 0.2s ease;
    display: inline-block;
  }
  .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(233,69,96,0.5); }
  .cta-primary.cta-gross { padding: 1rem 2.5rem; font-size: 1.1rem; }

  .cta-secondary {
    background: rgba(255,255,255,0.07); color: rgba(230,237,243,0.85);
    text-decoration: none; padding: 0.9rem 1.75rem; border-radius: 10px;
    font-weight: 600; font-size: 1rem;
    border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s;
    display: inline-block;
  }
  .cta-secondary:hover { background: rgba(255,255,255,0.12); color: white; }

  .hero-stats {
    display: flex; gap: 0.6rem; margin-top: 2rem; flex-wrap: wrap;
    animation: fadeInUp 0.6s 0.4s ease-out both;
  }
  .hero-stat {
    display: flex; align-items: center; gap: 0.45rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.4rem 0.9rem; border-radius: 20px;
    color: rgba(255,255,255,0.7); font-size: 0.82rem; font-weight: 500;
    transition: all 0.2s;
  }
  .hero-stat:hover { background: rgba(255,255,255,0.1); color: white; }
  .hs-zahl { font-size: 1rem; }

  .hero-preview { display: flex; justify-content: center; animation: fadeInUp 0.6s 0.2s ease-out both; }

  .mock-window {
    background: rgba(10,14,24,0.95);
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.1);
    overflow: hidden; width: 100%; max-width: 420px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
  }
  .mock-bar { background: rgba(5,8,16,0.9); padding: 0.65rem 0.9rem; display: flex; gap: 0.45rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .mock-bar span { width: 11px; height: 11px; border-radius: 50%; }
  .mock-bar span:nth-child(1) { background: #ff5f57; }
  .mock-bar span:nth-child(2) { background: #febc2e; }
  .mock-bar span:nth-child(3) { background: #28c840; }
  .mock-content { padding: 0.75rem; }
  .mock-row {
    display: grid; grid-template-columns: 2fr 1.5fr 0.7fr 0.7fr; gap: 0.5rem;
    padding: 0.55rem 0.5rem; border-radius: 7px; font-size: 0.78rem;
    align-items: center; color: #8b949e; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .mock-row:last-child { border-bottom: none; }
  .mock-row.header-row { font-weight: 700; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #4d5566; }
  .mock-row.urgent { color: #f87171; background: rgba(248,113,113,0.06); }
  .mock-row.warn { color: #fbbf24; background: rgba(251,191,36,0.06); }
  .mock-row.ok { color: #c9d1d9; }
  .mock-row.done { color: #4d5566; text-decoration: line-through; }
  .mock-badge { display: inline-block; padding: 0.1rem 0.4rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }
  .mock-badge.red { background: rgba(61,18,18,0.8); color: #f87171; }
  .mock-badge.orange { background: rgba(61,42,18,0.8); color: #fbbf24; }
  .mock-badge.green { background: rgba(18,61,26,0.8); color: #4ade80; }
  .mock-badge.done-b { background: rgba(18,58,30,0.8); color: #4ade80; }
  .mock-badge-prio { font-size: 0.68rem; font-weight: 600; color: #4d5566; }
  .mock-badge-prio.high { color: #f87171; }
  .mock-badge-prio.mid { color: #fbbf24; }
  .mock-badge-prio.low { color: #4ade80; }

  .features { background: #f0f2f5; padding: 5rem 2rem; }
  :global([data-theme="dark"]) .features { background: rgba(9,12,20,0.8); }
  .features-inner { max-width: 1100px; margin: 0 auto; text-align: center; }
  .features h2 { font-size: 2.2rem; color: #1a1a2e; margin: 0 0 0.5rem; letter-spacing: -0.03em; }
  :global([data-theme="dark"]) .features h2 { color: #e6edf3; }
  .features-sub { color: #666; margin: 0 0 3rem; font-size: 1rem; }
  :global([data-theme="dark"]) .features-sub { color: #8b949e; }
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; }
  .feature-card {
    background: white; border-radius: 16px; padding: 1.75rem 1.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07); text-align: left;
    border: 1px solid rgba(0,0,0,0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  :global([data-theme="dark"]) .feature-card { background: rgba(22,27,34,0.85); border-color: rgba(255,255,255,0.08); }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
  .feature-card:nth-child(1) .feature-icon { background: linear-gradient(135deg, rgba(233,69,96,0.12), rgba(199,54,82,0.08)); border-color: rgba(233,69,96,0.18); }
  .feature-card:nth-child(2) .feature-icon { background: linear-gradient(135deg, rgba(52,152,219,0.12), rgba(92,107,192,0.1));  border-color: rgba(52,152,219,0.18); }
  .feature-card:nth-child(3) .feature-icon { background: linear-gradient(135deg, rgba(39,174,96,0.12),  rgba(52,152,219,0.08));  border-color: rgba(39,174,96,0.18); }
  .feature-card:nth-child(4) .feature-icon { background: linear-gradient(135deg, rgba(92,107,192,0.14), rgba(233,69,96,0.08));  border-color: rgba(92,107,192,0.18); }
  .feature-icon {
    font-size: 2rem; margin-bottom: 1rem;
    width: 56px; height: 56px;
    background: linear-gradient(135deg, rgba(233,69,96,0.1), rgba(92,107,192,0.12));
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(233,69,96,0.12);
    transition: transform 0.2s ease;
  }
  .feature-card:hover .feature-icon { transform: scale(1.08); }
  .feature-card h3 { margin: 0 0 0.5rem; color: #1a1a2e; font-size: 1.05rem; }
  :global([data-theme="dark"]) .feature-card h3 { color: #e6edf3; }
  .feature-card p { color: #666; font-size: 0.9rem; line-height: 1.55; margin: 0; }
  :global([data-theme="dark"]) .feature-card p { color: #8b949e; }

  .cta-section {
    background: linear-gradient(135deg, #080c18 0%, #1a1a2e 100%);
    padding: 5rem 2rem; text-align: center; position: relative; overflow: hidden;
  }
  .cta-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(233,69,96,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-section h2 { color: white; font-size: 2rem; margin: 0 0 0.75rem; letter-spacing: -0.02em; position: relative; }
  .cta-section p { color: rgba(255,255,255,0.5); margin: 0 0 2rem; position: relative; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .hero-preview { display: none; }
    .hero-titel { font-size: 2.5rem; }
    .hero { padding: 3.5rem 1.5rem; }
  }

  /* ════════════════ ÜBERSICHT ════════════════ */
  .header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;
  }
  h1 { color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
  .header-rechts { display: flex; gap: 0.5rem; align-items: center; align-self: center; }
  .export-btn {
    background: white; color: #555; text-decoration: none;
    padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.88rem; font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); white-space: nowrap;
    border: 1px solid rgba(0,0,0,0.06); transition: all 0.15s;
  }
  .export-btn:hover { background: #f0f2f5; transform: translateY(-1px); }

  .warnungen-container { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .warnung-banner {
    padding: 0.75rem 1rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
    border-left: 4px solid transparent; border: 1px solid transparent;
    animation: slideIn 0.3s ease-out both;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-6px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .warnung-banner.gefahr { background: #ffeaea; color: #c0392b; border-color: rgba(231,76,60,0.3); border-left-color: #e74c3c; }
  .warnung-banner.warnung { background: #fef3e2; color: #a04000; border-color: rgba(243,156,18,0.3); border-left-color: #f39c12; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .stat-card {
    background: white; border-radius: 14px; padding: 1.2rem 1rem;
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.05);
    border-top: 3px solid transparent;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .stat-card:hover { transform: translateY(-3px); }
  .stat-card.rot   { border-top-color: #e74c3c; }
  .stat-card.rot:hover   { box-shadow: 0 8px 24px rgba(231,76,60,0.18); }
  .stat-card.orange{ border-top-color: #f39c12; }
  .stat-card.orange:hover{ box-shadow: 0 8px 24px rgba(243,156,18,0.18); }
  .stat-card.gruen { border-top-color: #27ae60; }
  .stat-card.gruen:hover { box-shadow: 0 8px 24px rgba(39,174,96,0.18); }
  .stat-card.blau  { border-top-color: #3498db; }
  .stat-card.blau:hover  { box-shadow: 0 8px 24px rgba(52,152,219,0.18); }
  .stat-icon { font-size: 1.3rem; margin-bottom: 0.25rem; }
  .stat-zahl { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
  .stat-label { color: #666; font-size: 0.8rem; font-weight: 500; }

  .toolbar { margin-bottom: 1rem; }
  .suche-wrap { position: relative; display: flex; align-items: center; max-width: 480px; }
  .suche-icon { position: absolute; left: 0.85rem; font-size: 1rem; pointer-events: none; }
  .suche-input {
    width: 100%; padding: 0.7rem 2.5rem 0.7rem 2.5rem;
    border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 0.95rem;
    background: white; transition: all 0.15s;
  }
  .suche-input:focus { outline: none; border-color: #e94560; box-shadow: 0 0 0 3px rgba(233,69,96,0.12); }
  .suche-clear {
    position: absolute; right: 0.6rem; background: none; border: none;
    cursor: pointer; color: #aaa; font-size: 0.9rem; padding: 0.2rem 0.4rem; border-radius: 4px;
  }
  .suche-clear:hover { color: #666; }

  /* Empty State */
  .leer {
    text-align: center; padding: 5rem 2rem; background: white;
    border-radius: 16px; border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  }
  .leer-emoji { font-size: 4rem; margin-bottom: 1rem; display: block; animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .leer-titel { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; margin: 0 0 0.75rem; }
  .leer-text { color: #666; line-height: 1.6; margin: 0 0 2rem; }
  .leer-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.85rem 1.75rem; background: linear-gradient(135deg, #e94560, #c73652);
    color: white; text-decoration: none; border-radius: 10px; font-weight: 700;
    box-shadow: 0 4px 16px rgba(233,69,96,0.35); transition: all 0.2s;
  }
  .leer-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(233,69,96,0.45); }
  .leer-tipps {
    margin-top: 2rem; padding: 0.75rem 1.25rem; background: #f8f9ff;
    border-radius: 8px; font-size: 0.85rem; color: #666; display: inline-block;
    border: 1px solid rgba(92,107,192,0.15);
  }

  /* Tabelle */
  .tabelle-container {
    background: white; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    overflow: hidden; border: 1px solid rgba(0,0,0,0.06);
  }
  table { width: 100%; border-collapse: collapse; }
  th {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white; padding: 0.9rem 1rem; text-align: left; font-weight: 600;
    white-space: nowrap; font-size: 0.85rem; letter-spacing: 0.01em;
  }
  th.sortierbar { cursor: pointer; user-select: none; transition: background 0.15s; }
  th.sortierbar:hover { background: linear-gradient(135deg, #252545, #202540); }
  td {
    padding: 0.8rem 1rem; border-bottom: 1px solid #f0f0f0; vertical-align: middle; font-size: 0.9rem;
  }
  tr:last-child td { border-bottom: none; }
  tr { transition: background 0.12s ease; }
  tr:hover { background: #f8f9ff; }

  /* Erledigt-Zeile */
  tr.zeile-erledigt { opacity: 0.55; }
  tr.zeile-erledigt:hover { opacity: 0.75; }
  .erledigt-haken { margin-right: 0.3rem; }
  .durchgestrichen { text-decoration: line-through; }

  .titel-link { color: #1a1a2e; text-decoration: none; font-weight: 600; }
  .titel-link:hover { color: #e94560; }
  .typ-pill {
    display: inline-block; font-size: 0.7rem; background: #eef2ff; color: #5c6bc0;
    padding: 0.1rem 0.45rem; border-radius: 8px; margin-left: 0.4rem; vertical-align: middle;
    font-weight: 500;
  }
  .subtask-pill {
    display: inline-block; font-size: 0.68rem; background: #f0fff4; color: #27ae60;
    padding: 0.1rem 0.45rem; border-radius: 8px; margin-left: 0.3rem; vertical-align: middle;
    font-weight: 600; border: 1px solid rgba(39,174,96,0.2);
  }
  .subtask-pill.subtask-done { background: #eafaf1; color: #1a9e55; }

  /* Subtask-Dropdown */
  .subtask-bereich { position: relative; margin-top: 0.35rem; }
  .subtask-dropdown-btn {
    font-size: 0.72rem; color: #5c6bc0; background: #eef2ff;
    border: 1px solid rgba(92,107,192,0.2); border-radius: 6px;
    padding: 0.2rem 0.55rem; cursor: pointer; font-weight: 600;
    transition: background 0.15s;
  }
  .subtask-dropdown-btn:hover { background: #e0e7ff; }
  .subtask-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0;
    background: white; border: 1px solid #e0e0e0; border-radius: 10px;
    min-width: 220px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 50; padding: 0.4rem;
    animation: dropIn 0.15s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .subtask-zeile {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 0.5rem 0.7rem; border: none; background: none;
    cursor: pointer; border-radius: 7px; font-family: inherit;
    transition: background 0.12s;
  }
  .subtask-zeile:hover { background: #f0fff4; }
  .subtask-info { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem; }
  .subtask-name { font-size: 0.82rem; font-weight: 600; color: #1a1a2e; }
  .subtask-aufwand { font-size: 0.72rem; color: #888; }
  .subtask-check { color: #27ae60; font-weight: 700; font-size: 0.9rem; }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700;
  }
  .badge.rot { background: #ffeaea; color: #e74c3c; }
  .pulse-dot {
    width: 6px; height: 6px; background: #e74c3c; border-radius: 50%;
    animation: pulseDot 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }
  .badge.orange { background: #fef3e2; color: #e67e22; }
  .badge.kritisch { background: #fef3e2; color: #f39c12; box-shadow: 0 0 8px rgba(243,156,18,0.3); }
  .badge.warnung { background: #fefbe6; color: #d4ac0d; }
  .badge.ok { background: #eafaf1; color: #27ae60; }

  .prio { padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }
  .status-badge { padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; white-space: nowrap; }
  .status-badge.offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge.in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge.erledigt { background: #eafaf1; color: #27ae60; }

  /* Fortschritt */
  .fortschritt-zelle { min-width: 130px; }
  .fortschritt-btn {
    display: flex; align-items: center; gap: 0.4rem; background: none; border: none;
    cursor: pointer; width: 100%; padding: 0.25rem 0.35rem; border-radius: 6px; transition: background 0.12s;
  }
  .fortschritt-btn:hover { background: rgba(0,0,0,0.04); }
  .mini-bar-bg {
    flex: 1; height: 7px; background: #e8eaed; border-radius: 4px; overflow: hidden; min-width: 55px;
  }
  .mini-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
  .pct-text { font-size: 0.78rem; font-weight: 700; color: #555; white-space: nowrap; }

  .fortschritt-popup {
    background: white; border: 1.5px solid #e0e0e0; border-radius: 10px;
    padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.4rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  .range-mini { width: 75px; accent-color: #e94560; cursor: pointer; padding: 0; border: none; background: none; }
  .pct-label { font-size: 0.8rem; font-weight: 700; color: #333; min-width: 30px; }
  .btn-save, .btn-cancel {
    width: 24px; height: 24px; border-radius: 5px; border: none; cursor: pointer;
    font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center;
    transition: all 0.12s;
  }
  .btn-save { background: #e94560; color: white; }
  .btn-save:hover { background: #c73652; }
  .btn-cancel { background: #f0f2f5; color: #666; }
  .btn-cancel:hover { background: #dde0e5; }

  .user-badge { font-size: 0.82rem; color: #666; background: #f0f2f5; padding: 0.2rem 0.6rem; border-radius: 20px; }
  .aktionen { display: flex; gap: 0.3rem; }
  .btn-icon {
    padding: 0.3rem 0.5rem; border-radius: 7px; cursor: pointer; border: 1px solid rgba(0,0,0,0.07);
    font-size: 0.9rem; background: #f5f6fa; text-decoration: none; display: inline-flex;
    align-items: center; line-height: 1; transition: all 0.12s;
  }
  .btn-icon:hover { background: #e8ebff; transform: translateY(-1px); }
  .btn-delete:hover { background: #ffeaea !important; border-color: rgba(231,76,60,0.2) !important; }
  .keine-zeile { text-align: center; color: #888; padding: 2.5rem !important; font-size: 0.9rem; }

  /* ════════════════ MOBILE RESPONSIVE TABLE ════════════════ */
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .header { flex-direction: column; gap: 0.75rem; }
    .header-rechts { align-self: flex-start; }

    .tabelle-container { overflow: visible; background: transparent; box-shadow: none; border: none; }

    table { display: block; }
    thead { display: none; }
    tbody { display: flex; flex-direction: column; gap: 0.75rem; }
    tr {
      display: block; background: white; border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06);
      padding: 0.75rem;
      animation: fadeInCard 0.2s ease-out both;
    }
    :global([data-theme="dark"]) tr {
      background: rgba(22,27,34,0.85) !important;
      border-color: rgba(255,255,255,0.08) !important;
    }
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    tr:hover { background: white; transform: none; }
    td {
      display: flex; padding: 0.45rem 0.5rem; border: none;
      align-items: flex-start; gap: 0.5rem; font-size: 0.88rem;
    }
    td::before {
      content: attr(data-label);
      font-weight: 700; font-size: 0.75rem; color: #888;
      text-transform: uppercase; letter-spacing: 0.04em;
      width: 80px; flex-shrink: 0; padding-top: 0.15rem;
    }
    :global([data-theme="dark"]) td::before { color: #555 !important; }
    td:last-child { margin-top: 0.25rem; }
    .fortschritt-zelle { flex-direction: column; }
    .fortschritt-zelle::before { width: auto; }
  }

  @media (max-width: 480px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .stat-card { padding: 1rem 0.75rem; }
    .stat-zahl { font-size: 1.5rem; }
    .hero-stats { display: none; }
  }
</style>
