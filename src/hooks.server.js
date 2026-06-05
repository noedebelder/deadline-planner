import { getUserFromCookie } from "$lib/auth.js";

export async function handle({ event, resolve }) {
  const user = await getUserFromCookie(event.cookies);
  event.locals.user = user;

  const oeffentlich = ["/login"];
  if (!user && !oeffentlich.includes(event.url.pathname)) {
    return new Response(null, {
      status: 302,
      headers: { location: "/login" },
    });
  }

  return resolve(event);
}
