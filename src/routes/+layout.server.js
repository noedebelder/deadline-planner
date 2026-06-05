import { getDb } from "$lib/db.js";

export async function load({ locals }) {
  let dieseWoche = 0;

  if (locals.user) {
    try {
      const db = await getDb();
      const heute = new Date();
      heute.setHours(0, 0, 0, 0);
      const inSiebenTagen = new Date(heute);
      inSiebenTagen.setDate(heute.getDate() + 7);

      const heuteStr = heute.toISOString().split("T")[0];
      const inSiebenTagenStr = inSiebenTagen.toISOString().split("T")[0];

      const query = {
        deadline: { $gte: heuteStr, $lte: inSiebenTagenStr },
        status: { $ne: "erledigt" },
      };
      if (locals.user.role !== "admin") {
        query.userId = locals.user._id.toString();
      }

      dieseWoche = await db.collection("deadlines").countDocuments(query);
    } catch {
      dieseWoche = 0;
    }
  }

  return {
    user: locals.user
      ? {
          id: locals.user._id.toString(),
          username: locals.user.username,
          role: locals.user.role,
        }
      : null,
    dieseWoche,
  };
}
