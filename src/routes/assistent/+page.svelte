<script>
  import { afterUpdate } from "svelte";

  const WILLKOMMEN = {
    role: "assistant",
    content:
      "👋 Hallo! Ich bin dein KI-Assistent. Ich kenne deine aktuellen Deadlines und helfe dir beim Planen.\n\nBeispiele:\n• \"Erstelle mir einen Tagesplan für heute\"\n• \"Welche Deadline sollte ich zuerst angehen?\"\n• \"Ich habe 3 Stunden Zeit, was empfiehlst du?\"",
  };

  const VORSCHLAEGE = [
    "📅 Tagesplan für heute",
    "🎯 Was zuerst angehen?",
    "⏱️ Ich habe 2h Zeit",
    "📊 Wie stehe ich diese Woche?",
  ];

  let nachrichten = [WILLKOMMEN];
  let input = "";
  let laden = false;
  let fehler = "";
  let chatRef;

  afterUpdate(() => {
    if (chatRef) chatRef.scrollTop = chatRef.scrollHeight;
  });

  async function senden() {
    if (!input.trim() || laden) return;
    const text = input.trim();
    input = "";
    fehler = "";

    nachrichten = [...nachrichten, { role: "user", content: text }];
    laden = true;

    // History: alles ausser Willkommen und aktuelle User-Nachricht
    const history = nachrichten.slice(1, -1).slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        fehler = data.error ?? "Unbekannter Fehler";
      } else {
        nachrichten = [...nachrichten, { role: "assistant", content: data.reply }];
      }
    } catch {
      fehler = "Verbindungsfehler. Bitte überprüfe deine Internetverbindung.";
    }

    laden = false;
  }

  function vorschlagKlicken(text) {
    input = text;
    senden();
  }

  function keydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      senden();
    }
  }

  function zuruecksetzen() {
    nachrichten = [WILLKOMMEN];
    fehler = "";
    input = "";
  }
</script>

<div class="seiten-header">
  <div>
    <h1>🤖 KI-Assistent</h1>
    <p class="subtitle">Dein persönlicher Studien-Coach – kennt deine Deadlines</p>
  </div>
  <button class="btn-reset" on:click={zuruecksetzen} title="Gespräch zurücksetzen" type="button">
    🔄 Zurücksetzen
  </button>
</div>

