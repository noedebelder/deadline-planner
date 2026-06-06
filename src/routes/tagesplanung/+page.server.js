import { getDb } from "$lib/db.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const db = await getDb();
  const query = { status: { $ne: "erledigt" }, userId: locals.user._id.toString() };

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  return {
    deadlines: deadlines.map((d) => ({
      id: d._id.toString(),
      titel: d.titel,
      modul: d.modul,
      typ: d.typ || null,
      deadline: d.deadline,
      aufwand: d.aufwand,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
      fortschritt: d.fortschritt ?? 0,
    })),
  };
}
