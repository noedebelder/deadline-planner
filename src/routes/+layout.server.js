import { getDb } from "$lib/db.js";

export async function load({ locals }) {
  if (!locals.user) {
    return { user: null, baldFaellig: 0, benachrichtigungen: [], navbarSettings: null };
  }

  try {
    const db = await getDb();
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);

    const in3Tagen = new Date(heute);
    in3Tagen.setDate(heute.getDate() + 3);
    const in3TagenStr = in3Tagen.toISOString().split("T")[0];

    const kritischeDeadlines = await db
      .collection("deadlines")
      .find({
        userId: locals.user._id.toString(),
        status: { $ne: "erledigt" },
        deadline: { $lte: in3TagenStr },
      })
      .sort({ deadline: 1 })
      .toArray();

    const benachrichtigungen = kritischeDeadlines.map((d) => {
      const deadlineDate = new Date(d.deadline + "T00:00:00");
      const tage = Math.round((deadlineDate - heute) / (1000 * 60 * 60 * 24));
      return {
        id: d._id.toString(),
        titel: d.titel,
        modul: d.modul,
        deadline: d.deadline,
        tage,
        typ: tage < 0 ? "ueberfaellig" : tage === 0 ? "heute" : "bald",
      };
    });

    const navbarSettings = locals.user.navbarSettings || {};

    return {
      user: {
        id: locals.user._id.toString(),
        username: locals.user.username,
        role: locals.user.role,
      },
      baldFaellig: benachrichtigungen.length,
      benachrichtigungen,
      navbarSettings: {
        tagesplanung: navbarSettings.tagesplanung ?? true,
        kalender: navbarSettings.kalender ?? true,
        module: navbarSettings.module ?? true,
        statistik: navbarSettings.statistik ?? true,
        archiv: navbarSettings.archiv ?? true,
      },
    };
  } catch {
    return {
      user: {
        id: locals.user._id.toString(),
        username: locals.user.username,
        role: locals.user.role,
      },
      baldFaellig: 0,
      benachrichtigungen: [],
      navbarSettings: {
        tagesplanung: true,
        kalender: true,
        module: true,
        statistik: true,
        archiv: true,
      },
    };
  }
}
