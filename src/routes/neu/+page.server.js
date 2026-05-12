import { getDb } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const titel = data.get('titel');
    const modul = data.get('modul');
    const deadline = data.get('deadline');
    const aufwand = Number(data.get('aufwand'));
    const prioritaet = data.get('prioritaet');

    const db = await getDb();
    await db.collection('deadlines').insertOne({
      titel,
      modul,
      deadline,
      aufwand,
      prioritaet,
      erstellt: new Date()
    });

    redirect(303, '/');
  }
};