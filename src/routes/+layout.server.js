import { getDb } from "$lib/db.js";

export async function load({ locals }) {
  let baldFaellig = 0;

  if (locals.user) {
    try {
      const db = await getDb();
      const heute = new Date();
      heute.setHours(0, 0, 0, 0);
      const inDreiTagen = new Date(heute);
      inDreiTagen.setDate(heute.getDate() + 3);

      const heuteStr = heute.toISOString().split("T")[0];
      const inDreiTagenStr = inDreiTagen.toISOString().split("T")[0];

      const query = {
        deadline: { $gte: heuteStr, $lte: inDreiTagenStr },
        status: { $ne: "erledigt" },
      };
      if (locals.user.role !== "admin") {
        query.userId = locals.user._id.toString();
      }

      baldFaellig = await db.collection("deadlines").countDocuments(query);
    } catch {
      baldFaellig = 0;
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
    baldFaellig,
  };
}
