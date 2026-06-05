import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { error, redirect } from "@sveltejs/kit";

export async function load({ params, locals }) {
  const db = await getDb();

  let deadline;
  try {
    deadline = await db
      .collection("deadlines")
      .findOne({ _id: new ObjectId(params.id) });
  } catch {
    throw error(404, "Deadline nicht gefunden");
  }

  if (!deadline) throw error(404, "Deadline nicht gefunden");

  if (
    locals.user.role !== "admin" &&
    deadline.userId !== locals.user._id.toString()
  ) {
    throw error(403, "Kein Zugriff auf diese Deadline");
  }

  let benutzername = null;
  if (locals.user.role === "admin") {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(deadline.userId) });
    benutzername = user?.username || "Unbekannt";
  }

  return {
    isAdmin: locals.user.role === "admin",
    deadline: {
      id: deadline._id.toString(),
      titel: deadline.titel,
      modul: deadline.modul,
      deadline: deadline.deadline,
      aufwand: deadline.aufwand,
      prioritaet: deadline.prioritaet,
      status: deadline.status || "offen",
      typ: deadline.typ || null,
      fortschritt: deadline.fortschritt ?? 0,
      notizen: deadline.notizen || null,
      erstellt: deadline.erstellt
        ? new Date(deadline.erstellt).toLocaleDateString("de-CH")
        : null,
      benutzername,
    },
  };
}

export const actions = {
  fortschritt: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const fortschritt = Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0));
    const db = await getDb();

    const query = { _id: new ObjectId(params.id) };
    if (locals.user.role !== "admin") {
      query.userId = locals.user._id.toString();
    }
    await db.collection("deadlines").updateOne(query, { $set: { fortschritt } });
    return { success: true };
  },
};
