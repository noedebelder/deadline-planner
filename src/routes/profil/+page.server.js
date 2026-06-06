import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { fail } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { validatePassword } from "$lib/validation.js";

export async function load({ locals }) {
  const db = await getDb();

  const anzahl = await db
    .collection("deadlines")
    .countDocuments({ userId: locals.user._id.toString() });

  const erledigt = await db
    .collection("deadlines")
    .countDocuments({ userId: locals.user._id.toString(), status: "erledigt" });

  return {
    profil: {
      id: locals.user._id.toString(),
      username: locals.user.username,
      email: locals.user.email || "",
      role: locals.user.role,
      erstellt: locals.user.erstellt
        ? new Date(locals.user.erstellt).toLocaleDateString("de-CH")
        : "Unbekannt",
      anzahlDeadlines: anzahl,
      anzahlErledigt: erledigt,
    },
  };
}

export const actions = {
  passwort: async ({ request, locals }) => {
    const data = await request.formData();
    const altesPasswort = data.get("altes_passwort");
    const neuesPasswort = data.get("neues_passwort");

    const pwError = validatePassword(neuesPasswort);
    if (pwError) {
      return fail(400, { error: pwError });
    }

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(locals.user._id.toString()) });

    if (!(await bcrypt.compare(altesPasswort, user.password))) {
      return fail(400, { error: "Aktuelles Passwort ist falsch" });
    }

    const hash = await bcrypt.hash(neuesPasswort, 10);
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { password: hash } });

    return { success: true };
  },
};
