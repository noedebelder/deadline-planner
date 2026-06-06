import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const db = await getDb();

  const query = { status: "erledigt", userId: locals.user._id.toString() };

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: -1 })
    .toArray();

  return {
    isAdmin: locals.user.role === "admin",
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
  loeschen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const db = await getDb();

    const query = { _id: new ObjectId(id), userId: locals.user._id.toString() };
    await db.collection("deadlines").deleteOne(query);
    redirect(303, "/archiv");
  },
};
