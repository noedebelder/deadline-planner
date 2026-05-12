<script>
  let erfolg = false;
</script>

<h1>Neue Deadline erfassen</h1>

<form method="POST">
  <label>
    Titel
    <input type="text" name="titel" required />
  </label>

  <label>
    Modul
    <input type="text" name="modul" required />
  </label>

  <label>
    Deadline
    <input type="date" name="deadline" required />
  </label>

  <label>
    Geschätzter Aufwand (Stunden)
    <input type="number" name="aufwand" min="1" required />
  </label>

  <label>
    Priorität
    <select name="prioritaet">
      <option value="hoch">Hoch</option>
      <option value="mittel">Mittel</option>
      <option value="niedrig">Niedrig</option>
    </select>
  </label>

  <button type="submit">Speichern</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-weight: bold;
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  button:hover {
    background: #34495e;
  }
</style>
