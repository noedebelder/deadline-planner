import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) {
    return { isLanding: true };
  }

  const db = await getDb();

  const deadlines = await db
    .collection("deadlines")
    .find({ userId: locals.user._id.toString() })
    .sort({ deadline: 1 })
    .toArray();

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
    })),
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
};
