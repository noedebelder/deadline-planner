import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) {
    return { isLanding: true };
  }

  const db = await getDb();

  let query = { status: { $ne: "erledigt" } };
  if (locals.user.role !== "admin") {
    query.userId = locals.user._id.toString();
  }

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  let userMap = {};
  if (locals.user.role === "admin") {
    const users = await db
      .collection("users")
      .find({}, { projection: { username: 1 } })
      .toArray();
    users.forEach((u) => (userMap[u._id.toString()] = u.username));
  }

  return {
    isLanding: false,
    isAdmin: locals.user.role === "admin",
    deadlines: deadlines.map((d) => ({
      id: d._id.toString(),
      titel: d.titel,
      modul: d.modul,
      deadline: d.deadline,
      aufwand: d.aufwand,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
      typ: d.typ || null,
      fortschritt: d.fortschritt ?? 0,
      benutzername: userMap[d.userId] || null,
    })),
  };
}

export const actions = {
  loeschen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const db = await getDb();

    const query = { _id: new ObjectId(id) };
    if (locals.user.role !== "admin") {
      query.userId = locals.user._id.toString();
    }
    await db.collection("deadlines").deleteOne(query);
    redirect(303, "/");
  },

  fortschritt: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const id = data.get("id");
    const fortschritt = Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0));
    const db = await getDb();

    const query = { _id: new ObjectId(id) };
    if (locals.user.role !== "admin") {
      query.userId = locals.user._id.toString();
    }
    await db.collection("deadlines").updateOne(query, { $set: { fortschritt } });
    return { success: true };
  },
};
