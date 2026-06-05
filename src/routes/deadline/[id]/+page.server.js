import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { error } from "@sveltejs/kit";

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

  if (!deadline) {
    throw error(404, "Deadline nicht gefunden");
  }

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
      erstellt: deadline.erstellt
        ? new Date(deadline.erstellt).toLocaleDateString("de-CH")
        : null,
      benutzername,
    },
  };
}
