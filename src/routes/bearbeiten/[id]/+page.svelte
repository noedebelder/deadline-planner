<script>
  import { enhance } from '$app/forms';
  export let data;
  let laden = false;
</script>

<div class="breadcrumb">
  <a href="/">Übersicht</a> <span>›</span> <span>Bearbeiten</span>
</div>

<h1>Deadline bearbeiten</h1>

<form
  method="POST"
  use:enhance={() => {
    laden = true;
    return async ({ update }) => {
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

  <label>
    Deadline
    <input type="date" name="deadline" value={data.deadline.deadline} required />
  </label>

  <label>
    Geschätzter Aufwand (Stunden)
    <input type="number" name="aufwand" value={data.deadline.aufwand} min="1" required />
  </label>

  <label>
    Priorität
    <select name="prioritaet">
      <option value="hoch" selected={data.deadline.prioritaet === 'hoch'}>🔴 Hoch</option>
      <option value="mittel" selected={data.deadline.prioritaet === 'mittel'}>🟡 Mittel</option>
      <option value="niedrig" selected={data.deadline.prioritaet === 'niedrig'}>🟢 Niedrig</option>
    </select>
  </label>

  <label>
    Status
    <select name="status">
      <option value="offen" selected={data.deadline.status === 'offen'}>📋 Offen</option>
      <option value="in-bearbeitung" selected={data.deadline.status === 'in-bearbeitung'}>⚙️ In Bearbeitung</option>
      <option value="erledigt" selected={data.deadline.status === 'erledigt'}>✅ Erledigt</option>
    </select>
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
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .breadcrumb a { color: #e94560; text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }

  h1 { color: #1a1a2e; margin-bottom: 1.5rem; }

  form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    max-width: 550px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    color: #333;
  }

  input, select {
    padding: 0.7rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #e94560;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  button {
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
  }

  button:hover:not(:disabled) { background: #c73652; }
  button:disabled { opacity: 0.7; cursor: not-allowed; }

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
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
