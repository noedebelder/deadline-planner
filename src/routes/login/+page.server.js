import { getDb } from "$lib/db.js";
import { redirect, fail } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { validatePassword, validateEmail } from "$lib/validation.js";

async function adminErstellen() {
  const db = await getDb();
  const existing = await db.collection("users").findOne({ username: "admin" });
  if (!existing) {
    const hash = await bcrypt.hash("Admin1234", 10);
    await db.collection("users").insertOne({
      username: "admin",
      email: "admin@deadline-planner.app",
      password: hash,
      role: "admin",
      erstellt: new Date(),
      notificationSettings: { nearDeadline: false, overdue: false },
      settings: { defaultPriority: "mittel", defaultStatus: "offen" },
    });
  } else if (!existing.email) {
    await db
      .collection("users")
      .updateOne({ _id: existing._id }, { $set: { email: "admin@deadline-planner.app" } });
  }
}

export async function load() {
  await adminErstellen();
  return {};
}

export const actions = {
  anmelden: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email")?.trim().toLowerCase();
    const password = data.get("password");

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return fail(400, { loginError: "E-Mail oder Passwort falsch" });
    }

    cookies.set("userId", user._id.toString(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(303, "/");
  },

  registrieren: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username")?.trim();
    const email = data.get("email")?.trim().toLowerCase();
    const password = data.get("password");

    if (!username || username.length < 3) {
      return fail(400, {
        registerError: "Anzeigename mind. 3 Zeichen erforderlich",
        tab: "register",
      });
    }
    const emailError = validateEmail(email);
    if (emailError) {
      return fail(400, { registerError: emailError, tab: "register" });
    }
    const pwError = validatePassword(password);
    if (pwError) {
      return fail(400, { registerError: pwError, tab: "register" });
    }

    const db = await getDb();
    const existingEmail = await db.collection("users").findOne({ email });
    if (existingEmail) {
      return fail(400, { registerError: "E-Mail-Adresse bereits vergeben", tab: "register" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hash,
      role: "user",
      erstellt: new Date(),
      notificationSettings: { nearDeadline: false, overdue: false },
      settings: { defaultPriority: "mittel", defaultStatus: "offen" },
    });

    cookies.set("userId", result.insertedId.toString(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(303, "/");
  },
};
