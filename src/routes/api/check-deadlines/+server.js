import { getDb } from "$lib/db.js";
import { sendDeadlineWarning } from "$lib/email.js";
import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer deadline-check-secret") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  // Morgen als Grenze (< 1 Tag = heute oder überfällig)
  const morgen = new Date(heute);
  morgen.setDate(heute.getDate() + 1);
  const morgenStr = morgen.toISOString().split("T")[0];

  // Alle User mit aktivierter nearDeadline-Benachrichtigung
  const users = await db
    .collection("users")
    .find({
      email: { $exists: true, $ne: null, $ne: "" },
      "notificationSettings.nearDeadline": true,
    })
    .toArray();

  let gesendet = 0;

  for (const user of users) {
    if (!user.email) continue;

    // Deadlines die heute oder früher fällig sind (< 1 Tag)
    const deadlines = await db
      .collection("deadlines")
      .find({
        userId: user._id.toString(),
        status: { $ne: "erledigt" },
        deadline: { $lt: morgenStr },
      })
      .toArray();

    for (const d of deadlines) {
      const tage = Math.ceil((new Date(d.deadline) - heute) / (1000 * 60 * 60 * 24));
      await sendDeadlineWarning(user.email, d.titel, d.modul, d.deadline, tage);
      gesendet++;
    }
  }

  // Überfällige Deadlines für User mit overdue-Einstellung
  const overdueUsers = await db
    .collection("users")
    .find({
      email: { $exists: true, $ne: null, $ne: "" },
      "notificationSettings.overdue": true,
    })
    .toArray();

  const heuteStr = heute.toISOString().split("T")[0];

  for (const user of overdueUsers) {
    if (!user.email) continue;

    const overdueDeadlines = await db
      .collection("deadlines")
      .find({
        userId: user._id.toString(),
        status: { $ne: "erledigt" },
        deadline: { $lt: heuteStr },
      })
      .toArray();

    for (const d of overdueDeadlines) {
      const tage = Math.ceil((new Date(d.deadline) - heute) / (1000 * 60 * 60 * 24));
      await sendDeadlineWarning(user.email, d.titel, d.modul, d.deadline, tage);
      gesendet++;
    }
  }

  return json({ success: true, checked: users.length, emailsSent: gesendet });
}
