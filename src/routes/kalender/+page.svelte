<script>
  export let data;

  let ansicht = "woche"; // 'woche' | 'monat'
  let aktuellesDatum = new Date();
  aktuellesDatum.setHours(0, 0, 0, 0);

  let ausgewaehlterTag = null; // YYYY-MM-DD String für Monatsansicht

  // ─── Hilfsfunktionen ──────────────────────────────────────────────

  function toDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function istHeute(d) {
    const h = new Date();
    return d.getDate() === h.getDate() && d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear();
  }

  function istVergangen(d) {
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    return d < h;
  }

  function wochenMontag(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const tag = date.getDay(); // 0=So, 1=Mo...
    const diff = tag === 0 ? -6 : 1 - tag;
    date.setDate(date.getDate() + diff);
    return date;
  }

  function deadlinesAmTag(datum) {
    const str = toDateStr(datum);
    return data.deadlines.filter((d) => d.deadline === str);
  }

  function prioBgKlasse(prio) {
    if (prio === "hoch") return "prio-hoch";
    if (prio === "mittel") return "prio-mittel";
    return "prio-niedrig";
  }

  // ─── Navigation ──────────────────────────────────────────────────

  function vorige() {
    const d = new Date(aktuellesDatum);
    if (ansicht === "woche") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(1);
      d.setMonth(d.getMonth() - 1);
    }
    aktuellesDatum = d;
    ausgewaehlterTag = null;
  }

  function naechste() {
    const d = new Date(aktuellesDatum);
    if (ansicht === "woche") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
    }
    aktuellesDatum = d;
    ausgewaehlterTag = null;
  }

  function heute() {
    aktuellesDatum = new Date();
    aktuellesDatum.setHours(0, 0, 0, 0);
    ausgewaehlterTag = null;
  }

  function ansichtWechseln(neu) {
    ansicht = neu;
    ausgewaehlterTag = null;
  }

  // ─── Wochenansicht ────────────────────────────────────────────────

  $: wochentage = (() => {
    const montag = wochenMontag(aktuellesDatum);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(montag);
      d.setDate(d.getDate() + i);
      return d;
    });
  })();

  // ─── Monatsansicht ────────────────────────────────────────────────

  $: monatsTage = (() => {
    const j = aktuellesDatum.getFullYear();
    const m = aktuellesDatum.getMonth();
    const erster = new Date(j, m, 1);
    const letzter = new Date(j, m + 1, 0);

    const erstWochentag = erster.getDay(); // 0=So
    const vorPadding = erstWochentag === 0 ? 6 : erstWochentag - 1;
    const letzterWochentag = letzter.getDay();
    const nachPadding = letzterWochentag === 0 ? 0 : 7 - letzterWochentag;

    const tage = [];
    for (let i = -vorPadding; i < letzter.getDate() + nachPadding; i++) {
      tage.push(new Date(j, m, 1 + i));
    }
    return tage;
  })();

  $: aktuellerMonat = aktuellesDatum.getMonth();

  function tagAnklicken(datum) {
    const str = toDateStr(datum);
    const ds = deadlinesAmTag(datum);
    if (ds.length === 0 && ausgewaehlterTag !== str) return;
    ausgewaehlterTag = ausgewaehlterTag === str ? null : str;
  }

  $: ausgewaehlteDeadlines = ausgewaehlterTag
    ? data.deadlines.filter((d) => d.deadline === ausgewaehlterTag)
    : [];

  // ─── Titel ───────────────────────────────────────────────────────

  const WOCHENTAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const MONATE = [
    "Januar","Februar","März","April","Mai","Juni",
    "Juli","August","September","Oktober","November","Dezember",
  ];

  $: zeitraumTitel = (() => {
    if (ansicht === "woche") {
      const mo = wochentage[0];
      const so = wochentage[6];
      const moFormat = `${WOCHENTAGE_KURZ[0]} ${mo.getDate()}.`;
      const soFormat = `${WOCHENTAGE_KURZ[6]} ${so.getDate()}.`;
      const monatName = MONATE[so.getMonth()];
      const jahr = so.getFullYear();
      if (mo.getMonth() === so.getMonth()) {
        return `${moFormat} – ${soFormat} ${monatName} ${jahr}`;
      } else {
        return `${moFormat} ${MONATE[mo.getMonth()]} – ${soFormat} ${monatName} ${jahr}`;
      }
    } else {
      return `${MONATE[aktuellesDatum.getMonth()]} ${aktuellesDatum.getFullYear()}`;
    }
  })();
</script>

<div class="header">
  <h1>📅 Kalender</h1>
</div>

