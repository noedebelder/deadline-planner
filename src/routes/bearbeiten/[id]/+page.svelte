<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let data;
  let laden = false;
  let fortschrittWert = data.deadline.fortschritt;
</script>

<div class="breadcrumb">
  <a href="/">Übersicht</a> <span>›</span> <span>Bearbeiten</span>
</div>

<h1>Deadline bearbeiten</h1>

<form
  method="POST"
  use:enhance={() => {
    laden = true;
    return async ({ result, update }) => {
      if (result.type === "redirect") {
        addToast("Deadline gespeichert ✓");
      } else if (result.type === "failure" || result.type === "error") {
        addToast("Fehler beim Speichern", "error");
      }
      await update();
      laden = false;
    };
  }}
>
  <label>
    Titel
    <input type="text" name="titel" value={data.deadline.titel} required />
  </label>

  <label>
    Modul
    <input type="text" name="modul" value={data.deadline.modul} required />
  </label>

  <div class="zwei-spalten">
    <label>
      Typ
      <select name="typ">
        <option value="Prüfung" selected={data.deadline.typ === "Prüfung"}>📝 Prüfung</option>
        <option value="Projekt" selected={data.deadline.typ === "Projekt"}>🔨 Projekt</option>
        <option value="Übung" selected={data.deadline.typ === "Übung"}>📚 Übung</option>
        <option value="Seminararbeit" selected={data.deadline.typ === "Seminararbeit"}>📄 Seminararbeit</option>
        <option value="Sonstiges" selected={data.deadline.typ === "Sonstiges" || !data.deadline.typ}>📌 Sonstiges</option>
      </select>
    </label>

    <label>
      Deadline
      <input type="date" name="deadline" value={data.deadline.deadline} required />
    </label>
  </div>

  <div class="zwei-spalten">
    <label>
      Aufwand (Stunden)
      <input type="number" name="aufwand" value={data.deadline.aufwand} min="1" required />
    </label>

    <label>
      Priorität
      <select name="prioritaet">
        <option value="hoch" selected={data.deadline.prioritaet === "hoch"}>🔴 Hoch</option>
        <option value="mittel" selected={data.deadline.prioritaet === "mittel"}>🟡 Mittel</option>
        <option value="niedrig" selected={data.deadline.prioritaet === "niedrig"}>🟢 Niedrig</option>
      </select>
    </label>
  </div>

  <label>
    Status
    <select name="status">
      <option value="offen" selected={data.deadline.status === "offen"}>📋 Offen</option>
      <option value="in-bearbeitung" selected={data.deadline.status === "in-bearbeitung"}>⚙️ In Bearbeitung</option>
      <option value="erledigt" selected={data.deadline.status === "erledigt"}>✅ Erledigt</option>
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
    >{data.deadline.notizen}</textarea>
  </label>

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
  .breadcrumb {
    font-size: 0.9rem; color: #888; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .breadcrumb a { color: #e94560; text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }
  h1 { color: #1a1a2e; margin-bottom: 1.5rem; }
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
  label { display: flex; flex-direction: column; gap: 0.4rem; font-weight: 600; color: #333; }
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
  .buttons { display: flex; gap: 1rem; margin-top: 0.5rem; }
  button {
    flex: 1; padding: 0.8rem;
    background: #e94560; color: white; border: none;
    border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  button:hover:not(:disabled) { background: #c73652; }
  button:disabled { opacity: 0.7; cursor: not-allowed; }
  .abbrechen {
    flex: 1; padding: 0.8rem; background: #f0f2f5; color: #333;
    text-decoration: none; border-radius: 8px; text-align: center; font-weight: 600;
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
</style>
