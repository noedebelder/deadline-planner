import { redirect } from '@sveltejs/kit';
import { getUserFromCookie } from '$lib/auth.js';

export async function handle({ event, resolve }) {
  const user = await getUserFromCookie(event.cookies);
  event.locals.user = user;

  if (!user && event.url.pathname !== '/login') {
    throw redirect(303, '/login');
  }

  return resolve(event);
}
