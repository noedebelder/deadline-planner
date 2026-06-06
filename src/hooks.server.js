import { getUserFromCookie } from "$lib/auth.js";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  const user = await getUserFromCookie(event.cookies);
  event.locals.user = user;
  const pfad = event.url.pathname;
  const istOeffentlich = pfad === '/login' || pfad.startsWith('/login/');
  if (!user && !istOeffentlich) {
    throw redirect(303, "/login");
  }
  return resolve(event);
}
