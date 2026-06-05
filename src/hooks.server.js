import { getUserFromCookie } from "$lib/auth.js";

export async function handle({ event, resolve }) {
  const user = await getUserFromCookie(event.cookies);
  event.locals.user = user;

  // / ist öffentlich: zeigt Landingpage für Gäste, Übersicht für eingeloggte User
  const oeffentlich = ["/login", "/"];

  if (!user && !oeffentlich.includes(event.url.pathname)) {
    // 303 statt 302: POST-Redirect-Get Standard
    // use:enhance folgt dem 303 → response.redirected = true → navigiert zu /login
    // ohne JSON-Parse-Fehler
    return new Response(null, {
      status: 303,
      headers: { location: "/login" },
    });
  }

  return resolve(event);
}
