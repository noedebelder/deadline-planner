<script>
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/toast.js";
  export let data;
  export let form;
  let laden = false;
  let fortschrittWert = 0;
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
        <option value="Prüfung" selected={data.defaults.typ === "Prüfung"}>📝 Prüfung</option>
        <option value="Projekt" selected={data.defaults.typ === "Projekt"}>🔨 Projekt</option>
        <option value="Übung" selected={data.defaults.typ === "Übung"}>📚 Übung</option>
        <option value="Seminararbeit" selected={data.defaults.typ === "Seminararbeit"}>📄 Seminararbeit</option>
        <option value="Sonstiges" selected={data.defaults.typ === "Sonstiges" || !data.defaults.typ}>📌 Sonstiges</option>
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
        <option value="hoch" selected={data.defaults.prioritaet === "hoch"}>🔴 Hoch</option>
        <option value="mittel" selected={data.defaults.prioritaet === "mittel"}>🟡 Mittel</option>
        <option value="niedrig" selected={data.defaults.prioritaet === "niedrig"}>🟢 Niedrig</option>
      </select>
    </label>
  </div>

  <label>
    Status
    <select name="status">
      <option value="offen" selected={data.defaults.status === "offen"}>📋 Offen</option>
      <option value="in-bearbeitung" selected={data.defaults.status === "in-bearbeitung"}>⚙️ In Bearbeitung</option>
      <option value="erledigt" selected={data.defaults.status === "erledigt"}>✅ Erledigt</option>
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
</style>
