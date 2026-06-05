<script>
  export let form;
</script>

<div class="login-wrap">
  <div class="login-card">
    <div class="login-logo">📅</div>
    <h1>Deadline Planner</h1>
    <p class="subtitle">Melde dich an um fortzufahren</p>

    {#if form?.error}
      <div class="fehler">⚠️ {form.error}</div>
    {/if}

    <form method="POST">
      <label>
        Benutzername
        <input type="text" name="username" required placeholder="admin" />
      </label>
      <label>
        Passwort
        <input
          type="password"
          name="password"
          required
          placeholder="••••••••"
        />
      </label>
      <button type="submit">Anmelden →</button>
    </form>
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
    max-width: 400px;
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
  .subtitle {
    color: #888;
    margin: 0.5rem 0 1.5rem;
  }

  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
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

  button {
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

  button:hover {
    background: #c73652;
  }
</style>
