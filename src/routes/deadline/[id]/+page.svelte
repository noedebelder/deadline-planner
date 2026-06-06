<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let data;
  export let form;

  const d = data.deadline;
  let fortschrittWert = d.fortschritt;

  // Neuer Subtask: Eingabefelder
  let neuerTitel = "";
  let neuerAufwand = 1;
  let subtaskLaden = false;

  $: subtasks = d.subtasks;
  $: subtasksOffen = subtasks.filter((s) => !s.erledigt);
  $: subtasksErledigt = subtasks.filter((s) => s.erledigt);
  $: hatSubtasks = subtasks.length > 0;

  $: fortschrittAnzeige = hatSubtasks ? d.fortschritt : fortschrittWert;
  $: fortschrittFarbe =
    fortschrittAnzeige === 100
      ? "#27ae60"
      : fortschrittAnzeige >= 60
        ? "#f39c12"
        : "#e94560";

  function tageVerbleibend(deadlineStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(deadlineStr) - heute) / (1000 * 60 * 60 * 24));
  }

  $: tage = tageVerbleibend(d.deadline);

  function tageText(tage) {
    if (d.status === "erledigt") return "✅ Erledigt";
    if (tage < 0) return `${Math.abs(tage)} Tage überfällig`;
    if (tage === 0) return "Heute fällig!";
    if (tage === 1) return "Morgen fällig";
    return `${tage} Tage verbleibend`;
  }

  function tageKlasse(tage) {
    if (d.status === "erledigt") return "erledigt";
    if (tage < 0) return "ueberfaellig";
    if (tage <= 3) return "kritisch";
    if (tage <= 7) return "warnung";
    return "ok";
  }

  // Nur wenn keine Subtasks: manuelle Berechnung
  $: restAufwand = hatSubtasks
    ? d.aufwandVerbleibend
    : +(d.aufwand * (1 - fortschrittWert / 100)).toFixed(1);
  $: hProTag = tage > 0 ? +(restAufwand / tage).toFixed(1) : restAufwand;
</script>

<div class="breadcrumb">
  <a href="/">Übersicht</a> <span>›</span> <span>{d.titel}</span>
</div>

