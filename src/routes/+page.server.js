import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const db = await getDb();

  let query = {};
  if (locals.user.role !== "admin") {
    query = { userId: locals.user._id.toString() };
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
      aufwand: d.aufwand,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
    })),
  };
}

export const actions = {
  loeschen: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id");
    const db = await getDb();
    await db.collection("deadlines").deleteOne({ _id: new ObjectId(id) });
    redirect(303, "/");
  },
};
