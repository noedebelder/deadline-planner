import { getDb } from "$lib/db.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const db = await getDb();
  const query = { userId: locals.user._id.toString() };

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  // Gruppiere nach Modul
  const modulMap = {};
  for (const d of deadlines) {
    const m = d.modul;
    if (!modulMap[m]) {
      modulMap[m] = {
        modul: m,
        deadlines: [],
        total: 0,
        erledigt: 0,
        gesamtAufwand: 0,
        gewichteterFortschritt: 0,
      };
    }
    const eff = d.status === "erledigt" ? 100 : (d.fortschritt ?? 0);
    modulMap[m].deadlines.push({
      id: d._id.toString(),
      titel: d.titel,
      deadline: d.deadline,
      aufwand: d.aufwand,
      prioritaet: d.prioritaet,
      status: d.status || "offen",
      typ: d.typ || null,
      fortschritt: eff,
    });
    modulMap[m].total++;
    modulMap[m].gesamtAufwand += d.aufwand;
    if (d.status === "erledigt") modulMap[m].erledigt++;
    modulMap[m].gewichteterFortschritt += eff * d.aufwand;
  }

  const module = Object.values(modulMap)
    .map((m) => ({
      ...m,
      fortschrittGesamt:
        m.gesamtAufwand > 0
          ? Math.round(m.gewichteterFortschritt / m.gesamtAufwand)
          : 0,
    }))
    .sort((a, b) => (b.total - b.erledigt) - (a.total - a.erledigt));

  return { module };
}