<div class="chat-wrapper">
  <!-- Vorschlag-Buttons -->
  <div class="vorschlaege">
    {#each VORSCHLAEGE as v}
      <button class="vorschlag-btn" on:click={() => vorschlagKlicken(v)} disabled={laden} type="button">
        {v}
      </button>
    {/each}
  </div>

  <!-- Chat-Bereich -->
  <div class="chat-container" bind:this={chatRef}>
    {#each nachrichten as msg, i (i)}
      <div class="bubble-wrap {msg.role}">
        {#if msg.role === "assistant"}
          <div class="avatar">🤖</div>
        {/if}
        <div class="bubble {msg.role}">
          {#each msg.content.split("\n") as zeile}
            <span>{zeile}</span><br />
          {/each}
        </div>
        {#if msg.role === "user"}
          <div class="avatar user-avatar">👤</div>
        {/if}
      </div>
    {/each}

    {#if laden}
      <div class="bubble-wrap assistant">
        <div class="avatar">🤖</div>
        <div class="bubble assistant loading-bubble">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    {/if}

    {#if fehler}
      <div class="fehler-banner">⚠️ {fehler}</div>
    {/if}
  </div>

  <!-- Eingabe -->
  <div class="eingabe-bereich">
    <textarea
      bind:value={input}
      on:keydown={keydown}
      placeholder="Schreib eine Nachricht… (Enter = senden, Shift+Enter = neue Zeile)"
      rows="2"
      disabled={laden}
      class="eingabe-feld"
    ></textarea>
    <button class="senden-btn" on:click={senden} disabled={laden || !input.trim()} type="button">
      {laden ? "…" : "➤"}
    </button>
  </div>
  <p class="eingabe-hint">Enter zum Senden · Shift+Enter für neue Zeile</p>
</div>

<style>
  .seiten-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 1.25rem;
  }
  h1 { margin: 0; color: #1a1a2e; font-size: 1.8rem; }
  .subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }

  .btn-reset {
    padding: 0.5rem 1rem; background: #f0f2f5; border: 1px solid rgba(0,0,0,0.08);
    border-radius: 8px; cursor: pointer; font-size: 0.85rem; color: #555;
    font-family: inherit; transition: all 0.15s;
  }
  .btn-reset:hover { background: #e0e2e5; color: #333; }

  .chat-wrapper {
    display: flex; flex-direction: column; gap: 0;
    background: white; border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;
    border: 1px solid rgba(0,0,0,0.06);
    max-width: 820px;
    height: calc(100vh - 220px);
    min-height: 480px;
  }

  /* Vorschläge */
  .vorschlaege {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    padding: 1rem 1.25rem; border-bottom: 1px solid #f0f0f0;
    background: #fafbff;
  }
  .vorschlag-btn {
    padding: 0.4rem 0.85rem; border: 1.5px solid rgba(92,107,192,0.25);
    border-radius: 20px; background: white; cursor: pointer;
    font-size: 0.82rem; color: #5c6bc0; font-family: inherit;
    transition: all 0.15s; white-space: nowrap;
  }
  .vorschlag-btn:hover:not(:disabled) {
    background: #eef2ff; border-color: #5c6bc0;
  }
  .vorschlag-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Chat-Nachrichten */
  .chat-container {
    flex: 1; overflow-y: auto; padding: 1.25rem;
    display: flex; flex-direction: column; gap: 1rem;
    scroll-behavior: smooth;
  }

  .bubble-wrap {
    display: flex; align-items: flex-end; gap: 0.6rem; max-width: 85%;
  }
  .bubble-wrap.assistant { align-self: flex-start; }
  .bubble-wrap.user { align-self: flex-end; flex-direction: row-reverse; }

  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: #eef2ff; display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0; border: 1.5px solid rgba(92,107,192,0.15);
  }
  .user-avatar { background: rgba(233,69,96,0.1); border-color: rgba(233,69,96,0.2); }

  .bubble {
    padding: 0.75rem 1rem; border-radius: 14px;
    font-size: 0.92rem; line-height: 1.55; max-width: 100%;
    word-break: break-word;
  }
  .bubble.assistant {
    background: #f0f2f5; color: #1a1a2e;
    border-bottom-left-radius: 4px;
  }
  .bubble.user {
    background: linear-gradient(135deg, #e94560, #c73652);
    color: white; border-bottom-right-radius: 4px;
  }
  .bubble br:last-child { display: none; }

  /* Loading Dots */
  .loading-bubble {
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.85rem 1.1rem;
  }
  .dot {
    width: 8px; height: 8px; background: #aaa; border-radius: 50%;
    animation: blink 1.4s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* Fehler */
  .fehler-banner {
    padding: 0.75rem 1rem; background: #fde; color: #c0392b;
    border-radius: 10px; font-size: 0.88rem; font-weight: 500;
    border: 1px solid rgba(231,76,60,0.2);
  }

  /* Eingabe */
  .eingabe-bereich {
    display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
    border-top: 1px solid #f0f0f0; align-items: flex-end;
    background: white;
  }
  .eingabe-feld {
    flex: 1; padding: 0.65rem 0.9rem;
    border: 2px solid #e0e0e0; border-radius: 10px;
    font-size: 0.92rem; font-family: inherit;
    resize: none; line-height: 1.4; transition: border-color 0.2s;
    max-height: 120px;
  }
  .eingabe-feld:focus { outline: none; border-color: #e94560; box-shadow: 0 0 0 3px rgba(233,69,96,0.1); }
  .eingabe-feld:disabled { background: #f8f9ff; }

  .senden-btn {
    width: 44px; height: 44px; background: #e94560; color: white;
    border: none; border-radius: 10px; cursor: pointer; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; flex-shrink: 0;
  }
  .senden-btn:hover:not(:disabled) { background: #c73652; transform: scale(1.05); }
  .senden-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .eingabe-hint { margin: 0; padding: 0 1rem 0.5rem; font-size: 0.75rem; color: #bbb; }

  /* Dark Mode */
  :global([data-theme="dark"]) h1 { color: #e6edf3 !important; }
  :global([data-theme="dark"]) .subtitle { color: #8b949e !important; }
  :global([data-theme="dark"]) .btn-reset { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.1) !important; color: #c9d1d9 !important; }
  :global([data-theme="dark"]) .chat-wrapper { background: rgba(22,27,34,0.9) !important; border-color: rgba(255,255,255,0.08) !important; }
  :global([data-theme="dark"]) .vorschlaege { background: rgba(13,17,23,0.5) !important; border-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"]) .vorschlag-btn { background: rgba(22,27,34,0.9) !important; color: #93c5fd !important; border-color: rgba(147,197,253,0.25) !important; }
  :global([data-theme="dark"]) .vorschlag-btn:hover:not(:disabled) { background: rgba(30,58,138,0.3) !important; }
  :global([data-theme="dark"]) .bubble.assistant { background: rgba(30,35,45,0.9) !important; color: #e6edf3 !important; }
  :global([data-theme="dark"]) .avatar { background: rgba(92,107,192,0.15) !important; border-color: rgba(92,107,192,0.2) !important; }
  :global([data-theme="dark"]) .eingabe-bereich { background: rgba(22,27,34,0.9) !important; border-top-color: rgba(255,255,255,0.06) !important; }
  :global([data-theme="dark"]) .eingabe-feld { background: rgba(13,17,23,0.8) !important; border-color: rgba(255,255,255,0.12) !important; color: #e6edf3 !important; }
  :global([data-theme="dark"]) .dot { background: #4d5566 !important; }

  @media (max-width: 600px) {
    .vorschlaege { overflow-x: auto; flex-wrap: nowrap; padding: 0.75rem; }
    .seiten-header { flex-direction: column; gap: 0.75rem; }
    .chat-wrapper { height: calc(100vh - 260px); min-height: 380px; }
  }
</style>
