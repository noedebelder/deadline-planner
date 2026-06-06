<script>
  import { enhance } from "$app/forms";
  export let data;
  export let form;

  let ladenProfil = false;
  let ladenPasswort = false;
  let ladenBenach = false;
  let ladenStandard = false;
</script>

<div class="header">
  <h1>⚙️ Einstellungen</h1>
  <p class="subtitle">Profil, Benachrichtigungen und Standardwerte</p>
</div>

<div class="einstellungen-grid">

  <!-- PROFIL -->
  <section class="card">
    <h2>👤 Profil</h2>

    {#if form?.profilSuccess}
      <div class="erfolg">✅ Profil gespeichert!</div>
    {/if}
    {#if form?.profilError}
      <div class="fehler">⚠️ {form.profilError}</div>
    {/if}

    <form method="POST" action="?/profil" use:enhance={() => {
      ladenProfil = true;
      return async ({ update }) => { await update(); ladenProfil = false; };
    }}>
      <label>
        Anzeigename
        <input type="text" name="username" value={data.profil.username} required minlength="3" />
      </label>
      <label>
        E-Mail-Adresse
        <input type="email" name="email" value={data.profil.email} required />
      </label>
      <button type="submit" class="btn-primary" disabled={ladenProfil}>
        {ladenProfil ? "Speichern…" : "💾 Speichern"}
      </button>
    </form>
  </section>

  <!-- PASSWORT -->
  <section class="card">
    <h2>🔒 Passwort ändern</h2>

    {#if form?.passwortSuccess}
      <div class="erfolg">✅ Passwort geändert!</div>
    {/if}
    {#if form?.passwortError}
      <div class="fehler">⚠️ {form.passwortError}</div>
    {/if}

    <form method="POST" action="?/passwort" use:enhance={() => {
      ladenPasswort = true;
      return async ({ update }) => { await update(); ladenPasswort = false; };
    }}>
      <label>
        Aktuelles Passwort
        <input type="password" name="altes_passwort" required placeholder="••••••••" />
      </label>
      <label>
        Neues Passwort <small>(min. 8 Zeichen, 1 Grossbuchstabe, 1 Zahl)</small>
        <input type="password" name="neues_passwort" required placeholder="••••••••" minlength="8" />
      </label>
      <label>
        Passwort bestätigen
        <input type="password" name="bestaetigen" required placeholder="••••••••" minlength="8" />
      </label>
      <button type="submit" class="btn-primary" disabled={ladenPasswort}>
        {ladenPasswort ? "Speichern…" : "🔒 Passwort ändern"}
      </button>
    </form>
  </section>

  <!-- BENACHRICHTIGUNGEN -->
  <section class="card">
    <h2>🔔 Benachrichtigungen</h2>
    <p class="card-sub">E-Mail-Benachrichtigungen (erfordert gesetzten RESEND_API_KEY)</p>

    {#if form?.benachrichtigungenSuccess}
      <div class="erfolg">✅ Benachrichtigungen gespeichert!</div>
    {/if}

    <form method="POST" action="?/benachrichtigungen" use:enhance={() => {
      ladenBenach = true;
      return async ({ update }) => { await update(); ladenBenach = false; };
    }}>
      <div class="toggle-gruppe">
        <label class="toggle-zeile">
          <div class="toggle-text">
            <span class="toggle-titel">Hohe Priorität</span>
            <span class="toggle-sub">E-Mail wenn neue Deadline mit Priorität "hoch" erstellt wird</span>
          </div>
          <input type="checkbox" name="highPriority" class="toggle-input"
            checked={data.notificationSettings.highPriority} />
        </label>
        <label class="toggle-zeile">
          <div class="toggle-text">
            <span class="toggle-titel">Überfällige Deadlines</span>
            <span class="toggle-sub">E-Mail bei Deadlines die in ≤ 3 Tagen fällig sind</span>
          </div>
          <input type="checkbox" name="overdue" class="toggle-input"
            checked={data.notificationSettings.overdue} />
        </label>
        <label class="toggle-zeile">
          <div class="toggle-text">
            <span class="toggle-titel">Tägliche Zusammenfassung</span>
            <span class="toggle-sub">Jeden Morgen eine Übersicht aller offenen Deadlines</span>
          </div>
          <input type="checkbox" name="dailySummary" class="toggle-input"
            checked={data.notificationSettings.dailySummary} />
        </label>
      </div>
      <button type="submit" class="btn-primary" disabled={ladenBenach}>
        {ladenBenach ? "Speichern…" : "💾 Speichern"}
      </button>
    </form>
  </section>

  <!-- STANDARD-EINSTELLUNGEN -->
  <section class="card">
    <h2>📋 Standard-Einstellungen</h2>
    <p class="card-sub">Voreinstellungen für neue Deadlines</p>

    {#if form?.standardSuccess}
      <div class="erfolg">✅ Einstellungen gespeichert!</div>
    {/if}

    <form method="POST" action="?/standard" use:enhance={() => {
      ladenStandard = true;
      return async ({ update }) => { await update(); ladenStandard = false; };
    }}>
      <label>
        Standard-Priorität
        <select name="defaultPriority">
          <option value="hoch" selected={data.settings.defaultPriority === "hoch"}>Hoch</option>
          <option value="mittel" selected={data.settings.defaultPriority === "mittel"}>Mittel</option>
          <option value="niedrig" selected={data.settings.defaultPriority === "niedrig"}>Niedrig</option>
        </select>
      </label>
      <label>
        Standard-Status
        <select name="defaultStatus">
          <option value="offen" selected={data.settings.defaultStatus === "offen"}>Offen</option>
          <option value="in-bearbeitung" selected={data.settings.defaultStatus === "in-bearbeitung"}>In Bearbeitung</option>
        </select>
      </label>
      <label>
        Sprache / Language
        <select name="language">
          <option value="de" selected={data.settings.language === "de"}>🇩🇪 Deutsch</option>
          <option value="en" selected={data.settings.language === "en"}>🇬🇧 English</option>
        </select>
      </label>
      <button type="submit" class="btn-primary" disabled={ladenStandard}>
        {ladenStandard ? "Speichern…" : "💾 Speichern"}
      </button>
    </form>
  </section>

</div>

<style>
  .header { margin-bottom: 1.5rem; }
  h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }

  .einstellungen-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 750px) {
    .einstellungen-grid { grid-template-columns: 1fr; }
  }

  .card {
    background: white;
    border-radius: 14px;
    padding: 1.75rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  }

  h2 { margin: 0 0 0.25rem; color: #1a1a2e; font-size: 1.1rem; }
  .card-sub { color: #888; font-size: 0.82rem; margin: 0 0 1.25rem; }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    font-size: 0.88rem;
    color: #333;
  }
  label small { font-weight: 400; color: #aaa; font-size: 0.78rem; }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  select {
    padding: 0.7rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
    background: white;
    color: #1a1a2e;
  }
  input:focus, select:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
  }

  .btn-primary {
    padding: 0.75rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
  }
  .btn-primary:hover:not(:disabled) { background: #c73652; }
  .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  .erfolg {
    background: #eafaf1;
    color: #27ae60;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    font-size: 0.88rem;
    margin-bottom: 0.25rem;
  }

  /* Toggle-Switches */
  .toggle-gruppe {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-zeile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0.9rem;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    cursor: pointer;
    font-weight: normal;
    transition: background 0.15s;
  }
  .toggle-zeile:hover { background: #fafbff; }

  .toggle-text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .toggle-titel {
    font-weight: 600;
    font-size: 0.88rem;
    color: #1a1a2e;
  }
  .toggle-sub {
    font-size: 0.78rem;
    color: #888;
    font-weight: 400;
  }

  .toggle-input {
    appearance: none;
    -webkit-appearance: none;
    width: 42px;
    height: 24px;
    border: none !important;
    border-radius: 12px;
    background: #ddd;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
    padding: 0 !important;
  }
  .toggle-input::after {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  .toggle-input:checked {
    background: #e94560;
  }
  .toggle-input:checked::after {
    transform: translateX(18px);
  }

  /* Dark Mode */
  :global([data-theme="dark"]) .card {
    background: rgba(22, 27, 34, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  :global([data-theme="dark"]) h2 { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .card-sub { color: #8b949e !important; }
  :global([data-theme="dark"]) label { color: #c9d1d9 !important; }
  :global([data-theme="dark"]) input[type="text"],
  :global([data-theme="dark"]) input[type="email"],
  :global([data-theme="dark"]) input[type="password"],
  :global([data-theme="dark"]) input[type="number"],
  :global([data-theme="dark"]) select {
    background: rgba(13, 17, 23, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"]) .toggle-zeile {
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global([data-theme="dark"]) .toggle-zeile:hover {
    background: rgba(255, 255, 255, 0.04) !important;
  }
  :global([data-theme="dark"]) .toggle-titel { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .toggle-sub { color: #8b949e !important; }
  :global([data-theme="dark"]) .toggle-input { background: rgba(255,255,255,0.15) !important; border: none !important; }
  :global([data-theme="dark"]) .toggle-input:checked { background: #e94560 !important; }
  :global([data-theme="dark"]) .erfolg { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"]) .fehler { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
</style>
