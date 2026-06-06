<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let form;
  let laden = false;
  let fortschrittWert = 0;

  let subtasks = [];

  function subtaskHinzufuegen() {
    subtasks = [...subtasks, { titel: "", aufwand: "", datum: "" }];
  }

  function subtaskEntfernen(i) {
    subtasks = subtasks.filter((_, idx) => idx !== i);
  }
</script>

<h1>Neue Deadline erfassen</h1>

{#if form?.error}
  <div class="fehler">⚠️ {form.error}</div>
{/if}

<form
  method="POST"
  use:enhance={() => {
    laden = true;
    return async ({ result, update }) => {
      if (result.type === "redirect") {
        addToast("Deadline erfolgreich gespeichert ✓");
      } else if (result.type === "failure") {
        addToast(result.data?.error ?? "Fehler beim Speichern", "error");
      }
      await update();
      laden = false;
    };
  }}
>
  <!-- Subtasks als JSON übertragen -->
  <input type="hidden" name="subtasksJson" value={JSON.stringify(subtasks)} />

  <label>
    Titel
    <input type="text" name="titel" placeholder="z.B. Projektarbeit Prototyping" required />
  </label>

  <label>
    Modul
    <input type="text" name="modul" placeholder="z.B. Prototyping" required />
  </label>

  <div class="zwei-spalten">
    <label>
      Typ
      <select name="typ">
        <option value="Prüfung">📝 Prüfung</option>
        <option value="Projekt">🔨 Projekt</option>
        <option value="Übung">📚 Übung</option>
        <option value="Seminararbeit">📄 Seminararbeit</option>
        <option value="Sonstiges" selected>📌 Sonstiges</option>
      </select>
    </label>

    <label>
      Deadline
      <input type="date" name="deadline" required />
    </label>
  </div>

  <div class="zwei-spalten">
    <label>
      Aufwand (Stunden)
      <input type="number" name="aufwand" min="1" placeholder="z.B. 5" required />
    </label>

    <label>
      Priorität
      <select name="prioritaet">
        <option value="hoch">🔴 Hoch</option>
        <option value="mittel" selected>🟡 Mittel</option>
        <option value="niedrig">🟢 Niedrig</option>
      </select>
    </label>
  </div>

  <label>
    Status
    <select name="status">
      <option value="offen" selected>📋 Offen</option>
      <option value="in-bearbeitung">⚙️ In Bearbeitung</option>
      <option value="erledigt">✅ Erledigt</option>
    </select>
  </label>

  <label>
    Fortschritt: <strong>{fortschrittWert}%</strong>
    <input
      type="range"
      name="fortschritt"
      min="0"
      max="100"
      step="5"
      bind:value={fortschrittWert}
      class="range-input"
    />
    <div class="mini-bar">
      <div class="mini-fill" style="width: {fortschrittWert}%"></div>
    </div>
  </label>

  <label>
    Notizen <span class="optional">(optional, max. 500 Zeichen)</span>
    <textarea
      name="notizen"
      rows="3"
      maxlength="500"
      placeholder="Anmerkungen, Hinweise, Links..."
    ></textarea>
  </label>

  <!-- ══════════════ SUBTASKS ══════════════ -->
  <div class="subtask-bereich">
    <div class="subtask-kopf">
      <span class="subtask-titel">📌 Subtasks</span>
      <span class="subtask-anzahl">{subtasks.length} Subtask{subtasks.length !== 1 ? "s" : ""}</span>
    </div>

    {#each subtasks as st, i}
      <div class="subtask-zeile">
        <div class="subtask-felder">
          <input
            type="text"
            placeholder="Subtask-Titel"
            bind:value={st.titel}
            class="st-titel"
            required
          />
          <input
            type="number"
            placeholder="Std."
            bind:value={st.aufwand}
            min="0"
            step="0.5"
            class="st-aufwand"
            title="Aufwand in Stunden"
          />
          <input
            type="date"
            bind:value={st.datum}
            class="st-datum"
            title="Geplantes Datum"
          />
        </div>
        <button
          type="button"
          class="st-entfernen"
          on:click={() => subtaskEntfernen(i)}
          title="Subtask entfernen"
        >✕</button>
      </div>
    {/each}

    <button type="button" class="btn-subtask-add" on:click={subtaskHinzufuegen}>
      + Subtask hinzufügen
    </button>
  </div>

  <div class="buttons">
    <a href="/" class="abbrechen">Abbrechen</a>
    <button type="submit" disabled={laden}>
      {#if laden}
        <span class="spinner"></span> Speichern...
      {:else}
        💾 Speichern
      {/if}
    </button>
  </div>
</form>

<style>
  h1 { color: #1a1a2e; margin-bottom: 1.5rem; }
  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    max-width: 580px;
  }
  form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    max-width: 580px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    color: #333;
  }
  .optional { font-weight: 400; font-size: 0.82rem; color: #999; }
  .zwei-spalten {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  input, select, textarea {
    padding: 0.7rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
    resize: vertical;
  }
  input:focus, select:focus, textarea:focus { outline: none; border-color: #e94560; }
  .range-input {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    accent-color: #e94560;
    height: 6px;
  }
  .mini-bar {
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.25rem;
  }
  .mini-fill {
    height: 100%;
    background: linear-gradient(90deg, #e94560, #ff6b6b);
    border-radius: 3px;
    transition: width 0.2s;
  }

  /* ══════ SUBTASKS ══════ */
  .subtask-bereich {
    border: 1.5px solid #e8eaed;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #fafbff;
  }
  .subtask-kopf {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .subtask-titel {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1a1a2e;
  }
  .subtask-anzahl {
    font-size: 0.78rem;
    color: #888;
    background: #eef2ff;
    padding: 0.15rem 0.55rem;
    border-radius: 20px;
  }
  .subtask-zeile {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }
  .subtask-felder {
    display: grid;
    grid-template-columns: 1fr 70px 130px;
    gap: 0.5rem;
    flex: 1;
  }
  .st-titel, .st-aufwand, .st-datum {
    padding: 0.55rem 0.75rem;
    font-size: 0.88rem;
  }
  .st-aufwand { text-align: center; }
  .st-entfernen {
    background: #ffeaea;
    border: 1px solid rgba(231,76,60,0.2);
    color: #e74c3c;
    border-radius: 7px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: background 0.15s;
  }
  .st-entfernen:hover { background: #ffd4d4; }
  .btn-subtask-add {
    background: none;
    border: 1.5px dashed #5c6bc0;
    color: #5c6bc0;
    border-radius: 8px;
    padding: 0.55rem;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.15s;
    font-family: inherit;
  }
  .btn-subtask-add:hover {
    background: #eef2ff;
    border-style: solid;
  }

  .buttons { display: flex; gap: 1rem; margin-top: 0.5rem; }
  button[type="submit"] {
    flex: 1;
    padding: 0.8rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s;
  }
  button[type="submit"]:hover:not(:disabled) { background: #c73652; }
  button[type="submit"]:disabled { opacity: 0.7; cursor: not-allowed; }
  .abbrechen {
    flex: 1;
    padding: 0.8rem;
    background: #f0f2f5;
    color: #333;
    text-decoration: none;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
  }
  .abbrechen:hover { background: #e0e2e5; }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 560px) {
    .subtask-felder { grid-template-columns: 1fr; }
  }
</style>
