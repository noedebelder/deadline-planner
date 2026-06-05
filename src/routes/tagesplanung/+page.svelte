<script>
  export let data;

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }

  function formatDatum(dateStr) {
    return new Date(dateStr).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "short" });
  }

  // Berechne für jede Deadline die Planungsdaten
  $: berechnet = data.deadlines.map((d) => {
    const tage = tageVerbleibend(d.deadline);
    const restAufwand = +(d.aufwand * (1 - d.fortschritt / 100)).toFixed(1);
    const hProTag = restAufwand > 0 ? +(restAufwand / Math.max(tage, 1)).toFixed(1) : 0;
    // Optimaler Starttermin: annahme 2h/Tag
    const tageBenötigt = Math.ceil(restAufwand / 2);
    const startDatum = new Date(d.deadline);
    startDatum.setDate(startDatum.getDate() - tageBenötigt);
    const heute = new Date(); heute.setHours(0, 0, 0, 0);
    const startTage = Math.ceil((startDatum - heute) / (1000 * 60 * 60 * 24));
    return { ...d, tage, restAufwand, hProTag, startDatum, startTage };
  });

  $: ueberfaellig = berechnet.filter((d) => d.tage < 0);
  $: heuteGruppe = berechnet.filter((d) => d.tage === 0);
  $: dieseWoche = berechnet.filter((d) => d.tage >= 1 && d.tage <= 7);
  $: naechsteWoche = berechnet.filter((d) => d.tage >= 8 && d.tage <= 14);
  $: spaeter = berechnet.filter((d) => d.tage > 14);

  $: dringend = [...ueberfaellig, ...heuteGruppe, ...dieseWoche];
  $: totalHProTag = +dringend.reduce((s, d) => s + d.hProTag, 0).toFixed(1);

  // Smart Warnungen
  $: planWarnungen = (() => {
    const w = [];
    if (ueberfaellig.length > 0) {
      w.push({ typ: "gefahr", text: `🔥 ${ueberfaellig.length} überfällige Aufgabe${ueberfaellig.length > 1 ? "n" : ""} — sofort erledigen!` });
    }
    if (totalHProTag > 8) {
      w.push({ typ: "gefahr", text: `⚠️ Sehr hohe Arbeitslast: ${totalHProTag}h heute benötigt — priorisieren!` });
    } else if (totalHProTag > 4) {
      w.push({ typ: "warnung", text: `⚡ Hohe Arbeitslast heute: ${totalHProTag}h insgesamt nötig` });
    }
    const naechsteWocheAufwand = naechsteWoche.reduce((s, d) => s + d.restAufwand, 0).toFixed(1);
    if (Number(naechsteWocheAufwand) > 15) {
      w.push({ typ: "warnung", text: `📅 Nächste Woche kommen ${naechsteWocheAufwand}h auf dich zu — frühzeitig beginnen!` });
    }
    if (berechnet.length === 0) {
      w.push({ typ: "erfolg", text: "🎉 Keine offenen Deadlines — alles erledigt!" });
    } else if (dringend.length === 0 && berechnet.length > 0) {
      w.push({ typ: "erfolg", text: "✅ Keine dringenden Deadlines — du bist gut organisiert!" });
    }
    return w;
  })();
</script>

<div class="header">
  <div>
    <h1>📆 Tagesplanung</h1>
    <p class="subtitle">Smarte Aufwandsplanung für deine Deadlines</p>
  </div>
  <a href="/" class="zurueck-link">← Zur Übersicht</a>
</div>

