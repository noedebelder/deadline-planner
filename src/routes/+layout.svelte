<script>
  import { page, navigating } from "$app/stores";
  import { onMount } from "svelte";
  import Toast from "$lib/Toast.svelte";
  export let data;

  let darkMode = true;
  let notifOffen = false;
  let userMenuOffen = false;

  let aiOffen = true;
  let aiInput = "";
  let loading = false;
  let ungeleseneNachrichten = 0;
  let messages = [
    {
      role: "assistant",
      content: "👋 Hallo! Ich bin dein KI-Assistent.\nIch kenne deine Deadlines und helfe dir beim Planen!"
    }
  ];

  function neuesGespraech() {
    messages = [{
      role: 'assistant',
      content: '👋 Hallo! Neues Gespräch gestartet. Wie kann ich helfen?'
    }];
  }

  onMount(() => {
    const saved = localStorage.getItem("theme") || "dark";
    darkMode = saved === "dark";
    document.documentElement.setAttribute("data-theme", saved);
  });

  function toggleTheme() {
    darkMode = !darkMode;
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function toggleNotif() {
    notifOffen = !notifOffen;
    if (notifOffen) userMenuOffen = false;
  }

  function toggleUserMenu() {
    userMenuOffen = !userMenuOffen;
    if (userMenuOffen) notifOffen = false;
  }

  function toggleAI() {
    aiOffen = !aiOffen;
    if (aiOffen) {
      ungeleseneNachrichten = 0;
      setTimeout(scrollToBottom, 100);
    }
  }

  function scrollToBottom() {
    const el = document.getElementById("aiMessages");
    if (el) el.scrollTop = el.scrollHeight;
  }

  async function aiSenden() {
    if (!aiInput.trim() || loading) return;
    const text = aiInput.trim();
    aiInput = "";
    messages = [...messages, { role: "user", content: text }];
    loading = true;
    setTimeout(scrollToBottom, 50);

    const history = messages
      .slice(1, -1)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });
      const responseData = await res.json();
      messages = [
        ...messages,
        {
          role: "assistant",
          content: responseData.reply || responseData.error || "Unbekannter Fehler"
        }
      ];
      if (!aiOffen) ungeleseneNachrichten++;
    } catch {
      messages = [
        ...messages,
        { role: "assistant", content: "❌ Verbindungsfehler. Bitte versuche es erneut." }
      ];
    }
    loading = false;
    setTimeout(scrollToBottom, 50);
  }

  function quickSend(text) {
    aiInput = text;
    aiSenden();
  }

  function aiKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      aiSenden();
    }
  }
</script>

<svelte:window on:click={() => { notifOffen = false; userMenuOffen = false; }} />

