<script>
  import { page } from "$app/stores";
  export let data;
</script>

<div class="app">
  <nav>
    <div class="nav-brand">📅 Deadline Planner</div>
    <div class="nav-links">
      <a href="/" class:active={$page.url.pathname === "/"}>Übersicht</a>
      <a href="/statistik" class:active={$page.url.pathname === "/statistik"}
        >Statistik</a
      >
      {#if data.user?.role === "admin"}
        <a href="/admin" class:active={$page.url.pathname === "/admin"}
          >👑 Admin</a
        >
      {/if}
      <a href="/neu" class="nav-btn">+ Neue Deadline</a>
      <div class="user-info">
        <span>👤 {data.user?.username}</span>
        <form method="POST" action="/logout">
          <button type="submit" class="logout-btn">Abmelden</button>
        </form>
      </div>
    </div>
  </nav>

  <main>
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: #f0f2f5;
    color: #1a1a2e;
  }
  :global(*) {
    box-sizing: border-box;
  }

  .app {
    min-height: 100vh;
  }

  nav {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .nav-brand {
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: white;
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-btn {
    background: #e94560 !important;
    color: white !important;
  }

  .nav-btn:hover {
    background: #c73652 !important;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    padding-left: 1rem;
  }

  .logout-btn {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  main {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 0 1.5rem;
  }
</style>
