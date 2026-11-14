import { calendar, auth } from "@googleapis/calendar";
import { YEAR } from "./config";

export function getCalendar() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!b64 || !calendarId) throw new Error("Server is not configured.");

  const creds = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  const jwt = new auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });

  return { cal: calendar({ version: "v3", auth: jwt }), calendarId };
}

// Returns e.g. { "2026-12-03": 2, "2026-12-10": 4 }
export async function getDecemberCounts() {
  const { cal, calendarId } = getCalendar();
  const res = await cal.events.list({
    calendarId,
    timeMin: `${YEAR}-11-30T00:00:00Z`,
    timeMax: `${YEAR + 1}-01-02T00:00:00Z`,
    singleEvents: true,
    maxResults: 2500,
  });

  const counts: Record<string, number> = {};
  for (const ev of res.data.items ?? []) {
    const day = ev.start?.date ?? ev.start?.dateTime?.slice(0, 10);
    if (day) counts[day] = (counts[day] ?? 0) + 1;
  }
  return counts;
}
