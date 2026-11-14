const CALENDAR_SRC =
  "https://calendar.google.com/calendar/embed" +
  "?src=1ab294795e3dc0fe30fe99d8bfc44d6884d1f2dbf6b7b840bd6cd1f53ee0ccc2%40group.calendar.google.com" +
  "&ctz=Europe%2FRome&mode=MONTH&dates=20261201%2F20261231" +
  "&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0";

export default function CalendarView({ refreshKey }: { refreshKey: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <iframe
        key={refreshKey}
        src={CALENDAR_SRC}
        title="Class 2D test calendar"
        className="h-[640px] w-full border-0"
      />
    </div>
  );
}
