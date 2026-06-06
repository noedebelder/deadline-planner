import Anthropic from "@anthropic-ai/sdk";
import { env } from "$env/dynamic/private";
import { getDb } from "$lib/db.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: "Nicht angemeldet" }, { status: 401 });

  const { message, history } = await request.json();
  if (!message?.trim()) return json({ error: "Leere Nachricht" }, { status: 400 });

  const db = await getDb();
  const deadlines = await db
    .collection("deadlines")
    .find({ userId: locals.user._id.toString(), status: { $ne: "erledigt" } })
    .sort({ deadline: 1 })
    .toArray();

  const heute = new Date().toLocaleDateString("de-CH");

  const deadlineText = deadlines
    .map((d) => {
      const tage = Math.ceil((new Date(d.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      return `- "${d.titel}" (${d.modul}): fällig am ${d.deadline} (in ${tage} Tagen), Aufwand: ${d.aufwand}h, Priorität: ${d.prioritaet}, Status: ${d.status}`;
    })
    .join("\n");

  const systemPrompt = `Du bist ein hilfreicher KI-Assistent für den Deadline Planner einer Studierenden-App.
Heute ist der ${heute}.

Die folgenden offenen Deadlines des Users sind bekannt:
${deadlineText || "Keine offenen Deadlines vorhanden."}

Deine Aufgaben:
- Hilf beim Erstellen von Tagesplänen basierend auf den Deadlines
- Empfehle sinnvolle Priorisierungen
- Motiviere und gib praktische Studientipps
- Beantworte Fragen zu den Deadlines
- Berechne Aufwand und schlage Lernblöcke vor

Antworte immer auf Deutsch, freundlich und konkret.
Halte Antworten kurz und praktisch (max. 200 Wörter).
Nutze Emojis sparsam für bessere Lesbarkeit.`;

  try {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        ...(history ?? []),
        { role: "user", content: message },
      ],
    });

    return json({ reply: response.content[0].text });
  } catch (e) {
    console.error("Anthropic API error:", e);
    return json(
      { error: "KI-Service momentan nicht verfügbar. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }
}
