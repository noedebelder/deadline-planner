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

    if (!titel || !modul || !deadline || !aufwand) {
      return fail(400, { error: "Alle Felder sind erforderlich" });
    }

    const notizen = data.get("notizen")?.trim() || null;
    const db = await getDb();
    await db.collection("deadlines").insertOne({
      titel,
      modul,
      deadline,
      aufwand,
      prioritaet: data.get("prioritaet"),
      status: data.get("status"),
      typ: data.get("typ") || "Sonstiges",
      fortschritt: Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0)),
      notizen: notizen ? notizen.slice(0, 500) : null,
      userId: locals.user._id.toString(),
      erstellt: new Date(),
    });

    redirect(303, "/");
  },
};
