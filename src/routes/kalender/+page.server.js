import { getDb } from "$lib/db.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const db = await getDb();
  const deadlines = await db
    .collection("deadlines")
    .find({ userId: locals.user._id.toString() })
    .sort({ deadline: 1 })
    .toArray();

  return {
    deadlines: deadlines.map((d) => ({
      id: d._id.toString(),
      titel: d.titel,
      modul: d.modul,
      deadline: d.deadline,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
      typ: d.typ || null,
    })),
  };
}