<div class="kalender-toolbar">
  <!-- Ansicht-Toggle -->
  <div class="ansicht-toggle">
    <button
      class="toggle-btn" class:aktiv={ansicht === "woche"}
      on:click={() => ansichtWechseln("woche")} type="button"
    >📆 Woche</button>
    <button
      class="toggle-btn" class:aktiv={ansicht === "monat"}
      on:click={() => ansichtWechseln("monat")} type="button"
    >🗓️ Monat</button>
  </div>

  <!-- Navigation -->
  <div class="nav-gruppe">
    <button class="nav-pfeil" on:click={vorige} type="button" title="Zurück">←</button>
    <div class="zeitraum-titel">{zeitraumTitel}</div>
    <button class="nav-pfeil" on:click={naechste} type="button" title="Vor">→</button>
  </div>

  <button class="heute-btn" on:click={heute} type="button">Heute</button>
</div>

<!-- ═══ WOCHENANSICHT ═══ -->
{#if ansicht === "woche"}
  <div class="woche-scroll">
    <div class="woche-grid">
      {#each wochentage as tag, i}
        {@const tagDeadlines = deadlinesAmTag(tag)}
        {@const istH = istHeute(tag)}
        {@const vergangen = istVergangen(tag) && !istH}
        <div class="tag-spalte" class:heute={istH} class:vergangen>
          <div class="tag-header">
            <span class="wochentag-name">{WOCHENTAGE_KURZ[i]}</span>
            <span class="tag-nummer" class:heute-zahl={istH}>{tag.getDate()}.</span>
            <span class="monat-kuerzel">{MONATE[tag.getMonth()].slice(0, 3)}</span>
          </div>
          <div class="tag-inhalt">
            {#if tagDeadlines.length === 0}
              <div class="kein-event"></div>
            {:else}
              {#each tagDeadlines as d}
                <a href="/deadline/{d.id}" class="event-badge {prioBgKlasse(d.prioritaet)}" title="{d.titel} – {d.modul}">
                  <span class="event-titel">{d.titel}</span>
                  <span class="event-modul">{d.modul}</span>
                </a>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Legende -->
  <div class="legende">
    <span class="legende-item"><span class="legende-dot prio-hoch"></span>Hoch</span>
    <span class="legende-item"><span class="legende-dot prio-mittel"></span>Mittel</span>
    <span class="legende-item"><span class="legende-dot prio-niedrig"></span>Niedrig</span>
  </div>

<!-- ═══ MONATSANSICHT ═══ -->
{:else}
  <div class="monat-container">
    <!-- Wochentag-Header -->
    <div class="monat-header-grid">
      {#each WOCHENTAGE_KURZ as name}
        <div class="monat-header-zelle">{name}</div>
      {/each}
    </div>

    <!-- Tage-Grid -->
    <div class="monat-grid">
      {#each monatsTage as tag}
        {@const tagDeadlines = deadlinesAmTag(tag)}
        {@const istH = istHeute(tag)}
        {@const vergangen = istVergangen(tag) && !istH}
        {@const aktuell = tag.getMonth() === aktuellerMonat}
        {@const tagStr = toDateStr(tag)}
        {@const ausgewaehlt = ausgewaehlterTag === tagStr}
        <div
          class="monat-tag"
          class:heute={istH}
          class:vergangen
          class:anderer-monat={!aktuell}
          class:ausgewaehlt
          class:hat-events={tagDeadlines.length > 0}
          on:click={() => tagAnklicken(tag)}
          role="button"
          tabindex="0"
          on:keypress={(e) => e.key === "Enter" && tagAnklicken(tag)}
        >
          <span class="monat-tag-nummer" class:heute-zahl={istH}>{tag.getDate()}</span>
          <div class="monat-events">
            {#each tagDeadlines.slice(0, 2) as d}
              <div class="monat-badge {prioBgKlasse(d.prioritaet)}" title="{d.titel}">
                {d.titel.length > 14 ? d.titel.slice(0, 13) + "…" : d.titel}
              </div>
            {/each}
            {#if tagDeadlines.length > 2}
              <div class="monat-mehr">+{tagDeadlines.length - 2} weitere</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Detail-Panel für ausgewählten Tag -->
  {#if ausgewaehlterTag && ausgewaehlteDeadlines.length > 0}
    {@const datumObj = new Date(ausgewaehlterTag + "T00:00:00")}
    <div class="detail-panel">
      <div class="detail-header">
        <span class="detail-datum">
          {WOCHENTAGE_KURZ[(datumObj.getDay() + 6) % 7]}, {datumObj.getDate()}. {MONATE[datumObj.getMonth()]} {datumObj.getFullYear()}
        </span>
        <button class="detail-schliessen" on:click={() => ausgewaehlterTag = null} type="button">✕</button>
      </div>
      {#each ausgewaehlteDeadlines as d}
        <a href="/deadline/{d.id}" class="detail-zeile">
          <span class="detail-dot {prioBgKlasse(d.prioritaet)}"></span>
          <div class="detail-info">
            <strong>{d.titel}</strong>
            <span class="detail-meta">{d.modul} · {d.prioritaet} · {d.status}</span>
          </div>
          <span class="detail-pfeil">→</span>
        </a>
      {/each}
    </div>
  {/if}

  <!-- Legende -->
  <div class="legende">
    <span class="legende-item"><span class="legende-dot prio-hoch"></span>Hoch</span>
    <span class="legende-item"><span class="legende-dot prio-mittel"></span>Mittel</span>
    <span class="legende-item"><span class="legende-dot prio-niedrig"></span>Niedrig</span>
  </div>
{/if}

<style>
  .header { margin-bottom: 1rem; }
  h1 { color: #1a1a2e; margin: 0; font-size: 1.8rem; }

  /* ─── Toolbar ─────────────────────────────────── */
  .kalender-toolbar {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.25rem; flex-wrap: wrap;
    background: white; padding: 0.75rem 1rem;
    border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    border: 1px solid rgba(0,0,0,0.06);
  }

  .ansicht-toggle {
    display: flex; border-radius: 8px; overflow: hidden;
    border: 2px solid #e0e0e0; flex-shrink: 0;
  }
  .toggle-btn {
    padding: 0.45rem 0.9rem; background: white; border: none;
    cursor: pointer; font-size: 0.85rem; font-weight: 600;
    color: #666; font-family: inherit; transition: all 0.15s;
  }
  .toggle-btn.aktiv { background: #1a1a2e; color: white; }

  .nav-gruppe {
    display: flex; align-items: center; gap: 0.5rem; flex: 1; justify-content: center;
  }
  .nav-pfeil {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1.5px solid #e0e0e0; background: white;
    cursor: pointer; font-size: 1.1rem; font-family: inherit;
    transition: all 0.15s; display: flex; align-items: center; justify-content: center;
  }
  .nav-pfeil:hover { background: #f0f2f5; border-color: #ccc; }
  .zeitraum-titel {
    font-size: 1rem; font-weight: 700; color: #1a1a2e;
    min-width: 240px; text-align: center;
  }

  .heute-btn {
    padding: 0.45rem 1rem; background: #e94560; color: white; border: none;
    border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600;
    font-family: inherit; transition: background 0.15s; flex-shrink: 0;
  }
  .heute-btn:hover { background: #c73652; }

  /* ─── Wochenansicht ──────────────────────────── */
  .woche-scroll { overflow-x: auto; padding-bottom: 0.5rem; }
  .woche-grid {
    display: grid; grid-template-columns: repeat(7, minmax(120px, 1fr));
    gap: 0.5rem; min-width: 700px;
  }

  .tag-spalte {
    background: white; border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    min-height: 160px; overflow: hidden;
    transition: box-shadow 0.15s;
  }
  .tag-spalte:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .tag-spalte.heute { border: 2px solid #e94560; }
  .tag-spalte.vergangen { opacity: 0.55; }

  .tag-header {
    padding: 0.65rem 0.75rem 0.5rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
  }
  .wochentag-name { font-size: 0.72rem; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.06em; }
  .tag-nummer {
    font-size: 1.2rem; font-weight: 800; color: #1a1a2e; line-height: 1;
  }
  .heute-zahl {
    background: #e94560; color: white;
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
  }
  .monat-kuerzel { font-size: 0.7rem; color: #bbb; }

  .tag-inhalt {
    padding: 0.5rem; display: flex; flex-direction: column; gap: 0.3rem;
  }
  .kein-event { min-height: 60px; }

  .event-badge {
    display: block; padding: 0.3rem 0.5rem; border-radius: 7px;
    text-decoration: none; transition: transform 0.1s, filter 0.1s;
    cursor: pointer;
  }
  .event-badge:hover { transform: scale(1.02); filter: brightness(0.95); }
  .event-titel { display: block; font-size: 0.78rem; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .event-modul { display: block; font-size: 0.68rem; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ─── Monatsansicht ──────────────────────────── */
  .monat-container {
    background: white; border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .monat-header-grid {
    display: grid; grid-template-columns: repeat(7, 1fr);
    background: linear-gradient(135deg, #1a1a2e, #16213e);
  }
  .monat-header-zelle {
    padding: 0.65rem; text-align: center;
    font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.7);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .monat-grid {
    display: grid; grid-template-columns: repeat(7, 1fr);
  }
  .monat-tag {
    min-height: 90px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;
    padding: 0.4rem; cursor: default; transition: background 0.12s;
    position: relative;
  }
  .monat-tag:nth-child(7n) { border-right: none; }
  .monat-tag.hat-events { cursor: pointer; }
  .monat-tag.hat-events:hover { background: #f8f9ff; }
  .monat-tag.anderer-monat { background: #fafafa; }
  .monat-tag.anderer-monat .monat-tag-nummer { color: #ccc; }
  .monat-tag.vergangen { opacity: 0.6; }
  .monat-tag.heute { background: #fff5f7; }
  .monat-tag.ausgewaehlt { background: #eef2ff; outline: 2px solid #5c6bc0; outline-offset: -2px; }

  .monat-tag-nummer {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 700; color: #1a1a2e;
    width: 26px; height: 26px; border-radius: 50%; margin-bottom: 0.3rem;
  }
  .monat-tag-nummer.heute-zahl { background: #e94560; color: white; }

  .monat-events { display: flex; flex-direction: column; gap: 0.2rem; }
  .monat-badge {
    font-size: 0.68rem; font-weight: 600; color: white;
    padding: 0.15rem 0.4rem; border-radius: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .monat-mehr {
    font-size: 0.65rem; color: #888; font-weight: 500;
    padding-left: 0.3rem;
  }

  /* ─── Detail-Panel ───────────────────────────── */
  .detail-panel {
    margin-top: 1rem; background: white; border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 1rem 1.25rem;
    border: 1px solid rgba(92,107,192,0.2); border-left: 3px solid #5c6bc0;
    animation: slideIn 0.2s ease-out;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .detail-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem;
  }
  .detail-datum { font-weight: 700; font-size: 0.95rem; color: #1a1a2e; }
  .detail-schliessen {
    background: none; border: none; cursor: pointer; color: #aaa;
    font-size: 1rem; padding: 0.2rem 0.4rem; border-radius: 4px;
  }
  .detail-schliessen:hover { color: #666; background: #f0f2f5; }
  .detail-zeile {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.55rem 0.5rem; border-radius: 8px;
    text-decoration: none; color: inherit; transition: background 0.12s;
  }
  .detail-zeile:hover { background: #f8f9ff; }
  .detail-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }
  .detail-info { flex: 1; }
  .detail-info strong { display: block; font-size: 0.92rem; color: #1a1a2e; }
  .detail-meta { font-size: 0.78rem; color: #888; }
  .detail-pfeil { color: #ccc; font-size: 0.9rem; }

  /* ─── Priorität-Farben ───────────────────────── */
  .prio-hoch { background: #e74c3c; }
  .prio-mittel { background: #f39c12; }
  .prio-niedrig { background: #27ae60; }

  /* ─── Legende ────────────────────────────────── */
  .legende {
    display: flex; gap: 1.25rem; margin-top: 0.75rem;
    padding: 0 0.25rem;
  }
  .legende-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #888; }
  .legende-dot { width: 10px; height: 10px; border-radius: 50%; }

  /* ─── Dark Mode ──────────────────────────────── */
  :global([data-theme="dark"]) h1 { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .kalender-toolbar { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .toggle-btn { background: rgba(22,27,34,0.9) !important; color: #8b949e !important; border-color: transparent !important; }
  :global([data-theme="dark"]) .toggle-btn.aktiv { background: #e94560 !important; color: white !important; }
  :global([data-theme="dark"]) .ansicht-toggle { border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"]) .nav-pfeil { background: rgba(22,27,34,0.9) !important; border-color: rgba(255,255,255,0.1) !important; color: #c9d1d9 !important; }
  :global([data-theme="dark"]) .nav-pfeil:hover { background: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .zeitraum-titel { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .tag-spalte { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .tag-header { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"]) .wochentag-name { color: #4d5566 !important; }
  :global([data-theme="dark"]) .tag-nummer { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .monat-container { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .monat-tag { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"]) .monat-tag.hat-events:hover { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"]) .monat-tag.anderer-monat { background: rgba(13,17,23,0.4) !important; }
  :global([data-theme="dark"]) .monat-tag.heute { background: rgba(233,69,96,0.08) !important; }
  :global([data-theme="dark"]) .monat-tag.ausgewaehlt { background: rgba(92,107,192,0.12) !important; }
  :global([data-theme="dark"]) .monat-tag-nummer { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .monat-tag.anderer-monat .monat-tag-nummer { color: #4d5566 !important; }
  :global([data-theme="dark"]) .detail-panel { background: rgba(22,27,34,0.9) !important; border-color: rgba(92,107,192,0.3) !important; }
  :global([data-theme="dark"]) .detail-datum { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .detail-zeile:hover { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"]) .detail-info strong { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .legende-item { color: #4d5566 !important; }

  @media (max-width: 768px) {
    .kalender-toolbar { gap: 0.5rem; }
    .zeitraum-titel { font-size: 0.88rem; min-width: 0; }
    .nav-gruppe { order: 3; width: 100%; justify-content: center; }
    .monat-tag { min-height: 60px; }
    .monat-badge { display: none; }
    .monat-mehr { display: none; }
  }
</style>
