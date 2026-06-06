import { getDb } from "$lib/db.js";

function csvField(value) {
  if (value == null) return '""';
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

export async function GET({ locals, url }) {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = await getDb();
  const nurAktiv = url.searchParams.get("archiv") !== "1";

  const query = { userId: locals.user._id.toString() };
  if (nurAktiv) {
    query.status = { $ne: "erledigt" };
  }

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  const headers = [
    "Titel",
    "Modul",
    "Deadline",
    "Aufwand (h)",
    "Priorität",
    "Status",
    "Typ",
    "Fortschritt (%)",
  ];

  const rows = deadlines.map((d) => [
    csvField(d.titel),
    csvField(d.modul),
    csvField(formatDate(d.deadline)),
    csvField(d.aufwand),
    csvField(d.prioritaet),
    csvField(d.status || "offen"),
    csvField(d.typ || ""),
    csvField(d.fortschritt ?? 0),
  ]);

  const BOM = "﻿";
  const csv =
    BOM +
    [headers.map(csvField).join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const datum = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="deadlines-${datum}.csv"`,
    },
  });
}
