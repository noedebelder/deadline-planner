import { getDb } from "$lib/db.js";
import { ObjectId } from "mongodb";
import { redirect } from "@sveltejs/kit";

export async function load({ params }) {
  const db = await getDb();
  const deadline = await db
    .collection("deadlines")
    .findOne({ _id: new ObjectId(params.id) });

  return {
    deadline: {
      id: deadline._id.toString(),
      titel: deadline.titel,
      modul: deadline.modul,
      deadline: deadline.deadline,
      aufwand: deadline.aufwand,
      prioritaet: deadline.prioritaet,
      status: deadline.status || "offen",
    },
  };
}

export const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();

    const db = await getDb();
    await db.collection("deadlines").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          titel: data.get("titel"),
          modul: data.get("modul"),
          deadline: data.get("deadline"),
          aufwand: Number(data.get("aufwand")),
          prioritaet: data.get("prioritaet"),
          status: data.get("status"),
        },
      },
    );

    redirect(303, "/");
  },
};
