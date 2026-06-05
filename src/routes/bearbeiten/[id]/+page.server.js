import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect, error } from "@sveltejs/kit";

export async function load({ params, locals }) {
  if (!locals.user) throw redirect(303, "/login");

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
    throw error(403, "Kein Zugriff");
  }

  return {
    deadline: {
      id: deadline._id.toString(),
      titel: deadline.titel,
      modul: deadline.modul,
      deadline: deadline.deadline,
      aufwand: deadline.aufwand,
      prioritaet: deadline.prioritaet,
      status: deadline.status || "offen",
      typ: deadline.typ || "Sonstiges",
      fortschritt: deadline.fortschritt ?? 0,
      notizen: deadline.notizen || "",
    },
  };
}

export const actions = {
  default: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const db = await getDb();

    const query = { _id: new ObjectId(params.id) };
    if (locals.user.role !== "admin") {
      query.userId = locals.user._id.toString();
    }

    const notizen = data.get("notizen")?.trim() || null;

    await db.collection("deadlines").updateOne(query, {
      $set: {
        titel: data.get("titel"),
        modul: data.get("modul"),
        deadline: data.get("deadline"),
        aufwand: Number(data.get("aufwand")),
        prioritaet: data.get("prioritaet"),
        status: data.get("status"),
        typ: data.get("typ") || "Sonstiges",
        fortschritt: Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0)),
        notizen: notizen ? notizen.slice(0, 500) : null,
      },
    });

    redirect(303, "/");
  },
};
