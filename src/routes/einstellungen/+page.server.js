import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { validatePassword, validateEmail } from "$lib/validation.js";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(locals.user._id.toString()) });

  const nav = user.navbarSettings || {};
  const def = user.defaultSettings || {};

  return {
    profil: {
      username: user.username,
      email: user.email || "",
    },
    notificationSettings: {
      nearDeadline: user.notificationSettings?.nearDeadline ?? false,
    },
    defaultSettings: {
      prioritaet: def.prioritaet || "mittel",
      status: def.status || "offen",
      typ: def.typ || "Sonstiges",
    },
    navbarSettings: {
      tagesplanung: nav.tagesplanung ?? true,
      kalender: nav.kalender ?? true,
      module: nav.module ?? true,
      statistik: nav.statistik ?? true,
      archiv: nav.archiv ?? true,
    },
  };
}

export const actions = {
  profil: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const username = data.get("username")?.trim();
    const emailRaw = data.get("email")?.trim().toLowerCase() || "";

    if (!username || username.length < 3) {
      return fail(400, { profilError: "Anzeigename mind. 3 Zeichen erforderlich" });
    }

    const updates = { username };
    if (emailRaw) {
      const emailError = validateEmail(emailRaw);
      if (emailError) return fail(400, { profilError: emailError });

      const db = await getDb();
      const other = await db.collection("users").findOne({
        email: emailRaw,
        _id: { $ne: new ObjectId(locals.user._id.toString()) },
      });
      if (other) return fail(400, { profilError: "E-Mail-Adresse bereits vergeben" });
      updates.email = emailRaw;
    }

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(locals.user._id.toString()) },
      { $set: updates }
    );
    return { profilSuccess: true };
  },

  passwort: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const altesPasswort = data.get("altes_passwort");
    const neuesPasswort = data.get("neues_passwort");
    const bestaetigen = data.get("bestaetigen");

    if (neuesPasswort !== bestaetigen)
      return fail(400, { passwortError: "Die Passwörter stimmen nicht überein" });

    const pwError = validatePassword(neuesPasswort);
    if (pwError) return fail(400, { passwortError: pwError });

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(locals.user._id.toString()) });

    if (!(await bcrypt.compare(altesPasswort, user.password)))
      return fail(400, { passwortError: "Aktuelles Passwort ist falsch" });

    const hash = await bcrypt.hash(neuesPasswort, 10);
    await db.collection("users").updateOne({ _id: user._id }, { $set: { password: hash } });
    return { passwortSuccess: true };
  },

  benachrichtigungen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(locals.user._id.toString()) },
      { $set: { "notificationSettings.nearDeadline": data.get("nearDeadline") === "true" } }
    );
    throw redirect(303, "/einstellungen");
  },

  standard: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(locals.user._id.toString()) },
      {
        $set: {
          defaultSettings: {
            prioritaet: data.get("defaultPrioritaet") || "mittel",
            status: data.get("defaultStatus") || "offen",
            typ: data.get("defaultTyp") || "Sonstiges",
          },
        },
      }
    );
    throw redirect(303, "/einstellungen");
  },

  navigation: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(locals.user._id.toString()) },
      {
        $set: {
          navbarSettings: {
            tagesplanung: data.get("tagesplanung") === "on",
            kalender: data.get("kalender") === "on",
            module: data.get("module") === "on",
            statistik: data.get("statistik") === "on",
            archiv: data.get("archiv") === "on",
          },
        },
      }
    );
    return { navigationSuccess: true };
  },
};
