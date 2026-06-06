import { getDb } from "$lib/db.js";

export async function load({ locals }) {
  const db = await getDb();

  const query = { userId: locals.user._id.toString() };

  const deadlines = await db.collection("deadlines").find(query).toArray();

  // Aufwand pro Modul
  const modulMap = {};
  deadlines.forEach((d) => {
    modulMap[d.modul] = (modulMap[d.modul] || 0) + d.aufwand;
  });

  // Status-Verteilung
  const statusMap = { offen: 0, "in-bearbeitung": 0, erledigt: 0 };
  deadlines.forEach((d) => {
    const s = d.status || "offen";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });

  // Prioritäts-Verteilung
  const prioritaetMap = { hoch: 0, mittel: 0, niedrig: 0 };
  deadlines.forEach((d) => {
    prioritaetMap[d.prioritaet] = (prioritaetMap[d.prioritaet] || 0) + 1;
  });

  return {
    total: deadlines.length,
    totalAufwand: deadlines.reduce((s, d) => s + d.aufwand, 0),
    module: Object.entries(modulMap).map(([modul, aufwand]) => ({
      modul,
      aufwand,
    })),
    status: statusMap,
    prioritaet: prioritaetMap,
  };
}
