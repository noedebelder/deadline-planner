<script>
  import { enhance } from '$app/forms';
  let laden = false;
</script>

<h1>Neue Deadline erfassen</h1>

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
    <input type="text" name="titel" placeholder="z.B. Projektarbeit Prototyping" required />
  </label>

  <label>
    Modul
    <input type="text" name="modul" placeholder="z.B. Prototyping" required />
  </label>

  <label>
    Deadline
    <input type="date" name="deadline" required />
  </label>

  <label>
    Geschätzter Aufwand (Stunden)
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

  <label>
    Status
    <select name="status">
      <option value="offen" selected>📋 Offen</option>
      <option value="in-bearbeitung">⚙️ In Bearbeitung</option>
      <option value="erledigt">✅ Erledigt</option>
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
  h1 { color: #1a1a2e; margin-bottom: 1.5rem; }

  form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
    transition: background 0.2s;
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
