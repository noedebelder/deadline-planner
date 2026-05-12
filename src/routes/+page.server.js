import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load() {
  const db = await getDb();
  const deadlines = await db
    .collection("deadlines")
    .find({})
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
