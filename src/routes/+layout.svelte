<nav>
  <a href="/">Übersicht</a>
  <a href="/neu">Neue Deadline</a>
</nav>

<main>
  <slot />
</main>

<style>
  nav {
    background: #2c3e50;
    padding: 1rem 2rem;
    display: flex;
    gap: 2rem;
  }

  nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }

  main {
    padding: 2rem;
  }
</style>
