import { getDb } from "$lib/db.js";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();

    const db = await getDb();
    await db.collection("deadlines").insertOne({
      titel: data.get("titel"),
      modul: data.get("modul"),
      deadline: data.get("deadline"),
      aufwand: Number(data.get("aufwand")),
      prioritaet: data.get("prioritaet"),
      status: data.get("status"),
      userId: locals.user._id.toString(),
      erstellt: new Date(),
    });

    redirect(303, "/");
  },
};
