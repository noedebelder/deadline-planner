<script>
  export let form;
  let tab = form?.tab === 'register' ? 'register' : 'login';
</script>

<div class="login-wrap">
  <div class="login-card">
    <div class="login-logo">📅</div>
    <h1>Deadline Planner</h1>

    <div class="tabs">
      <button class:active={tab === 'login'} on:click={() => (tab = 'login')} type="button">
        Anmelden
      </button>
      <button class:active={tab === 'register'} on:click={() => (tab = 'register')} type="button">
        Registrieren
      </button>
    </div>

    {#if tab === 'login'}
      <p class="subtitle">Mit deinem Konto anmelden</p>
      {#if form?.loginError}
        <div class="fehler">⚠️ {form.loginError}</div>
      {/if}
      <form method="POST" action="?/anmelden">
        <label>
          E-Mail-Adresse
          <input type="email" name="email" required placeholder="name@beispiel.ch" autocomplete="email" />
        </label>
        <label>
          Passwort
          <input type="password" name="password" required placeholder="••••••••" autocomplete="current-password" />
        </label>
        <button type="submit">Anmelden →</button>
      </form>
    {:else}
      <p class="subtitle">Neues Konto erstellen</p>
      {#if form?.registerError}
        <div class="fehler">⚠️ {form.registerError}</div>
      {/if}
      <form method="POST" action="?/registrieren">
        <label>
          Anzeigename <small>(min. 3 Zeichen)</small>
          <input type="text" name="username" required placeholder="Mein Name" autocomplete="name" />
        </label>
        <label>
          E-Mail-Adresse
          <input type="email" name="email" required placeholder="name@beispiel.ch" autocomplete="email" />
        </label>
        <label>
          Passwort <small>(min. 8 Zeichen, 1 Grossbuchstabe, 1 Zahl)</small>
          <input type="password" name="password" required placeholder="••••••••" autocomplete="new-password" minlength="8" />
        </label>
        <button type="submit">Konto erstellen →</button>
      </form>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
  .login-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  .login-logo {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  h1 {
    margin: 0;
    color: #1a1a2e;
    font-size: 1.6rem;
  }
  .tabs {
    display: flex;
    margin: 1.5rem 0 0;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e0e0e0;
  }
  .tabs button {
    flex: 1;
    padding: 0.6rem;
    background: white;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: #888;
    transition: all 0.2s;
  }
  .tabs button.active {
    background: #1a1a2e;
    color: white;
  }
  .subtitle {
    color: #888;
    margin: 1rem 0 1.25rem;
    font-size: 0.9rem;
  }
  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-align: left;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
  }
  label small {
    font-weight: 400;
    color: #aaa;
    font-size: 0.8rem;
  }
  input {
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  input:focus {
    outline: none;
    border-color: #e94560;
  }
  button[type="submit"] {
    padding: 0.85rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s;
  }
  button[type="submit"]:hover {
    background: #c73652;
  }
</style>
