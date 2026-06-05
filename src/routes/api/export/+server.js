import { getDb } from "$lib/db.js";

function csvEscape(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET({ locals, url }) {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = await getDb();
  const nurAktiv = url.searchParams.get("archiv") !== "1";

  let query = {};
  if (locals.user.role !== "admin") {
    query.userId = locals.user._id.toString();
  }
  if (nurAktiv) {
    query.status = { $ne: "erledigt" };
  }

  const deadlines = await db
    .collection("deadlines")
    .find(query)
    .sort({ deadline: 1 })
    .toArray();

  let userMap = {};
  if (locals.user.role === "admin") {
    const users = await db
      .collection("users")
      .find({}, { projection: { username: 1 } })
      .toArray();
    users.forEach((u) => (userMap[u._id.toString()] = u.username));
  }

  const headers = [
    "Titel",
    "Modul",
    "Deadline",
    "Aufwand (h)",
    "Priorität",
    "Status",
    ...(locals.user.role === "admin" ? ["Benutzer"] : []),
  ];

  const rows = deadlines.map((d) => [
    csvEscape(d.titel),
    csvEscape(d.modul),
    csvEscape(d.deadline),
    csvEscape(d.aufwand),
    csvEscape(d.prioritaet),
    csvEscape(d.status || "offen"),
    ...(locals.user.role === "admin"
      ? [csvEscape(userMap[d.userId] || "")]
      : []),
  ]);

  const csv =
    "﻿" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const datum = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="deadlines-${datum}.csv"`,
    },
  });
}
