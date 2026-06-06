import { getDb } from "$lib/db.js";
import { sendDeadlineWarning, sendDailySummary } from "$lib/email.js";
import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer deadline-check-secret") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const heute = new Date();

  // Alle User mit aktivierten Benachrichtigungen laden
  const users = await db
    .collection("users")
    .find({
      email: { $exists: true },
      "notificationSettings.highPriority": true,
    })
    .toArray();

  let gesendet = 0;

  for (const user of users) {
    // Deadlines die in <= 3 Tagen fällig sind
    const deadlines = await db
      .collection("deadlines")
      .find({
        userId: user._id.toString(),
        status: { $ne: "erledigt" },
        deadline: {
          $lte: new Date(heute.getTime() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      })
      .toArray();

    for (const d of deadlines) {
      const tage = Math.ceil((new Date(d.deadline) - heute) / (1000 * 60 * 60 * 24));
      await sendDeadlineWarning(user.email, d.titel, d.modul, d.deadline, tage);
      gesendet++;
    }
  }

  // Tägliche Zusammenfassung für User mit dailySummary
  const summaryUsers = await db
    .collection("users")
    .find({
      email: { $exists: true },
      "notificationSettings.dailySummary": true,
    })
    .toArray();

  for (const user of summaryUsers) {
    const deadlines = await db
      .collection("deadlines")
      .find({
        userId: user._id.toString(),
        status: { $ne: "erledigt" },
      })
      .sort({ deadline: 1 })
      .limit(10)
      .toArray();

    if (deadlines.length > 0) {
      await sendDailySummary(user.email, user.username, deadlines);
      gesendet++;
    }
  }

  return json({ success: true, checked: users.length, emailsSent: gesendet });
}
