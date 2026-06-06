import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { validatePassword, validateEmail } from "$lib/validation.js";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const notif = locals.user.notificationSettings || {};
  const settings = locals.user.settings || {};

  return {
    profil: {
      username: locals.user.username,
      email: locals.user.email || "",
    },
    notificationSettings: {
      highPriority: notif.highPriority ?? true,
      overdue: notif.overdue ?? true,
      dailySummary: notif.dailySummary ?? false,
    },
    settings: {
      defaultPriority: settings.defaultPriority || "mittel",
      defaultStatus: settings.defaultStatus || "offen",
      language: settings.language || "de",
    },
  };
}

export const actions = {
  profil: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const username = data.get("username")?.trim();
    const email = data.get("email")?.trim().toLowerCase();

    if (!username || username.length < 3) {
      return fail(400, { profilError: "Anzeigename mind. 3 Zeichen erforderlich" });
    }
    const emailError = validateEmail(email);
    if (emailError) {
      return fail(400, { profilError: emailError });
    }

    const db = await getDb();
    const other = await db.collection("users").findOne({
      email,
      _id: { $ne: new ObjectId(locals.user._id.toString()) },
    });
    if (other) {
      return fail(400, { profilError: "E-Mail-Adresse bereits vergeben" });
    }

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(locals.user._id.toString()) },
        { $set: { username, email } }
      );

    return { profilSuccess: true };
  },

  passwort: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const altesPasswort = data.get("altes_passwort");
    const neuesPasswort = data.get("neues_passwort");
    const bestaetigen = data.get("bestaetigen");

    if (neuesPasswort !== bestaetigen) {
      return fail(400, { passwortError: "Die Passwörter stimmen nicht überein" });
    }
    const pwError = validatePassword(neuesPasswort);
    if (pwError) {
      return fail(400, { passwortError: pwError });
    }

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(locals.user._id.toString()) });

    if (!(await bcrypt.compare(altesPasswort, user.password))) {
      return fail(400, { passwortError: "Aktuelles Passwort ist falsch" });
    }

    const hash = await bcrypt.hash(neuesPasswort, 10);
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { password: hash } });

    return { passwortSuccess: true };
  },

  benachrichtigungen: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    await db_update(locals.user._id, {
      notificationSettings: {
        highPriority: data.get("highPriority") === "on",
        overdue: data.get("overdue") === "on",
        dailySummary: data.get("dailySummary") === "on",
      },
    });

    return { benachrichtigungenSuccess: true };
  },

  standard: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const data = await request.formData();
    const defaultPriority = data.get("defaultPriority") || "mittel";
    const defaultStatus = data.get("defaultStatus") || "offen";
    const language = data.get("language") === "en" ? "en" : "de";

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(locals.user._id.toString()) },
      {
        $set: {
          "settings.defaultPriority": defaultPriority,
          "settings.defaultStatus": defaultStatus,
          "settings.language": language,
        },
      }
    );

    return { standardSuccess: true };
  },
};

async function db_update(userId, fields) {
  const db = await getDb();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId.toString()) }, { $set: fields });
}