<div class="detail-layout">
  <div class="detail-main">

    <!-- HEADER -->
    <div class="detail-header">
      <div>
        <h1>{d.titel}</h1>
        <p class="modul-label">
          📚 {d.modul}
          {#if d.typ}<span class="typ-tag">{d.typ}</span>{/if}
        </p>
      </div>
      <div class="header-aktionen">
        <a href="/bearbeiten/{d.id}" class="btn-edit">✏️ Bearbeiten</a>
        <a href="/" class="btn-back">← Zurück</a>
      </div>
    </div>

    <!-- INFO-GRID -->
    <div class="info-grid">
      <div class="info-karte">
        <span class="info-icon">📅</span>
        <div>
          <div class="info-titel">Deadline</div>
          <div class="info-wert">
            {new Date(d.deadline).toLocaleDateString("de-CH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
          <div class="info-wert"><span class="prio {d.prioritaet}">{d.prioritaet}</span></div>
        </div>
      </div>

      <div class="info-karte">
        <span class="info-icon">📋</span>
        <div>
          <div class="info-titel">Status</div>
          <div class="info-wert"><span class="status-badge {d.status}">{d.status}</span></div>
        </div>
      </div>

      <div class="info-karte">
        <span class="info-icon">🕐</span>
        <div>
          <div class="info-titel">{hatSubtasks ? "Aufwand gesamt" : "Geschätzter Aufwand"}</div>
          <div class="info-wert">{d.aufwandGesamt}h</div>
        </div>
      </div>

      {#if hatSubtasks}
        <div class="info-karte">
          <span class="info-icon">⏳</span>
          <div>
            <div class="info-titel">Verbleibend</div>
            <div class="info-wert">{d.aufwandVerbleibend}h</div>
          </div>
        </div>
      {/if}

      {#if tage > 0 && d.status !== "erledigt" && restAufwand > 0}
        <div class="info-karte">
          <span class="info-icon">📈</span>
          <div>
            <div class="info-titel">Benötigt pro Tag</div>
            <div class="info-wert">{hProTag}h / Tag</div>
          </div>
        </div>
      {/if}

      {#if d.erstellt}
        <div class="info-karte">
          <span class="info-icon">📝</span>
          <div>
            <div class="info-titel">Erfasst am</div>
            <div class="info-wert">{d.erstellt}</div>
          </div>
        </div>
      {/if}
    </div>

    <!-- FORTSCHRITT -->
    <div class="fortschritt-sektion">
      <div class="fortschritt-header">
        <span class="section-titel">
          📊 Fortschritt
          {#if hatSubtasks}
            <span class="auto-badge">automatisch</span>
          {/if}
        </span>
        <span class="fortschritt-pct">{fortschrittAnzeige}%</span>
      </div>
      <div class="fortschritt-bar-gross">
        <div
          class="fortschritt-fill-gross"
          style="width: {fortschrittAnzeige}%; background: {fortschrittFarbe}"
        ></div>
      </div>
      <div class="fortschritt-meta">
        {#if hatSubtasks}
          {subtasksErledigt.length} von {subtasks.length} Subtasks erledigt
          · {d.aufwandVerbleibend}h von {d.aufwandGesamt}h verbleibend
        {:else}
          Noch {restAufwand}h von {d.aufwand}h verbleibend
        {/if}
      </div>

      {#if !hatSubtasks && d.status !== "erledigt"}
        <form
          method="POST"
          action="?/fortschritt"
          use:enhance={() =>
            async ({ result, update }) => {
              if (result.type === "success") {
                addToast("Fortschritt gespeichert ✓");
                await update({ reset: false });
              }
            }}
        >
          <div class="slider-wrap">
            <input
              type="range"
              name="fortschritt"
              min="0"
              max="100"
              step="5"
              bind:value={fortschrittWert}
              class="range-gross"
            />
            <button type="submit" class="speichern-btn">Speichern</button>
          </div>
        </form>
      {/if}
    </div>

    <!-- SUBTASKS -->
    <div class="subtask-sektion">
      <div class="section-header">
        <span class="section-titel">✅ Subtasks</span>
        <span class="subtask-zaehler">
          {subtasksErledigt.length}/{subtasks.length}
        </span>
      </div>

      {#if form?.subtaskError}
        <div class="fehler">⚠️ {form.subtaskError}</div>
      {/if}

      {#if subtasks.length === 0}
        <p class="leer-hint">Noch keine Subtasks. Füge unten welche hinzu.</p>
      {/if}

      <!-- Offene Subtasks -->
      {#each subtasksOffen as s (s.id)}
        <div class="subtask-zeile offen">
          <form
            method="POST"
            action="?/subtaskErledigt"
            class="checkbox-form"
            use:enhance={() =>
              async ({ update }) => {
                await update({ reset: false });
              }}
          >
            <input type="hidden" name="subtaskId" value={s.id} />
            <input type="hidden" name="warErledigt" value={s.erledigt} />
            <button type="submit" class="checkbox-btn" title="Als erledigt markieren">
              <span class="checkbox-leer">☐</span>
            </button>
          </form>
          <span class="subtask-titel">{s.titel}</span>
          <span class="subtask-aufwand">{s.aufwand}h</span>
          <form
            method="POST"
            action="?/subtaskLoeschen"
            class="delete-form"
            use:enhance={({ cancel }) => {
              if (!confirm(`"${s.titel}" löschen?`)) { cancel(); return; }
              return async ({ update }) => { await update({ reset: false }); };
            }}
          >
            <input type="hidden" name="subtaskId" value={s.id} />
            <button type="submit" class="btn-delete" title="Löschen">🗑️</button>
          </form>
        </div>
      {/each}

      <!-- Erledigte Subtasks -->
      {#each subtasksErledigt as s (s.id)}
        <div class="subtask-zeile erledigt">
          <form
            method="POST"
            action="?/subtaskErledigt"
            class="checkbox-form"
            use:enhance={() =>
              async ({ update }) => {
                await update({ reset: false });
              }}
          >
            <input type="hidden" name="subtaskId" value={s.id} />
            <input type="hidden" name="warErledigt" value={s.erledigt} />
            <button type="submit" class="checkbox-btn" title="Als offen markieren">
              <span class="checkbox-voll">☑</span>
            </button>
          </form>
          <span class="subtask-titel durchgestrichen">{s.titel}</span>
          <span class="subtask-aufwand gedimmt">{s.aufwand}h</span>
          <form
            method="POST"
            action="?/subtaskLoeschen"
            class="delete-form"
            use:enhance={({ cancel }) => {
              if (!confirm(`"${s.titel}" löschen?`)) { cancel(); return; }
              return async ({ update }) => { await update({ reset: false }); };
            }}
          >
            <input type="hidden" name="subtaskId" value={s.id} />
            <button type="submit" class="btn-delete" title="Löschen">🗑️</button>
          </form>
        </div>
      {/each}

      <!-- Trennlinie + Summe wenn gemischt -->
      {#if subtasksErledigt.length > 0 && subtasksOffen.length > 0}
        <div class="subtask-trennlinie">
          <span class="subtask-summe">
            Verbleibend: <strong>{d.aufwandVerbleibend}h</strong>
            von {d.aufwandGesamt}h total
          </span>
        </div>
      {:else if subtasks.length > 0}
        <div class="subtask-summe-zeile">
          Total: <strong>{d.aufwandGesamt}h</strong>
          {#if d.aufwandVerbleibend > 0}
            · Verbleibend: <strong>{d.aufwandVerbleibend}h</strong>
          {:else}
            · Alles erledigt ✓
          {/if}
        </div>
      {/if}

      <!-- Neuer Subtask -->
      <div class="neuer-subtask">
        <form
          method="POST"
          action="?/subtaskHinzufuegen"
          use:enhance={() => {
            subtaskLaden = true;
            return async ({ update }) => {
              await update({ reset: false });
              neuerTitel = "";
              neuerAufwand = 1;
              subtaskLaden = false;
            };
          }}
          class="neuer-subtask-form"
        >
          <input
            type="text"
            name="titel"
            bind:value={neuerTitel}
            placeholder="Subtask-Titel, z.B. Aufsatz lernen"
            class="subtask-input-titel"
            required
          />
          <input
            type="number"
            name="aufwand"
            bind:value={neuerAufwand}
            min="0.1"
            max="100"
            step="0.5"
            class="subtask-input-aufwand"
            placeholder="h"
            required
          />
          <button type="submit" class="btn-hinzufuegen" disabled={subtaskLaden}>
            {subtaskLaden ? "…" : "+ Hinzufügen"}
          </button>
        </form>
      </div>
    </div>

    <!-- NOTIZEN -->
    {#if d.notizen}
      <div class="notizen-sektion">
        <div class="section-titel">📒 Notizen</div>
        <div class="notizen-text">{d.notizen}</div>
      </div>
    {/if}

  </div>
</div>

<style>
  .breadcrumb {
    font-size: 0.9rem; color: #888; margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .breadcrumb a { color: #e94560; text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }

  .detail-layout { max-width: 780px; }
  .detail-main {
    background: white; border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); overflow: hidden;
  }

  /* HEADER */
  .detail-header {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 2rem; display: flex; justify-content: space-between;
    align-items: flex-start; gap: 1rem;
  }
  h1 { margin: 0; color: white; font-size: 1.5rem; line-height: 1.3; }
  .modul-label {
    margin: 0.4rem 0 0; color: rgba(255, 255, 255, 0.65);
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .typ-tag {
    background: rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.85);
    padding: 0.15rem 0.5rem; border-radius: 10px; font-size: 0.78rem;
  }
  .header-aktionen { display: flex; gap: 0.5rem; flex-shrink: 0; align-items: center; }
  .btn-edit {
    padding: 0.5rem 1rem; background: #e94560; color: white;
    text-decoration: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; white-space: nowrap;
  }
  .btn-edit:hover { background: #c73652; }
  .btn-back {
    padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.15); color: white;
    text-decoration: none; border-radius: 8px; font-size: 0.9rem; white-space: nowrap;
  }
  .btn-back:hover { background: rgba(255, 255, 255, 0.25); }

  /* INFO-GRID */
  .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 0; }
  .info-karte {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1.25rem 1.5rem; border-bottom: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0;
  }
  .info-icon { font-size: 1.3rem; margin-top: 0.1rem; }
  .info-titel { font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
  .info-wert { font-size: 0.95rem; color: #1a1a2e; font-weight: 500; }
  .tage-karte.ok { background: #f0fff4; }
  .tage-karte.warnung { background: #fffbf0; }
  .tage-karte.kritisch { background: #fff8f0; }
  .tage-karte.ueberfaellig { background: #fff0f0; }
  .tage-karte.erledigt { background: #f0fff4; }
  .prio { padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
  .prio.hoch { background: #ffeaea; color: #e74c3c; }
  .prio.mittel { background: #fef3e2; color: #f39c12; }
  .prio.niedrig { background: #eafaf1; color: #27ae60; }
  .status-badge { padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
  .status-badge.offen { background: #eef2ff; color: #5c6bc0; }
  .status-badge.in-bearbeitung { background: #fef3e2; color: #f39c12; }
  .status-badge.erledigt { background: #eafaf1; color: #27ae60; }

  /* FORTSCHRITT */
  .fortschritt-sektion { padding: 1.5rem; border-top: 1px solid #f0f0f0; }
  .fortschritt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .section-titel { font-size: 0.88rem; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem; }
  .auto-badge {
    font-size: 0.7rem; background: #eef2ff; color: #5c6bc0;
    padding: 0.1rem 0.5rem; border-radius: 10px; font-weight: 600;
    text-transform: none; letter-spacing: 0;
  }
  .fortschritt-pct { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; }
  .fortschritt-bar-gross {
    height: 12px; background: #e0e0e0; border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem;
  }
  .fortschritt-fill-gross { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
  .fortschritt-meta { font-size: 0.85rem; color: #888; margin-bottom: 1rem; }
  .slider-wrap { display: flex; align-items: center; gap: 1rem; }
  .range-gross {
    flex: 1; accent-color: #e94560; cursor: pointer; padding: 0; border: none; background: none; height: 6px;
  }
  .speichern-btn {
    padding: 0.5rem 1.25rem; background: #e94560; color: white; border: none;
    border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; white-space: nowrap;
    font-family: inherit;
  }
  .speichern-btn:hover { background: #c73652; }

  /* SUBTASKS */
  .subtask-sektion { padding: 1.5rem; border-top: 1px solid #f0f0f0; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .subtask-zaehler {
    font-size: 0.85rem; font-weight: 700; background: #eef2ff; color: #5c6bc0;
    padding: 0.2rem 0.6rem; border-radius: 10px;
  }
  .leer-hint { color: #aaa; font-size: 0.88rem; margin: 0 0 1rem; }
  .fehler { background: #fde; color: #e74c3c; padding: 0.65rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.88rem; }

  .subtask-zeile {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 0.5rem; border-radius: 8px; transition: background 0.15s;
  }
  .subtask-zeile:hover { background: #f8f9ff; }
  .subtask-zeile.erledigt { opacity: 0.55; }

  .checkbox-form, .delete-form { margin: 0; }
  .checkbox-btn {
    background: none; border: none; cursor: pointer; padding: 0;
    font-size: 1.3rem; line-height: 1; display: flex; align-items: center;
    color: #aaa; transition: color 0.15s;
  }
  .checkbox-btn:hover { color: #27ae60; }
  .checkbox-leer { color: #ccc; }
  .checkbox-voll { color: #27ae60; }

  .subtask-titel { flex: 1; font-size: 0.92rem; color: #1a1a2e; }
  .durchgestrichen { text-decoration: line-through; color: #999; }
  .subtask-aufwand { font-size: 0.85rem; color: #888; font-weight: 600; white-space: nowrap; }
  .gedimmt { color: #bbb; }

  .btn-delete {
    background: none; border: none; cursor: pointer; padding: 0.2rem 0.3rem;
    font-size: 1rem; opacity: 0.4; transition: opacity 0.15s; border-radius: 4px;
  }
  .btn-delete:hover { opacity: 1; background: #fff0f0; }

  .subtask-trennlinie {
    border-top: 1px dashed #e0e0e0; margin: 0.75rem 0 0.5rem;
    padding-top: 0.75rem;
  }
  .subtask-summe { font-size: 0.85rem; color: #888; }
  .subtask-summe strong { color: #1a1a2e; }
  .subtask-summe-zeile { font-size: 0.85rem; color: #888; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #e0e0e0; }
  .subtask-summe-zeile strong { color: #1a1a2e; }

  .neuer-subtask { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f0f0f0; }
  .neuer-subtask-form { display: flex; gap: 0.5rem; align-items: center; }
  .subtask-input-titel {
    flex: 1; padding: 0.6rem 0.9rem; border: 2px solid #e0e0e0;
    border-radius: 8px; font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s;
  }
  .subtask-input-titel:focus { outline: none; border-color: #e94560; }
  .subtask-input-aufwand {
    width: 70px; padding: 0.6rem 0.7rem; border: 2px solid #e0e0e0;
    border-radius: 8px; font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s;
  }
  .subtask-input-aufwand:focus { outline: none; border-color: #e94560; }
  .btn-hinzufuegen {
    padding: 0.6rem 1rem; background: #1a1a2e; color: white; border: none;
    border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;
    white-space: nowrap; transition: background 0.15s; font-family: inherit;
  }
  .btn-hinzufuegen:hover:not(:disabled) { background: #e94560; }
  .btn-hinzufuegen:disabled { opacity: 0.6; cursor: not-allowed; }

  /* NOTIZEN */
  .notizen-sektion { padding: 1.5rem; border-top: 1px solid #f0f0f0; }
  .notizen-text {
    margin-top: 0.75rem; background: #f8f9ff; padding: 1rem 1.25rem;
    border-radius: 8px; font-size: 0.9rem; line-height: 1.6; color: #333;
    white-space: pre-wrap; border-left: 3px solid #5c6bc0;
  }

  /* DARK MODE */
  :global([data-theme="dark"]) .detail-main {
    background: rgba(22, 27, 34, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  :global([data-theme="dark"]) h1 { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .info-wert { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .info-karte { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"]) .fortschritt-sektion,
  :global([data-theme="dark"]) .subtask-sektion,
  :global([data-theme="dark"]) .notizen-sektion {
    border-top-color: rgba(255,255,255,0.06) !important;
  }
  :global([data-theme="dark"]) .section-titel { color: #c9d1d9 !important; }
  :global([data-theme="dark"]) .fortschritt-pct { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .fortschritt-bar-gross { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"]) .fortschritt-meta { color: #8b949e !important; }
  :global([data-theme="dark"]) .subtask-titel { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .durchgestrichen { color: #4d5566 !important; }
  :global([data-theme="dark"]) .subtask-zeile:hover { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"]) .subtask-trennlinie { border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"]) .subtask-summe-zeile { border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"]) .subtask-summe strong,
  :global([data-theme="dark"]) .subtask-summe-zeile strong { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .neuer-subtask { border-top-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .subtask-input-titel,
  :global([data-theme="dark"]) .subtask-input-aufwand {
    background: rgba(13,17,23,0.8) !important;
    border-color: rgba(255,255,255,0.12) !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"]) .btn-hinzufuegen { background: rgba(255,255,255,0.1) !important; color: #e6edf3 !important; }
  :global([data-theme="dark"]) .btn-hinzufuegen:hover:not(:disabled) { background: #e94560 !important; }
  :global([data-theme="dark"]) .btn-delete:hover { background: rgba(61,18,18,0.6) !important; }
  :global([data-theme="dark"]) .leer-hint { color: #4d5566 !important; }
  :global([data-theme="dark"]) .notizen-text { background: rgba(30,45,74,0.4) !important; color: #c9d1d9 !important; border-left-color: rgba(92,107,192,0.6) !important; }
  :global([data-theme="dark"]) .auto-badge { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }

  @media (max-width: 600px) {
    .detail-header { flex-direction: column; }
    .neuer-subtask-form { flex-wrap: wrap; }
    .subtask-input-titel { min-width: 0; }
  }
</style>
