import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) {
    return { isLanding: true };
  }

  const db = await getDb();

  // Alle Deadlines laden (inkl. erledigte für Inline-Anzeige)
  const deadlines = await db
    .collection("deadlines")
    .find({ userId: locals.user._id.toString() })
    .sort({ deadline: 1 })
    .toArray();

  return {
    isLanding: false,
    isAdmin: locals.user.role === "admin",
    deadlines: deadlines.map((d) => {
      const subtasks = d.subtasks ?? [];
      const subtaskErledigt = subtasks.filter((s) => s.erledigt).length;
      const aufwandVerbleibend =
        subtasks.length > 0
          ? +subtasks
              .filter((s) => !s.erledigt)
              .reduce((sum, s) => sum + (s.aufwand || 0), 0)
              .toFixed(1)
          : +(d.aufwand * (1 - (d.fortschritt ?? 0) / 100)).toFixed(1);
      return {
        id: d._id.toString(),
        titel: d.titel,
        modul: d.modul,
        deadline: d.deadline,
        aufwand: d.aufwand,
        aufwandVerbleibend,
        prioritaet: d.prioritaet,
        status: d.status || "offen",
        typ: d.typ || null,
        fortschritt: d.fortschritt ?? 0,
        subtaskCount: subtasks.length,
        subtaskErledigt,
        subtasks: subtasks.map((s) => ({
          id: s.id,
          titel: s.titel,
          aufwand: s.aufwand,
          datum: s.datum,
          erledigt: s.erledigt,
        })),
      };
    }),
  };
}

export const actions = {
  loeschen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const db = await getDb();

    await db.collection("deadlines").deleteOne({
      _id: new ObjectId(id),
      userId: locals.user._id.toString(),
    });
    throw redirect(303, "/");
  },

  fortschritt: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const fortschritt = Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0));
    const db = await getDb();

    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(id), userId: locals.user._id.toString() },
      { $set: { fortschritt } }
    );
    return { success: true };
  },

  statusToggle: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const aktuellerStatus = data.get("status");
    const db = await getDb();

    const neuerStatus = aktuellerStatus === "erledigt" ? "offen" : "erledigt";
    const updateFelder = { status: neuerStatus };
    if (neuerStatus === "erledigt") {
      updateFelder.fortschritt = 100;
      updateFelder.erledigtAm = new Date().toISOString().split("T")[0];
    }

    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(id), userId: locals.user._id.toString() },
      { $set: updateFelder }
    );
    return { success: true };
  },

  subtaskErledigen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const deadlineId = data.get("deadlineId");
    const subtaskId = data.get("subtaskId");
    const db = await getDb();

    const deadline = await db.collection("deadlines").findOne({
      _id: new ObjectId(deadlineId),
      userId: locals.user._id.toString(),
    });
    if (!deadline) return { success: false };

    const subtasks = deadline.subtasks ?? [];
    const idx = subtasks.findIndex((s) => s.id === subtaskId);
    if (idx === -1) return { success: false };

    subtasks[idx].erledigt = true;
    subtasks[idx].erledigtAm = new Date().toISOString().split("T")[0];

    // Fortschritt automatisch berechnen
    const total = subtasks.length;
    const erledigt = subtasks.filter((s) => s.erledigt).length;
    const fortschritt = total > 0 ? Math.round((erledigt / total) * 100) : 0;

    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(deadlineId) },
      { $set: { subtasks, fortschritt } }
    );
    return { success: true };
  },
};