<!-- Warnungen -->
{#if planWarnungen.length > 0}
  <div class="warnungen-container">
    {#each planWarnungen as w}
      <div class="warnung-banner {w.typ}">{w.text}</div>
    {/each}
  </div>
{/if}

<!-- Zusammenfassung -->
{#if dringend.length > 0}
  <div class="zusammenfassung">
    <div class="zf-item">
      <span class="zf-zahl">{totalHProTag}h</span>
      <span class="zf-label">heute arbeiten</span>
    </div>
    <div class="zf-divider"></div>
    <div class="zf-item">
      <span class="zf-zahl">{dringend.length}</span>
      <span class="zf-label">dringende Aufgaben</span>
    </div>
    <div class="zf-divider"></div>
    <div class="zf-item">
      <span class="zf-zahl">{berechnet.reduce((s, d) => s + d.restAufwand, 0).toFixed(1)}h</span>
      <span class="zf-label">Restaufwand gesamt</span>
    </div>
  </div>
{/if}

<div class="gruppen">

  <!-- Überfällig -->
  {#if ueberfaellig.length > 0}
    <div class="tages-gruppe gruppe-ueberfaellig">
      <h3>🔥 Überfällig <span class="count">{ueberfaellig.length}</span></h3>
      <div class="karten-liste">
        {#each ueberfaellig as d}
          <a href="/deadline/{d.id}" class="tages-karte prio-{d.prioritaet}">
            <div class="karte-top">
              <div>
                <div class="tages-titel">{d.titel}</div>
                <div class="tages-modul">{d.modul}{d.typ ? ` · ${d.typ}` : ""}</div>
              </div>
              <div class="karte-meta-rechts">
                <span class="tage-badge ueberfaellig">{Math.abs(d.tage)}d überfällig</span>
              </div>
            </div>
            <div class="karte-stats">
              <span>⏱️ {d.restAufwand}h verbleibend</span>
              <span class="hprotag-badge gefahr">{d.hProTag}h/Tag nötig</span>
            </div>
            <div class="karte-bar">
              <div class="karte-fill" style="width: {d.fortschritt}%; background: #e94560"></div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Heute fällig -->
  {#if heuteGruppe.length > 0}
    <div class="tages-gruppe gruppe-heute">
      <h3>🎯 Heute fällig <span class="count">{heuteGruppe.length}</span></h3>
      <div class="karten-liste">
        {#each heuteGruppe as d}
          <a href="/deadline/{d.id}" class="tages-karte">
            <div class="karte-top">
              <div>
                <div class="tages-titel">{d.titel}</div>
                <div class="tages-modul">{d.modul}{d.typ ? ` · ${d.typ}` : ""}</div>
              </div>
              <span class="tage-badge heute">Heute!</span>
            </div>
            <div class="karte-stats">
              <span>⏱️ {d.restAufwand}h verbleibend</span>
              <span class="hprotag-badge warnung">{d.hProTag}h noch heute</span>
            </div>
            <div class="karte-bar">
              <div class="karte-fill" style="width: {d.fortschritt}%; background: #f39c12"></div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Diese Woche -->
  {#if dieseWoche.length > 0}
    <div class="tages-gruppe gruppe-woche">
      <h3>⚡ Diese Woche <span class="count">{dieseWoche.length}</span></h3>
      <div class="karten-liste">
        {#each dieseWoche as d}
          <a href="/deadline/{d.id}" class="tages-karte">
            <div class="karte-top">
              <div>
                <div class="tages-titel">{d.titel}</div>
                <div class="tages-modul">{d.modul}{d.typ ? ` · ${d.typ}` : ""}</div>
              </div>
              <div class="karte-meta-rechts">
                <span class="tage-badge kritisch">{d.tage}d</span>
                <span class="karte-datum">{formatDatum(d.deadline)}</span>
              </div>
            </div>
            <div class="karte-stats">
              <span>⏱️ {d.restAufwand}h verbleibend</span>
              <span class="hprotag-badge info">{d.hProTag}h/Tag</span>
              {#if d.startTage < 0}
                <span class="start-hint rot">Jetzt beginnen!</span>
              {:else if d.startTage === 0}
                <span class="start-hint orange">Heute starten</span>
              {:else if d.startTage <= 3}
                <span class="start-hint gelb">Start in {d.startTage}d</span>
              {/if}
            </div>
            <div class="karte-bar">
              <div class="karte-fill" style="width: {d.fortschritt}%; background: #5c6bc0"></div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Nächste Woche -->
  {#if naechsteWoche.length > 0}
    <div class="tages-gruppe gruppe-naechste">
      <h3>📅 Nächste Woche <span class="count">{naechsteWoche.length}</span></h3>
      <div class="karten-liste">
        {#each naechsteWoche as d}
          <a href="/deadline/{d.id}" class="tages-karte">
            <div class="karte-top">
              <div>
                <div class="tages-titel">{d.titel}</div>
                <div class="tages-modul">{d.modul}{d.typ ? ` · ${d.typ}` : ""}</div>
              </div>
              <div class="karte-meta-rechts">
                <span class="tage-badge warnung">{d.tage}d</span>
                <span class="karte-datum">{formatDatum(d.deadline)}</span>
              </div>
            </div>
            <div class="karte-stats">
              <span>⏱️ {d.restAufwand}h verbleibend</span>
              <span class="hprotag-badge ok">{d.hProTag}h/Tag</span>
              {#if d.startTage <= 0}
                <span class="start-hint orange">Jetzt beginnen</span>
              {:else}
                <span class="start-hint gruen">Start in {d.startTage}d ({new Date(d.startDatum).toLocaleDateString("de-CH", { day: "numeric", month: "short" })})</span>
              {/if}
            </div>
            <div class="karte-bar">
              <div class="karte-fill" style="width: {d.fortschritt}%; background: #27ae60"></div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Später -->
  {#if spaeter.length > 0}
    <div class="tages-gruppe gruppe-spaeter">
      <h3>📋 Später <span class="count">{spaeter.length}</span></h3>
      <div class="karten-liste kompakt">
        {#each spaeter as d}
          <a href="/deadline/{d.id}" class="tages-karte kompakt-karte">
            <div class="karte-top">
              <div>
                <div class="tages-titel">{d.titel}</div>
                <div class="tages-modul">{d.modul}</div>
              </div>
              <div class="karte-meta-rechts">
                <span class="tage-badge ok">{d.tage}d</span>
                <span class="karte-datum">{formatDatum(d.deadline)}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  {#if berechnet.length === 0}
    <div class="leer">
      <p>🎉 Keine offenen Deadlines!</p>
      <a href="/neu" class="btn-primary">Neue Deadline erfassen</a>
    </div>
  {/if}
</div>

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

  .warnungen-container { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
  .warnung-banner {
    padding: 0.7rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
    border-left: 4px solid transparent;
  }
  .warnung-banner.gefahr { background: #ffeaea; color: #c0392b; border-color: #e74c3c; }
  .warnung-banner.warnung { background: #fef3e2; color: #a04000; border-color: #f39c12; }
  .warnung-banner.erfolg { background: #eafaf1; color: #1e8449; border-color: #27ae60; }

  .zusammenfassung {
    background: white; border-radius: 12px; padding: 1.25rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; align-items: center;
    gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;
  }
  .zf-item { display: flex; flex-direction: column; align-items: center; }
  .zf-zahl { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; }
  .zf-label { font-size: 0.8rem; color: #888; }
  .zf-divider { width: 1px; height: 40px; background: #e0e0e0; }

  .gruppen { display: flex; flex-direction: column; gap: 1.5rem; }

  .tages-gruppe { }
  .tages-gruppe h3 {
    font-size: 1rem; font-weight: 700; color: #333; margin: 0 0 0.75rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .count {
    background: #f0f2f5; color: #666; font-size: 0.78rem;
    padding: 0.1rem 0.5rem; border-radius: 10px; font-weight: 600;
  }
  .gruppe-ueberfaellig h3 { color: #c0392b; }
  .gruppe-heute h3 { color: #e67e22; }
  .gruppe-woche h3 { color: #5c6bc0; }
  .gruppe-naechste h3 { color: #27ae60; }
  .gruppe-spaeter h3 { color: #888; }

  .karten-liste { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem; }
  .karten-liste.kompakt { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }

  .tages-karte {
    background: white; border-radius: 10px; padding: 1rem 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07); text-decoration: none; color: inherit;
    display: block; transition: box-shadow 0.2s, transform 0.15s; border-left: 3px solid #e0e0e0;
  }
  .tages-karte:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-1px); }
  .tages-karte.prio-hoch { border-left-color: #e74c3c; }
  .tages-karte.prio-mittel { border-left-color: #f39c12; }
  .tages-karte.prio-niedrig { border-left-color: #27ae60; }
  .kompakt-karte { padding: 0.75rem 1rem; }

  .karte-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; }
  .tages-titel { font-weight: 700; font-size: 0.95rem; color: #1a1a2e; margin-bottom: 0.1rem; }
  .tages-modul { font-size: 0.8rem; color: #888; }
  .karte-meta-rechts { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; flex-shrink: 0; }
  .karte-datum { font-size: 0.75rem; color: #aaa; white-space: nowrap; }

  .tage-badge {
    padding: 0.15rem 0.55rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;
  }
  .tage-badge.ueberfaellig { background: #ffeaea; color: #e74c3c; }
  .tage-badge.heute { background: #fef3e2; color: #e67e22; }
  .tage-badge.kritisch { background: #fef3e2; color: #f39c12; }
  .tage-badge.warnung { background: #fefbe6; color: #d4ac0d; }
  .tage-badge.ok { background: #eafaf1; color: #27ae60; }

  .karte-stats {
    display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;
  }
  .hprotag-badge {
    padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.75rem; font-weight: 700;
  }
  .hprotag-badge.gefahr { background: #ffeaea; color: #e74c3c; }
  .hprotag-badge.warnung { background: #fef3e2; color: #f39c12; }
  .hprotag-badge.info { background: #eef2ff; color: #5c6bc0; }
  .hprotag-badge.ok { background: #eafaf1; color: #27ae60; }

  .start-hint { font-size: 0.75rem; font-weight: 600; }
  .start-hint.rot { color: #e74c3c; }
  .start-hint.orange { color: #e67e22; }
  .start-hint.gelb { color: #d4ac0d; }
  .start-hint.gruen { color: #27ae60; }

  .karte-bar { height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; }
  .karte-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

  .leer { text-align: center; padding: 4rem; background: white; border-radius: 12px; }
  .btn-primary {
    display: inline-block; padding: 0.75rem 1.5rem; background: #e94560; color: white;
    text-decoration: none; border-radius: 8px; margin-top: 1rem; font-weight: 600;
  }
</style>
