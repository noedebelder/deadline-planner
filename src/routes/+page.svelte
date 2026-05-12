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
      </tr>
    </thead>
    <tbody>
      {#each data.deadlines as d}
        <tr>
          <td>{d.titel}</td>
          <td>{d.modul}</td>
          <td>{d.deadline}</td>
          <td>{d.aufwand}</td>
          <td>{d.prioritaet}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
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
</style>