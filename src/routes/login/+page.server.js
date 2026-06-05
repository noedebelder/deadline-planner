import { getDb } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

async function adminErstellen() {
  const db = await getDb();
  const existing = await db.collection('users').findOne({ username: 'admin' });
  if (!existing) {
    const hash = await bcrypt.hash('Admin1234', 10);
    await db.collection('users').insertOne({
      username: 'admin',
      password: hash,
      role: 'admin',
      erstellt: new Date()
    });
  }
}

export async function load() {
  await adminErstellen();
  return {};
}

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    const db = await getDb();
    const user = await db.collection('users').findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return fail(400, { error: 'Benutzername oder Passwort falsch' });
    }

    cookies.set('userId', user._id.toString(), {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7
    });

    redirect(303, '/');
  }
};