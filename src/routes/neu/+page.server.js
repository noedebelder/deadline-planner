import { getDb } from "$lib/db.js";
import { redirect, fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const titel = data.get("titel")?.trim();
    const modul = data.get("modul")?.trim();
    const deadline = data.get("deadline");
    const aufwand = Number(data.get("aufwand"));
    const prioritaet = data.get("prioritaet");

    if (!titel || !modul || !deadline || !aufwand) {
      return fail(400, { error: "Alle Felder sind erforderlich" });
    }

    // Subtasks parsen
    let subtasks = [];
    try {
      const raw = data.get("subtasksJson");
      if (raw) {
        const parsed = JSON.parse(raw);
        subtasks = parsed
          .filter((s) => s.titel?.trim())
          .map((s) => ({
            id: crypto.randomUUID(),
            titel: s.titel.trim(),
            aufwand: s.aufwand ? Number(s.aufwand) : 0,
            datum: s.datum || null,
            erledigt: false,
            erledigtAm: null,
          }));
      }
    } catch {
      // Ungültige Subtasks werden ignoriert
    }

    const notizen = data.get("notizen")?.trim() || null;
    const db = await getDb();
    await db.collection("deadlines").insertOne({
      titel,
      modul,
      deadline,
      aufwand,
      prioritaet,
      status: data.get("status"),
      typ: data.get("typ") || "Sonstiges",
      fortschritt: Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0)),
      notizen: notizen ? notizen.slice(0, 500) : null,
      subtasks,
      userId: locals.user._id.toString(),
      erstellt: new Date(),
    });

    throw redirect(303, "/");
  },
};
