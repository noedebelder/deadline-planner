import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { error, redirect } from "@sveltejs/kit";

// Fortschritt aus Subtasks berechnen (0–100)
function berechneFortschritt(subtasks) {
  if (!subtasks?.length) return null;
  const erledigt = subtasks.filter((s) => s.erledigt).length;
  return Math.round((erledigt / subtasks.length) * 100);
}

// Gesamtaufwand aus allen Subtasks
function berechneAufwandGesamt(subtasks) {
  if (!subtasks?.length) return null;
  return +subtasks.reduce((sum, s) => sum + (s.aufwand || 0), 0).toFixed(1);
}

// Nur nicht erledigte Subtasks
function berechneAufwandVerbleibend(subtasks) {
  if (!subtasks?.length) return null;
  return +subtasks
    .filter((s) => !s.erledigt)
    .reduce((sum, s) => sum + (s.aufwand || 0), 0)
    .toFixed(1);
}

// Nach Toggle/Push: fortschritt + aufwand in DB aktualisieren
async function syncBerechnungen(db, id) {
  const doc = await db.collection("deadlines").findOne({ _id: new ObjectId(id) });
  const subtasks = doc.subtasks || [];
  if (!subtasks.length) return;
  const fortschritt = berechneFortschritt(subtasks) ?? doc.fortschritt;
  const aufwand = berechneAufwandGesamt(subtasks) ?? doc.aufwand;
  await db
    .collection("deadlines")
    .updateOne({ _id: new ObjectId(id) }, { $set: { fortschritt, aufwand } });
}

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
  if (deadline.userId !== locals.user._id.toString()) {
    throw error(403, "Kein Zugriff auf diese Deadline");
  }

  const subtasks = deadline.subtasks || [];
  const aufwandGesamt = berechneAufwandGesamt(subtasks) ?? deadline.aufwand;
  const aufwandVerbleibend = berechneAufwandVerbleibend(subtasks) ?? deadline.aufwand;
  const fortschritt = berechneFortschritt(subtasks) ?? (deadline.fortschritt ?? 0);

  return {
    deadline: {
      id: deadline._id.toString(),
      titel: deadline.titel,
      modul: deadline.modul,
      deadline: deadline.deadline,
      aufwand: deadline.aufwand,
      aufwandGesamt,
      aufwandVerbleibend,
      prioritaet: deadline.prioritaet,
      status: deadline.status || "offen",
      typ: deadline.typ || null,
      fortschritt,
      notizen: deadline.notizen || null,
      erstellt: deadline.erstellt
        ? new Date(deadline.erstellt).toLocaleDateString("de-CH")
        : null,
      subtasks: subtasks.map((s) => ({
        id: s.id,
        titel: s.titel,
        aufwand: s.aufwand,
        erledigt: s.erledigt,
        erledigtAm: s.erledigtAm,
      })),
    },
  };
}

export const actions = {
  subtaskHinzufuegen: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");
    const data = await request.formData();
    const titel = data.get("titel")?.trim();
    const aufwand = Math.max(0.1, Number(data.get("aufwand")) || 1);
    if (!titel) return { subtaskError: "Titel ist erforderlich" };

    const db = await getDb();
    const newSubtask = {
      id: crypto.randomUUID(),
      titel,
      aufwand,
      erledigt: false,
      erledigtAm: null,
    };

    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(params.id), userId: locals.user._id.toString() },
      { $push: { subtasks: newSubtask } }
    );
    await syncBerechnungen(db, params.id);
    return { success: true };
  },

  subtaskErledigt: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");
    const data = await request.formData();
    const subtaskId = data.get("subtaskId");
    // erledigt wird als aktueller Wert übergeben → wir togglen ihn
    const warErledigt = data.get("warErledigt") === "true";
    const neuerWert = !warErledigt;

    const db = await getDb();
    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(params.id), userId: locals.user._id.toString() },
      {
        $set: {
          "subtasks.$[elem].erledigt": neuerWert,
          "subtasks.$[elem].erledigtAm": neuerWert ? new Date().toISOString() : null,
        },
      },
      { arrayFilters: [{ "elem.id": subtaskId }] }
    );
    await syncBerechnungen(db, params.id);
    return { success: true };
  },

  subtaskLoeschen: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");
    const data = await request.formData();
    const subtaskId = data.get("subtaskId");

    const db = await getDb();
    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(params.id), userId: locals.user._id.toString() },
      { $pull: { subtasks: { id: subtaskId } } }
    );
    await syncBerechnungen(db, params.id);
    return { success: true };
  },

  fortschritt: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, "/login");
    const data = await request.formData();
    const fortschritt = Math.min(100, Math.max(0, Number(data.get("fortschritt")) || 0));
    const db = await getDb();
    const query = { _id: new ObjectId(params.id), userId: locals.user._id.toString() };
    await db.collection("deadlines").updateOne(query, { $set: { fortschritt } });
    return { success: true };
  },
};
