import { NextResponse } from "next/server";
import { getCalendar, getDecemberCounts } from "@/lib/calendar";
import { YEAR, MAX_PER_DAY } from "@/lib/config";

export async function GET() {
  try {
    const counts = await getDecemberCounts();
    return NextResponse.json({ counts, max: MAX_PER_DAY });
  } catch (err) {
    console.error("Calendar list failed:", err);
    return NextResponse.json({ error: "Caricamento eventi fallito." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta invalida." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const date = String(body.date ?? "").trim();
  const topics = String(body.topics ?? "").trim();

  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "Inserire il nome(max 100 caratteri)" },
      { status: 400 }
    );
  }
  if (
    !new RegExp(`^${YEAR}-12-\\d{2}$`).test(date) ||
    Number.isNaN(Date.parse(date))
  ) {
    return NextResponse.json(
      { error: `Entro dicembre ${YEAR}.` },
      { status: 400 }
    );
  }
  if (topics.length > 500) {
    return NextResponse.json(
      { error: "I teoremi sono troppo lunghi (max 500 caratteri)." },
      { status: 400 }
    );
  }

  // All-day events: Google expects the end date to be exclusive (the next day)
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const endDate = next.toISOString().slice(0, 10);

  try {
    const counts = await getDecemberCounts();
    if ((counts[date] ?? 0) >= MAX_PER_DAY) {
      return NextResponse.json(
        { error: `Quel giorno è pieno (max ${MAX_PER_DAY} al giorno). Scegline un altro.` },
        { status: 409 }
      );
    }

    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    if (dow === 0 || dow === 6) {
      return NextResponse.json(
        { error: "AOOOO il fine settimana?." },
        { status: 400 }
      );
    }

    const { cal, calendarId } = getCalendar();
    await cal.events.insert({
      calendarId,
      requestBody: {
        summary: name,
        description: `Teoremi: ${topics || "Ancora da decidere"}`,
        start: { date },
        end: { date: endDate },
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Calendar insert failed:", err);
    return NextResponse.json(
      { error: "Inserimento fallito. Riprova." },
      { status: 500 }
    );
  }
}
