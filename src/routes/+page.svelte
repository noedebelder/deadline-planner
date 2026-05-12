<script>
  export let data;
</script>

<h1>Meine Deadlines</h1>

{#if data.deadlines.length === 0}
  <p>Noch keine Deadlines erfasst. <a href="/neu">Jetzt hinzufügen</a></p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Titel</th>
        <th>Modul</th>
        <th>Deadline</th>
        <th>Aufwand (h)</th>
        <th>Priorität</th>
        <th>Aktion</th>
      </tr>
    </thead>
    <tbody>
      {#each data.deadlines as d}
        <tr>
          <td>{d.titel}</td>
          <td>{d.modul}</td>
          <td>{d.deadline}</td>
          <td>{d.aufwand}</td>
          <td class="prioritaet {d.prioritaet}">{d.prioritaet}</td>
          <td>
            <form method="POST" action="?/loeschen">
              <input type="hidden" name="id" value={d.id} />
              <button type="submit">🗑️ Löschen</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<a href="/neu" class="neu-btn">+ Neue Deadline</a>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  th,
  td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background: #2c3e50;
    color: white;
  }
  tr:nth-child(even) {
    background: #f9f9f9;
  }
  .prioritaet.hoch {
    color: #e74c3c;
    font-weight: bold;
  }
  .prioritaet.mittel {
    color: #f39c12;
    font-weight: bold;
  }
  .prioritaet.niedrig {
    color: #27ae60;
    font-weight: bold;
  }
  button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #c0392b;
  }
  .neu-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #2c3e50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  .neu-btn:hover {
    background: #34495e;
  }
</style>