{#if $navigating}
  <div class="progress-bar"></div>
{/if}

<Toast />

<div class="bg-blobs" aria-hidden="true">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
</div>

{#if data.user}
  <div class="app-layout">

    <!-- ═══ OBERE LEISTE ═══ -->
    <header class="navbar-top">
      <div class="nav-brand">
        <span class="brand-icon">📅</span>
        <span class="brand-name">Deadline Planner</span>
      </div>

      <div class="nav-top-actions">

        <!-- Benachrichtigungen -->
        <div class="notification-menu">
          <button
            class="icon-btn"
            class:aktiv={notifOffen}
            on:click|stopPropagation={toggleNotif}
            title="Benachrichtigungen"
            type="button"
          >
            🔔
            {#if (data.baldFaellig ?? 0) > 0}
              <span class="badge">{data.baldFaellig}</span>
            {/if}
          </button>

          {#if notifOffen}
            <div class="notif-dropdown">
              <div class="notif-kopf">
                <span class="notif-kopf-titel">Benachrichtigungen</span>
                <span class="notif-kopf-zaehler {(data.benachrichtigungen?.length ?? 0) === 0 ? 'leer' : ''}">
                  {data.benachrichtigungen?.length ?? 0}
                </span>
              </div>
              {#if !(data.benachrichtigungen?.length)}
                <div class="notif-leer">✅ Keine dringenden Deadlines</div>
              {:else}
                <div class="notif-liste">
                  {#each data.benachrichtigungen as n}
                    <a
                      href="/deadline/{n.id}"
                      class="notif-zeile {n.typ}"
                      on:click={() => (notifOffen = false)}
                    >
                      <span class="notif-typ-icon">
                        {#if n.typ === "ueberfaellig"}🔴{:else if n.typ === "heute"}🟠{:else}🟡{/if}
                      </span>
                      <div class="notif-info">
                        <p class="notif-name">{n.titel}</p>
                        <p class="notif-meta">
                          {n.modul} ·
                          {#if n.tage < 0}
                            Überfällig seit {Math.abs(n.tage)} Tag{Math.abs(n.tage) !== 1 ? "en" : ""}
                          {:else if n.tage === 0}
                            Heute fällig!
                          {:else}
                            In {n.tage} Tag{n.tage !== 1 ? "en" : ""} fällig
                          {/if}
                        </p>
                      </div>
                      <span class="notif-pfeil">→</span>
                    </a>
                  {/each}
                </div>
                <a href="/" class="notif-footer-link" on:click={() => (notifOffen = false)}>
                  Alle Deadlines ansehen →
                </a>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Theme Toggle -->
        <button class="theme-toggle" on:click={toggleTheme} title="Design wechseln" type="button">
          {#if darkMode}☀️{:else}🌙{/if}
        </button>

        <!-- Neue Deadline -->
        <a href="/neu" class="btn-primary">+ Neue Deadline</a>

        <!-- User Dropdown -->
        <div class="user-menu">
          <button
            class="user-btn"
            class:offen={userMenuOffen}
            on:click|stopPropagation={toggleUserMenu}
            type="button"
          >
            <span class="user-avatar">{data.user?.username?.[0]?.toUpperCase() ?? "?"}</span>
            <span class="user-name">{data.user?.username}</span>
            <span class="chevron">▾</span>
          </button>
          {#if userMenuOffen}
            <div class="user-dropdown">
              <a href="/einstellungen" on:click={() => (userMenuOffen = false)}>⚙️ Einstellungen</a>
              {#if data.user?.role === "admin"}
                <a href="/admin" on:click={() => (userMenuOffen = false)}>👑 Admin-Panel</a>
              {/if}
              <div class="dropdown-divider"></div>
              <form method="POST" action="/logout">
                <button type="submit">🚪 Abmelden</button>
              </form>
            </div>
          {/if}
        </div>

      </div>
    </header>

    <!-- ═══ TAB-LEISTE ═══ -->
    <nav class="navbar-tabs">
      <a href="/" class:active={$page.url.pathname === "/"}>🏠 Übersicht</a>
      {#if data.navbarSettings?.tagesplanung !== false}
        <a href="/tagesplanung" class:active={$page.url.pathname === "/tagesplanung"}>📋 Tagesplanung</a>
      {/if}
      {#if data.navbarSettings?.kalender !== false}
        <a href="/kalender" class:active={$page.url.pathname === "/kalender"}>📅 Kalender</a>
      {/if}
      {#if data.navbarSettings?.module !== false}
        <a href="/module" class:active={$page.url.pathname === "/module"}>📚 Module</a>
      {/if}
      {#if data.navbarSettings?.statistik !== false}
        <a href="/statistik" class:active={$page.url.pathname === "/statistik"}>📊 Statistik</a>
      {/if}
      {#if data.navbarSettings?.archiv !== false}
        <a href="/archiv" class:active={$page.url.pathname === "/archiv"}>🗂️ Archiv</a>
      {/if}
    </nav>

    <!-- ═══ HAUPTINHALT ═══ -->
    <main class="main-content">
      {#key $page.url.pathname}
        <div class="page-content">
          <slot />
        </div>
      {/key}
    </main>

  </div>

  <!-- ═══ FLOATING KI-ASSISTENT (fixed, ausserhalb app-layout) ═══ -->
  <div class="ai-widget">
    {#if aiOffen}
      <div class="ai-panel">
        <div class="ai-header">
          <div class="ai-header-info">
            <span class="ai-avatar-icon">🤖</span>
            <div>
              <p class="ai-title">KI-Assistent</p>
              <p class="ai-status">● Online</p>
            </div>
          </div>
          <div class="ai-header-rechts">
            <button on:click={neuesGespraech} class="ai-neu" type="button" title="Neues Gespräch">🔄</button>
            <button on:click={toggleAI} class="ai-close" type="button">✕</button>
          </div>
        </div>

        <div class="ai-messages" id="aiMessages">
          {#each messages as msg}
            <div class="ai-message {msg.role}">
              <p>{msg.content}</p>
            </div>
          {/each}
          {#if loading}
            <div class="ai-message assistant">
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          {/if}
        </div>

        {#if messages.length <= 1}
          <div class="ai-suggestions">
            <button on:click={() => quickSend("Erstelle mir einen Tagesplan für heute")} type="button">
              📅 Tagesplan
            </button>
            <button on:click={() => quickSend("Was sollte ich zuerst angehen?")} type="button">
              🎯 Priorität
            </button>
            <button on:click={() => quickSend("Ich habe 2 Stunden Zeit, was empfiehlst du?")} type="button">
              ⏱️ 2h Zeit
            </button>
          </div>
        {/if}

        <div class="ai-input-area">
          <textarea
            bind:value={aiInput}
            on:keydown={aiKeydown}
            placeholder="Frage den KI-Assistenten..."
            rows="2"
          ></textarea>
          <button on:click={aiSenden} disabled={loading} class="ai-send" type="button">➤</button>
        </div>
      </div>
    {/if}

    <button class="ai-toggle" on:click={toggleAI} title="KI-Assistent" type="button">
      {#if aiOffen}
        <span>✕</span>
      {:else}
        <span>🤖</span>
        {#if ungeleseneNachrichten > 0}
          <span class="ai-badge">{ungeleseneNachrichten}</span>
        {/if}
      {/if}
    </button>
  </div>

{:else}
  <!-- ═══ NICHT EINGELOGGT: Kein Navbar ═══ -->
  <main class="no-auth-main">
    {#key $page.url.pathname}
      <div class="page-content">
        <slot />
      </div>
    {/key}
  </main>
{/if}

<style>
  /* ══════════════════════════════════════════
     CSS VARIABLEN (Hell / Dunkel)
  ══════════════════════════════════════════ */
  :global(:root) {
    --nav-bg: #ffffff;
    --nav-border: #e5e7eb;
    --text-primary: #1a1a2e;
    --text-secondary: #6b7280;
    --hover-bg: #f3f4f6;
    --toggle-bg: #f9fafb;
    --dropdown-bg: #ffffff;
    --page-bg: #f0f2f5;
    --card-bg: #ffffff;
  }
  :global([data-theme="dark"]) {
    --nav-bg: #1a1a2e;
    --nav-border: rgba(255,255,255,0.08);
    --text-primary: #ffffff;
    --text-secondary: rgba(255,255,255,0.6);
    --hover-bg: rgba(255,255,255,0.08);
    --toggle-bg: rgba(255,255,255,0.06);
    --dropdown-bg: #16213e;
    --page-bg: #0d1117;
    --card-bg: #1a1a2e;
  }

  /* ══════════════════════════════════════════
     GLOBAL RESET + TYPOGRAPHY
  ══════════════════════════════════════════ */
  :global(*) { box-sizing: border-box; }

  :global(body) {
    margin: 0;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    font-size: 0.95rem;
    line-height: 1.6;
    background: var(--page-bg);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  :global(h1) { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 0.25rem; }
  :global(h2) { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.01em; }
  :global(h3) { font-size: 1.1rem; font-weight: 700; }
  :global(button) { font-family: inherit; }
  :global(input), :global(select), :global(textarea) {
    font-family: inherit;
    font-size: 0.95rem;
  }

  /* ══════════════════════════════════════════
     BACKGROUND BLOBS
  ══════════════════════════════════════════ */
  .bg-blobs {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    overflow: hidden; opacity: 0;
    transition: opacity 0.5s ease;
  }
  :global([data-theme="dark"]) .bg-blobs { opacity: 1; }

  .blob { position: absolute; border-radius: 50%; filter: blur(80px); }
  .blob-1 {
    width: 700px; height: 700px; top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%);
  }
  .blob-2 {
    width: 600px; height: 600px; bottom: -100px; left: -150px;
    background: radial-gradient(circle, rgba(92,107,192,0.2) 0%, transparent 70%);
  }
  .blob-3 {
    width: 400px; height: 400px; top: 40%; right: 25%;
    background: radial-gradient(circle, rgba(39,174,96,0.12) 0%, transparent 70%);
  }

  /* ══════════════════════════════════════════
     PROGRESS BAR
  ══════════════════════════════════════════ */
  .progress-bar {
    position: fixed; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #e94560, #ff6b6b, #e94560);
    background-size: 200% 100%;
    z-index: 10000;
    animation: progress-anim 1.2s ease-in-out infinite;
  }
  @keyframes progress-anim {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* ══════════════════════════════════════════
     APP LAYOUT
  ══════════════════════════════════════════ */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  /* ══════════════════════════════════════════
     OBERE NAVBAR
  ══════════════════════════════════════════ */
  .navbar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    height: 56px;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    flex-shrink: 0;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
    text-decoration: none;
    white-space: nowrap;
  }
  .brand-icon { font-size: 20px; }

  .nav-top-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Benachrichtigungs-Icon */
  .icon-btn {
    position: relative;
    background: var(--toggle-bg);
    border: 1px solid var(--nav-border);
    cursor: pointer;
    font-size: 18px;
    padding: 6px 8px;
    border-radius: 8px;
    transition: background 0.2s;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
  }
  .icon-btn:hover { background: var(--hover-bg); }
  .icon-btn.aktiv {
    background: rgba(233,69,96,0.12);
    border-color: rgba(233,69,96,0.3);
  }

  .badge {
    position: absolute;
    top: -4px; right: -4px;
    background: #e94560;
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 50%;
    width: 17px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--nav-bg);
    animation: badgePuls 2s ease-in-out infinite;
    line-height: 1;
  }
  @keyframes badgePuls {
    0%, 100% { box-shadow: 0 0 0 0 rgba(233,69,96,0.5); }
    50% { box-shadow: 0 0 0 4px rgba(233,69,96,0); }
  }

  /* Theme Toggle */
  .theme-toggle {
    background: var(--toggle-bg);
    border: 1px solid var(--nav-border);
    border-radius: 8px;
    padding: 0 10px;
    height: 36px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    color: var(--text-primary);
  }
  .theme-toggle:hover { background: var(--hover-bg); }

  /* Neue Deadline Button */
  .btn-primary {
    background: #e94560;
    color: white;
    padding: 0 16px;
    height: 36px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    white-space: nowrap;
    transition: background 0.2s;
    display: flex;
    align-items: center;
  }
  .btn-primary:hover { background: #c73652; }

  /* User Menu */
  .user-menu { position: relative; }
  .user-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--toggle-bg);
    border: 1px solid var(--nav-border);
    border-radius: 8px;
    padding: 0 12px;
    height: 36px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: background 0.2s;
  }
  .user-btn:hover,
  .user-btn.offen { background: var(--hover-bg); }

  .user-avatar {
    width: 24px;
    height: 24px;
    background: #e94560;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 11px;
    flex-shrink: 0;
  }
  .user-name { font-weight: 500; }
  .chevron { opacity: 0.5; font-size: 0.75rem; }

  .user-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: var(--dropdown-bg);
    border: 1px solid var(--nav-border);
    border-radius: 10px;
    padding: 6px;
    min-width: 190px;
    z-index: 200;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: dropIn 0.15s ease;
  }
  .user-dropdown a,
  .user-dropdown button {
    display: block;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.15s, color 0.15s;
  }
  .user-dropdown a:hover,
  .user-dropdown button:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }
  .user-dropdown form { margin: 0; padding: 0; }
  .dropdown-divider {
    height: 1px;
    background: var(--nav-border);
    margin: 4px 0;
  }

  /* ══════════════════════════════════════════
     BENACHRICHTIGUNGS-DROPDOWN
  ══════════════════════════════════════════ */
  .notification-menu { position: relative; }

  .notif-dropdown {
    position: absolute;
    right: 0; top: calc(100% + 8px);
    width: 320px;
    background: var(--dropdown-bg);
    border: 1px solid var(--nav-border);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    overflow: hidden;
    animation: dropIn 0.15s ease;
    z-index: 200;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .notif-kopf {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--nav-border);
  }
  .notif-kopf-titel { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
  .notif-kopf-zaehler {
    background: #e94560; color: white;
    font-size: 0.7rem; font-weight: 700;
    padding: 0.15rem 0.55rem; border-radius: 20px;
    min-width: 22px; text-align: center;
  }
  .notif-kopf-zaehler.leer { background: var(--hover-bg); color: var(--text-secondary); }

  .notif-leer {
    padding: 1.75rem 1rem;
    text-align: center; color: var(--text-secondary); font-size: 0.875rem;
  }

  .notif-liste { max-height: 300px; overflow-y: auto; }
  .notif-liste::-webkit-scrollbar { width: 4px; }
  .notif-liste::-webkit-scrollbar-track { background: transparent; }
  .notif-liste::-webkit-scrollbar-thumb { background: var(--nav-border); border-radius: 2px; }

  .notif-zeile {
    display: flex; align-items: flex-start; gap: 0.65rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--nav-border);
    text-decoration: none; color: inherit;
    transition: background 0.12s;
  }
  .notif-zeile:last-child { border-bottom: none; }
  .notif-zeile:hover { background: var(--hover-bg); }
  .notif-zeile.ueberfaellig { border-left: 3px solid #e74c3c; }
  .notif-zeile.heute { border-left: 3px solid #f39c12; }
  .notif-zeile.bald { border-left: 3px solid #f1c40f; }

  .notif-typ-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
  .notif-info { flex: 1; min-width: 0; }
  .notif-name {
    font-size: 0.875rem; font-weight: 600; color: var(--text-primary);
    margin: 0 0 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .notif-meta { font-size: 0.75rem; color: var(--text-secondary); margin: 0; }
  .notif-zeile.ueberfaellig .notif-name { color: #e74c3c; }
  .notif-zeile.heute .notif-name { color: #e67e22; }
  .notif-pfeil { color: var(--text-secondary); font-size: 0.85rem; align-self: center; flex-shrink: 0; opacity: 0.4; }

  .notif-footer-link {
    display: block; text-align: center;
    padding: 0.7rem; font-size: 0.82rem;
    color: #e94560; text-decoration: none; font-weight: 600;
    border-top: 1px solid var(--nav-border);
    background: var(--hover-bg);
    transition: background 0.12s;
  }
  .notif-footer-link:hover { filter: brightness(0.95); }

  /* ══════════════════════════════════════════
     TAB-LEISTE
  ══════════════════════════════════════════ */
  .navbar-tabs {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    position: sticky;
    top: 56px;
    z-index: 99;
    overflow-x: auto;
    scrollbar-width: none;
    flex-shrink: 0;
  }
  .navbar-tabs::-webkit-scrollbar { display: none; }

  .navbar-tabs a {
    color: var(--text-secondary);
    text-decoration: none;
    padding: 12px 14px;
    font-size: 0.875rem;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .navbar-tabs a:hover { color: var(--text-primary); }
  .navbar-tabs a.active {
    color: #e94560;
    border-bottom-color: #e94560;
    font-weight: 600;
  }

  /* ══════════════════════════════════════════
     HAUPTINHALT
  ══════════════════════════════════════════ */
  .main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .no-auth-main {
    min-height: 100vh;
    position: relative; z-index: 1;
  }

  .page-content {
    animation: pageIn 0.2s ease-out both;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ══════════════════════════════════════════
     INTERACTIVE GLOBALS
  ══════════════════════════════════════════ */
  :global(.card), :global(.stat-card), :global(.modul-karte), :global(.zusammenfassung) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  :global(.badge.rot) {
    animation: pulseBadge 2s ease-in-out infinite;
  }
  @keyframes pulseBadge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0.5); }
    50% { box-shadow: 0 0 0 4px rgba(231,76,60,0); }
  }
  :global(.badge.kritisch) { box-shadow: 0 0 10px rgba(243,156,18,0.4); }

  /* ══════════════════════════════════════════
     FLOATING KI-ASSISTENT
  ══════════════════════════════════════════ */
  .ai-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .ai-toggle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #e94560;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 22px;
    box-shadow: 0 4px 20px rgba(233,69,96,0.4);
    transition: all 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ai-toggle:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 24px rgba(233,69,96,0.55);
  }

  .ai-badge {
    position: absolute;
    top: -2px; right: -2px;
    background: #f39c12;
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 50%;
    width: 18px; height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ai-panel {
    width: 340px;
    height: 480px;
    background: var(--card-bg);
    border: 1px solid var(--nav-border);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 48px rgba(0,0,0,0.25);
    animation: slideUp 0.2s ease;
    overflow: hidden;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #e94560;
    color: white;
    flex-shrink: 0;
  }
  .ai-header-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ai-avatar-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .ai-title { font-weight: 700; font-size: 0.9rem; margin: 0; }
  .ai-status { font-size: 0.75rem; margin: 0; opacity: 0.85; }
  .ai-header-rechts {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ai-neu,
  .ai-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 6px;
    line-height: 1;
  }
  .ai-neu:hover,
  .ai-close:hover { background: rgba(255,255,255,0.2); }

  .ai-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scroll-behavior: smooth;
  }
  .ai-messages::-webkit-scrollbar { width: 4px; }
  .ai-messages::-webkit-scrollbar-track { background: transparent; }
  .ai-messages::-webkit-scrollbar-thumb { background: var(--nav-border); border-radius: 2px; }

  .ai-message {
    max-width: 85%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .ai-message p { margin: 0; white-space: pre-wrap; }

  .ai-message.user {
    background: #e94560;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .ai-message.assistant {
    background: var(--hover-bg);
    color: var(--text-primary);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }

  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 0;
  }
  .typing-dots span {
    width: 7px; height: 7px;
    background: var(--text-secondary);
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  .ai-suggestions {
    padding: 8px 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex-shrink: 0;
    border-top: 1px solid var(--nav-border);
  }
  .ai-suggestions button {
    background: var(--hover-bg);
    border: 1px solid var(--nav-border);
    color: var(--text-secondary);
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ai-suggestions button:hover {
    background: #e94560;
    color: white;
    border-color: #e94560;
  }

  .ai-input-area {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid var(--nav-border);
    align-items: flex-end;
    flex-shrink: 0;
  }
  .ai-input-area textarea {
    flex: 1;
    background: var(--hover-bg);
    border: 1px solid var(--nav-border);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 0.85rem;
    color: var(--text-primary);
    resize: none;
    font-family: inherit;
    line-height: 1.4;
  }
  .ai-input-area textarea:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233,69,96,0.12);
  }
  .ai-input-area textarea::placeholder { color: var(--text-secondary); }
  .ai-send {
    width: 36px; height: 36px;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .ai-send:hover { background: #c73652; }
  .ai-send:disabled { background: #999; cursor: not-allowed; }

  /* ══════════════════════════════════════════
     DARK MODE — GLOBAL (Kindseiten)
  ══════════════════════════════════════════ */
  :global([data-theme="dark"] .stat-card),
  :global([data-theme="dark"] .tabelle-container),
  :global([data-theme="dark"] .leer),
  :global([data-theme="dark"] .card),
  :global([data-theme="dark"] .modul-karte),
  :global([data-theme="dark"] .zusammenfassung),
  :global([data-theme="dark"] .tages-karte) {
    background: rgba(22,27,34,0.85) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
    color: #e6edf3;
  }
  :global([data-theme="dark"] .detail-main) {
    background: rgba(22,27,34,0.9) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }
  :global([data-theme="dark"] main form) {
    background: rgba(22,27,34,0.85) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }
  :global([data-theme="dark"] .login-card) {
    background: rgba(22,27,34,0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6) !important;
  }
  :global([data-theme="dark"] .mock-window) {
    background: rgba(13,17,23,0.95) !important;
    border-color: rgba(255,255,255,0.1) !important;
  }

  :global([data-theme="dark"] h1),
  :global([data-theme="dark"] h2),
  :global([data-theme="dark"] h3),
  :global([data-theme="dark"] .stat-zahl) { color: #e6edf3 !important; }

  :global([data-theme="dark"] .subtitle),
  :global([data-theme="dark"] .stat-label),
  :global([data-theme="dark"] .info-label),
  :global([data-theme="dark"] .modul-label),
  :global([data-theme="dark"] .karte-modul),
  :global([data-theme="dark"] .karte-datum),
  :global([data-theme="dark"] .keine-zeile),
  :global([data-theme="dark"] .leer-hint),
  :global([data-theme="dark"] .geschuetzt),
  :global([data-theme="dark"] .features-sub),
  :global([data-theme="dark"] .feature-card p),
  :global([data-theme="dark"] .optional),
  :global([data-theme="dark"] .tages-modul),
  :global([data-theme="dark"] .modul-meta),
  :global([data-theme="dark"] .dl-datum),
  :global([data-theme="dark"] .fortschritt-meta),
  :global([data-theme="dark"] .leer p) { color: #8b949e !important; }

  :global([data-theme="dark"] main label) { color: #c9d1d9 !important; }

  :global([data-theme="dark"] td),
  :global([data-theme="dark"] td strong),
  :global([data-theme="dark"] .info-wert),
  :global([data-theme="dark"] .karte-titel),
  :global([data-theme="dark"] .tages-titel),
  :global([data-theme="dark"] .modul-name),
  :global([data-theme="dark"] .dl-titel strong) { color: #e6edf3 !important; }

  :global([data-theme="dark"] td) { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] tr:hover) { background: rgba(255,255,255,0.03) !important; }

  :global([data-theme="dark"] input),
  :global([data-theme="dark"] select),
  :global([data-theme="dark"] textarea) {
    background: rgba(13,17,23,0.8) !important;
    border-color: rgba(255,255,255,0.12) !important;
    color: #e6edf3 !important;
  }
  :global([data-theme="dark"] input:focus),
  :global([data-theme="dark"] select:focus),
  :global([data-theme="dark"] textarea:focus) { border-color: #e94560 !important; box-shadow: 0 0 0 3px rgba(233,69,96,0.15) !important; }
  :global([data-theme="dark"] input::placeholder),
  :global([data-theme="dark"] textarea::placeholder) { color: #4d5566 !important; }
  :global([data-theme="dark"] .suche-input) { background: rgba(22,27,34,0.9) !important; }

  :global([data-theme="dark"] .btn-icon) { background: rgba(255,255,255,0.06) !important; color: #e6edf3 !important; border: 1px solid rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .btn-icon:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .abbrechen) { background: rgba(255,255,255,0.06) !important; color: #c9d1d9 !important; border: 1px solid rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .abbrechen:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .archiv-link),
  :global([data-theme="dark"] .zurueck-link),
  :global([data-theme="dark"] .export-btn) {
    background: rgba(255,255,255,0.06) !important; color: #c9d1d9 !important;
    border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: none !important;
  }
  :global([data-theme="dark"] .archiv-link:hover),
  :global([data-theme="dark"] .zurueck-link:hover),
  :global([data-theme="dark"] .export-btn:hover) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .suche-clear) { color: #4d5566 !important; }
  :global([data-theme="dark"] .info-karte) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .tabs) { border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .tabs button:not(.active)) { background: rgba(255,255,255,0.04) !important; color: #8b949e !important; }
  :global([data-theme="dark"] .deadline-karte) { background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .deadline-karte:hover) { background: rgba(22,27,34,0.95) !important; border-color: #e94560 !important; }
  :global([data-theme="dark"] .deadline-karte.status-erledigt) { background: rgba(13,17,23,0.5) !important; }
  :global([data-theme="dark"] .monat-section) { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .stats-mini) { background: rgba(13,17,23,0.6) !important; }
  :global([data-theme="dark"] .tage-karte.ok) { background: rgba(10,31,17,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.warnung) { background: rgba(31,26,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.kritisch) { background: rgba(31,21,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.ueberfaellig) { background: rgba(31,10,10,0.8) !important; }
  :global([data-theme="dark"] .tage-karte.erledigt) { background: rgba(10,31,17,0.8) !important; }
  :global([data-theme="dark"] .user-badge) { background: rgba(255,255,255,0.06) !important; color: #8b949e !important; }
  :global([data-theme="dark"] .fehler) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .erfolg) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .breadcrumb) { color: #8b949e !important; }
  :global([data-theme="dark"] .rolle.admin),
  :global([data-theme="dark"] .rolle-badge.admin) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .rolle.user),
  :global([data-theme="dark"] .rolle-badge.user) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .prio.hoch),
  :global([data-theme="dark"] .karte-prio.prio-hoch) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .prio.mittel),
  :global([data-theme="dark"] .karte-prio.prio-mittel) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .prio.niedrig),
  :global([data-theme="dark"] .karte-prio.prio-niedrig) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .status-badge.offen),
  :global([data-theme="dark"] .karte-status.status-badge-offen) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .status-badge.in-bearbeitung),
  :global([data-theme="dark"] .karte-status.status-badge-in-bearbeitung) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .status-badge.erledigt),
  :global([data-theme="dark"] .karte-status.status-badge-erledigt) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .badge.rot) { background: rgba(61,18,18,0.9) !important; color: #f87171 !important; border: 1px solid rgba(231,76,60,0.3) !important; }
  :global([data-theme="dark"] .badge.orange) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .badge.kritisch) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; box-shadow: 0 0 10px rgba(243,156,18,0.2) !important; }
  :global([data-theme="dark"] .badge.warnung) { background: rgba(61,48,18,0.8) !important; color: #fde047 !important; }
  :global([data-theme="dark"] .badge.ok) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .tage-badge.ueberfaellig) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .tage-badge.heute) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .tage-badge.kritisch) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; }
  :global([data-theme="dark"] .tage-badge.warnung) { background: rgba(61,48,18,0.8) !important; color: #fde047 !important; }
  :global([data-theme="dark"] .tage-badge.ok) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; }
  :global([data-theme="dark"] .btn-delete) { background: rgba(61,18,18,0.6) !important; color: #f87171 !important; }
  :global([data-theme="dark"] .btn-delete:hover) { background: rgba(90,26,26,0.8) !important; }
  :global([data-theme="dark"] .login-card h1) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .login-card p) { color: #8b949e !important; }
  :global([data-theme="dark"] .inline-form input),
  :global([data-theme="dark"] .inline-form select) { background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.12) !important; color: #e6edf3 !important; }
  :global([data-theme="dark"] .feature-card) { background: rgba(22,27,34,0.85) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"] .feature-card h3) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .warnung-banner.gefahr) { background: rgba(61,18,18,0.8) !important; color: #f87171 !important; border-color: rgba(231,76,60,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.warnung) { background: rgba(61,42,18,0.8) !important; color: #fbbf24 !important; border-color: rgba(243,156,18,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.info) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; border-color: rgba(92,107,192,0.4) !important; }
  :global([data-theme="dark"] .warnung-banner.erfolg) { background: rgba(18,61,26,0.8) !important; color: #4ade80 !important; border-color: rgba(39,174,96,0.4) !important; }
  :global([data-theme="dark"] .fortschritt-popup) { background: rgba(22,27,34,0.95) !important; border-color: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .mini-bar-bg) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .tages-karte) { background: rgba(22,27,34,0.85) !important; border-left-color: rgba(255,255,255,0.12); }
  :global([data-theme="dark"] .tages-karte:hover) { background: rgba(30,36,50,0.95) !important; box-shadow: 0 6px 24px rgba(0,0,0,0.4) !important; }
  :global([data-theme="dark"] .tages-gruppe h3) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .gruppe-leer) { color: #8b949e !important; }
  :global([data-theme="dark"] .modul-header:hover) { background: rgba(255,255,255,0.04) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile) { border-bottom-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .modul-deadline-zeile:hover) { background: rgba(255,255,255,0.03) !important; }
  :global([data-theme="dark"] .toggle-icon) { color: #555 !important; }
  :global([data-theme="dark"] .mini-bar) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-mini) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .fortschritt-bar-gross) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .notizen-text) { background: rgba(30,45,74,0.4) !important; color: #c9d1d9 !important; border-color: rgba(92,107,192,0.4) !important; }
  :global([data-theme="dark"] .fortschritt-sektion) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .notizen-sektion) { border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"] .zf-divider) { background: rgba(255,255,255,0.1) !important; }
  :global([data-theme="dark"] .zf-zahl) { color: #e6edf3 !important; }
  :global([data-theme="dark"] .typ-pill) { background: rgba(30,45,74,0.8) !important; color: #93c5fd !important; }
  :global([data-theme="dark"] .leer-emoji) { filter: grayscale(0.2); }

  /* ══════════════════════════════════════════
     MOBILE
  ══════════════════════════════════════════ */
  @media (max-width: 768px) {
    .navbar-top { padding: 0 1rem; }
    .user-name { display: none; }
    .brand-name { display: none; }
    .btn-primary { padding: 0 10px; font-size: 0.8rem; }
    .main-content { padding: 1rem; }
    .notif-dropdown { width: 290px; right: -8px; }
    .user-dropdown { right: 0; }
    .ai-panel { width: calc(100vw - 2rem); }
    .ai-widget { right: 1rem; bottom: 1rem; }
  }

  @media (max-width: 480px) {
    :global(h1) { font-size: 1.6rem; }
    .main-content { padding: 0.75rem; }
    .notif-dropdown { width: calc(100vw - 2rem); right: -4rem; }
    .nav-top-actions { gap: 4px; }
  }
</style>
