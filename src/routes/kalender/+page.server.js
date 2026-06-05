import { getDb } from "$lib/db.js";

export async function load({ locals }) {
  const db = await getDb();

  let query = {};
  if (locals.user.role !== "admin") {
    query.userId = locals.user._id.toString();
  }

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
      deadline: d.deadline,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
    })),
  };
}
