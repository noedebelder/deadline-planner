import { Resend } from "resend";
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

export async function sendDeadlineWarning(userEmail, deadlineTitel, modul, datum, tage) {
  await resend.emails.send({
    from: "Deadline Planner <onboarding@resend.dev>",
    to: userEmail,
    subject: `⚠️ Deadline-Erinnerung: ${deadlineTitel}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e94560;">⚠️ Deadline-Erinnerung</h2>
        <p>Deine Deadline <strong>${deadlineTitel}</strong> naht!</p>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Modul</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${modul}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${datum}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Verbleibend</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; color: #e94560;">
              ${tage <= 0 ? "🔴 ÜBERFÄLLIG" : `${tage} Tag(e)`}
            </td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="https://deadline-planner.netlify.app"
             style="background: #e94560; color: white; padding: 10px 20px;
                    text-decoration: none; border-radius: 5px;">
            Zur App →
          </a>
        </p>
        <p style="color: #999; font-size: 12px;">
          Deadline Planner – Verpasse nie wieder eine Abgabe
        </p>
      </div>
    `,
  });
}

export async function sendDailySummary(userEmail, username, deadlines) {
  const deadlineList = deadlines
    .map(
      (d) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${d.titel}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${d.modul}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${d.deadline}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${d.aufwand}h</td>
    </tr>
  `
    )
    .join("");

  await resend.emails.send({
    from: "Deadline Planner <onboarding@resend.dev>",
    to: userEmail,
    subject: `📅 Deine tägliche Deadline-Übersicht`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e94560;">📅 Guten Morgen, ${username}!</h2>
        <p>Hier ist deine heutige Deadline-Übersicht:</p>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1a1a2e; color: white;">
              <th style="padding: 8px;">Titel</th>
              <th style="padding: 8px;">Modul</th>
              <th style="padding: 8px;">Deadline</th>
              <th style="padding: 8px;">Aufwand</th>
            </tr>
          </thead>
          <tbody>${deadlineList}</tbody>
        </table>
        <p style="margin-top: 20px;">
          <a href="https://deadline-planner.netlify.app"
             style="background: #e94560; color: white; padding: 10px 20px;
                    text-decoration: none; border-radius: 5px;">
            Zur Tagesplanung →
          </a>
        </p>
      </div>
    `,
  });
}
