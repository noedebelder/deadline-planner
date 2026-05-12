import { getDb } from '$lib/db.js';

export async function load() {
  const db = await getDb();
  const deadlines = await db
    .collection('deadlines')
    .find({})
    .sort({ deadline: 1 })
    .toArray();

  return {
    deadlines: deadlines.map(d => ({
      id: d._id.toString(),
      titel: d.titel,
      modul: d.modul,
      deadline: d.deadline,
      aufwand: d.aufwand,
      prioritaet: d.prioritaet
    }))
  };
}