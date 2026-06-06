import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) {
    return { isLanding: true };
  }

  const db = await getDb();

  const query = { status: { $ne: "erledigt" }, userId: locals.user._id.toString() };

  const deadlines = await db
    .collection("deadlines")
    .find(query)
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

    const query = { _id: new ObjectId(id), userId: locals.user._id.toString() };
    await db.collection("deadlines").deleteOne(query);
    redirect(303, "/");
  },

  fortschritt: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const fortschritt = Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0));
    const db = await getDb();

    const query = { _id: new ObjectId(id), userId: locals.user._id.toString() };
    await db.collection("deadlines").updateOne(query, { $set: { fortschritt } });
    return { success: true };
  },
};
