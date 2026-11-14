"use client";

import { YEAR, MAX_PER_DAY } from "@/lib/config";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

type Props = {
  value: string;
  onChange: (date: string) => void;
  counts: Record<string, number>;
};

export default function DatePicker({ value, onChange, counts }: Props) {
  // Monday-first offset for December 1st
  const offset = (new Date(Date.UTC(YEAR, 11, 1)).getUTCDay() + 6) % 7;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="mb-2 text-center text-sm font-semibold text-slate-800">
        Dicembre {YEAR}
      </p>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[11px] font-medium text-slate-400">
            {d}
          </span>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const iso = `${YEAR}-12-${String(day).padStart(2, "0")}`;
          const count = counts[iso] ?? 0;
          const dow = new Date(Date.UTC(YEAR, 11, day)).getUTCDay();
          const weekend = dow === 0 || dow === 6;
          const full = count >= MAX_PER_DAY;
          const disabled = full || weekend;
          const selected = value === iso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              title={
                weekend
                  ? "No tests on weekends"
                  : full
                  ? "Day is full"
                  : `${count}/${MAX_PER_DAY} tests`
              }
              className={[
                "flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition",
                selected
                  ? "bg-indigo-600 font-semibold text-white shadow-sm"
                  : weekend
                  ? "cursor-not-allowed text-slate-300"
                  : full
                  ? "cursor-not-allowed bg-slate-50 text-slate-300 line-through"
                  : "text-slate-700 hover:bg-indigo-50",
              ].join(" ")}
            >
              {day}
              <span className="mt-0.5 flex h-1 gap-0.5">
                {Array.from({ length: Math.min(count, MAX_PER_DAY) }).map(
                  (_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full ${
                        selected ? "bg-white/80" : disabled ? "bg-slate-300" : "bg-indigo-400"
                      }`}
                    />
                  )
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
