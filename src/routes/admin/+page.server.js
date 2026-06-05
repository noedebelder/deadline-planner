import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect, error } from "@sveltejs/kit";
import bcrypt from "bcryptjs";

export async function load({ locals }) {
  if (!locals.user || locals.user.role !== "admin") {
    throw error(403, "Kein Zugriff");
  }

  const db = await getDb();
  const users = await db.collection("users").find({}).toArray();

  return {
    users: users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      role: u.role,
      erstellt: u.erstellt?.toISOString().split("T")[0] || "",
    })),
  };
}

export const actions = {
  erstellen: async ({ request, locals }) => {
    if (locals.user.role !== "admin") throw error(403);

    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    const role = data.get("role");

    const db = await getDb();
    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return { error: "Benutzername bereits vergeben" };
    }

    const hash = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hash,
      role,
      erstellt: new Date(),
    });

    redirect(303, "/admin");
  },

  loeschen: async ({ request, locals }) => {
    if (locals.user.role !== "admin") throw error(403);

    const data = await request.formData();
    const id = data.get("id");

    if (id === locals.user._id.toString()) {
      return { error: "Du kannst dich nicht selbst löschen" };
    }

    const db = await getDb();
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    redirect(303, "/admin");
  },
};
