<script>
  import { enhance } from '$app/forms';
  export let data;
  export let form;

  let laden = false;
</script>

<div class="header">
  <h1>👤 Profil</h1>
  <p class="subtitle">Kontoinformationen und Einstellungen</p>
</div>

<div class="grid">
  <!-- Profil-Info -->
  <div class="card">
    <h2>Kontoinformationen</h2>
    <div class="info-liste">
      <div class="info-zeile">
        <span class="info-label">Anzeigename</span>
        <span class="info-wert"><strong>{data.profil.username}</strong></span>
      </div>
      <div class="info-zeile">
        <span class="info-label">E-Mail</span>
        <span class="info-wert">{data.profil.email || '—'}</span>
      </div>
      <div class="info-zeile">
        <span class="info-label">Rolle</span>
        <span class="info-wert">
          <span class="rolle-badge {data.profil.role}">
            {data.profil.role === 'admin' ? '👑 Administrator' : '👤 Benutzer'}
          </span>
        </span>
      </div>
      <div class="info-zeile">
        <span class="info-label">Mitglied seit</span>
        <span class="info-wert">{data.profil.erstellt}</span>
      </div>
    </div>

    <div class="stats-mini">
      <div class="stat">
        <span class="stat-zahl">{data.profil.anzahlDeadlines}</span>
        <span class="stat-label">Deadlines total</span>
      </div>
      <div class="stat">
        <span class="stat-zahl gruen">{data.profil.anzahlErledigt}</span>
        <span class="stat-label">Erledigt</span>
      </div>
      <div class="stat">
        <span class="stat-zahl blau">{data.profil.anzahlDeadlines - data.profil.anzahlErledigt}</span>
        <span class="stat-label">Aktiv</span>
      </div>
    </div>
  </div>

  <!-- Passwort ändern -->
  <div class="card">
    <h2>Passwort ändern</h2>

    {#if form?.success}
      <div class="erfolg">✅ Passwort erfolgreich geändert!</div>
    {/if}
    {#if form?.error}
      <div class="fehler">⚠️ {form.error}</div>
    {/if}

    <form
      method="POST"
      action="?/passwort"
      use:enhance={() => {
        laden = true;
        return async ({ update }) => {
          await update();
          laden = false;
        };
      }}
    >
      <label>
        Aktuelles Passwort
        <input type="password" name="altes_passwort" required placeholder="••••••••" />
      </label>
      <label>
        Neues Passwort <small>(min. 8 Zeichen, 1 Grossbuchstabe, 1 Zahl)</small>
        <input type="password" name="neues_passwort" required placeholder="••••••••" minlength="8" />
      </label>
      <button type="submit" disabled={laden}>
        {#if laden}
          <span class="spinner"></span> Speichern...
        {:else}
          🔒 Passwort ändern
        {/if}
      </button>
    </form>
  </div>
</div>

<style>
  .header { margin-bottom: 1.5rem; }
  h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 700px) {
    .grid { grid-template-columns: 1fr; }
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  h2 { margin: 0 0 1.25rem; color: #1a1a2e; font-size: 1.1rem; }

  .info-liste {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .info-zeile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .info-zeile:last-child { border-bottom: none; }

  .info-label { color: #888; font-size: 0.9rem; }
  .info-wert { font-size: 0.95rem; }

  .rolle-badge {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .rolle-badge.admin { background: #fef3e2; color: #f39c12; }
  .rolle-badge.user { background: #eef2ff; color: #5c6bc0; }

  .stats-mini {
    display: flex;
    gap: 1rem;
    background: #f8f9ff;
    border-radius: 8px;
    padding: 1rem;
  }

  .stat {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .stat-zahl {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a1a2e;
  }
  .stat-zahl.gruen { color: #27ae60; }
  .stat-zahl.blau { color: #3498db; }
  .stat-label { font-size: 0.78rem; color: #888; }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
  }
  label small { font-weight: 400; color: #aaa; }

  input {
    padding: 0.7rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  input:focus { outline: none; border-color: #e94560; }

  button {
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

  .erfolg {
    background: #eafaf1;
    color: #27ae60;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

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
