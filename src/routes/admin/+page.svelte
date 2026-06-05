<script>
  export let data;
  export let form;
</script>

<div class="header">
  <h1>👑 Admin-Panel</h1>
  <p class="subtitle">Benutzerverwaltung</p>
</div>

<!-- Neuen User erstellen -->
<div class="card">
  <h2>Neuen Benutzer erstellen</h2>

  {#if form?.error}
    <div class="fehler">⚠️ {form.error}</div>
  {/if}

  <form method="POST" action="?/erstellen" class="inline-form">
    <input type="text" name="username" placeholder="Benutzername" required />
    <input type="password" name="password" placeholder="Passwort" required />
    <select name="role">
      <option value="user">👤 User</option>
      <option value="admin">👑 Admin</option>
    </select>
    <button type="submit" class="btn-primary">+ Erstellen</button>
  </form>
</div>

<!-- Benutzerliste -->
<div class="card">
  <h2>Alle Benutzer ({data.users.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Benutzername</th>
        <th>Rolle</th>
        <th>Erstellt</th>
        <th>Aktion</th>
      </tr>
    </thead>
    <tbody>
      {#each data.users as user}
        <tr>
          <td><strong>{user.username}</strong></td>
          <td>
            <span class="rolle {user.role}">
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </td>
          <td>{user.erstellt}</td>
          <td>
            {#if user.username !== 'admin'}
              <form method="POST" action="?/loeschen">
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" class="btn-delete">🗑️ Löschen</button>
              </form>
            {:else}
              <span class="geschuetzt">🔒 Geschützt</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .header { margin-bottom: 1.5rem; }
  h1 { margin: 0; color: #1a1a2e; }
  .subtitle { color: #666; margin: 0.25rem 0 0; }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-bottom: 1.5rem;
  }

  h2 { margin: 0 0 1rem; color: #1a1a2e; font-size: 1.1rem; }

  .inline-form {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .inline-form input, .inline-form select {
    padding: 0.65rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    flex: 1;
    min-width: 150px;
  }

  .inline-form input:focus, .inline-form select:focus {
    outline: none;
    border-color: #e94560;
  }

  .btn-primary {
    padding: 0.65rem 1.5rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-primary:hover { background: #c73652; }

  table { width: 100%; border-collapse: collapse; }
  th {
    background: #1a1a2e;
    color: white;
    padding: 0.9rem 1rem;
    text-align: left;
  }
  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover { background: #f8f9ff; }

  .rolle {
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .rolle.admin { background: #fef3e2; color: #f39c12; }
  .rolle.user { background: #eef2ff; color: #5c6bc0; }

  .btn-delete {
    background: #fde;
    color: #e74c3c;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .btn-delete:hover { background: #f5c6cb; }

  .geschuetzt { color: #999; font-size: 0.85rem; }

  .fehler {
    background: #fde;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style>