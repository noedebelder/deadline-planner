import { getDb } from "$lib/db.js";

function escapeIcal(str) {
  if (!str) return "";
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function toIcalDate(dateStr) {
  // dateStr is "YYYY-MM-DD"
  return dateStr.replace(/-/g, "");
}

function toIcalDateNext(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

function nowIcal() {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET({ locals }) {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = await getDb();
  let query = {};
  if (locals.user.role !== "admin") {
    query.userId = locals.user._id.toString();
  }

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  const dtstamp = nowIcal();

  const events = deadlines
    .map((d) => {
      const desc = [
        `Modul: ${d.modul}`,
        d.typ ? `Typ: ${d.typ}` : null,
        `Priorität: ${d.prioritaet}`,
        `Status: ${d.status || "offen"}`,
        `Aufwand: ${d.aufwand}h`,
        d.fortschritt != null ? `Fortschritt: ${d.fortschritt}%` : null,
        d.notizen ? `Notizen: ${d.notizen}` : null,
      ]
        .filter(Boolean)
        .join("\\n");

      return [
        "BEGIN:VEVENT",
        `UID:${d._id.toString()}@deadline-planner`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${toIcalDate(d.deadline)}`,
        `DTEND;VALUE=DATE:${toIcalDateNext(d.deadline)}`,
        `SUMMARY:${escapeIcal(d.titel)} (${escapeIcal(d.modul)})`,
        `DESCRIPTION:${escapeIcal(desc)}`,
        `CATEGORIES:${escapeIcal(d.prioritaet?.toUpperCase())}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Deadline Planner//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Deadline Planner",
    "X-WR-CALDESC:Meine Studiums-Deadlines",
    events,
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const datum = new Date().toISOString().split("T")[0];

  return new Response(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="deadlines-${datum}.ics"`,
    },
  });
}
