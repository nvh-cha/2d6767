"use client";

import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import EventForm from "@/components/EventForm";
import DriveSection from "@/components/DriveSection";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAdded() {
    setTimeout(() => setRefreshKey((k) => k + 1), 1500);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <DriveSection />

      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 text-white shadow-sm">
          <img
            src="https://media.giphy.com/media/JMt40tiMr3LOKwkq0E/giphy.gif"
            alt="Horse"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            geometria dicembre
          </h1>
          <p className="text-sm text-slate-500">
            Massimo 4 persone per giorno
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <CalendarView refreshKey={refreshKey} />
        <div className="lg:sticky lg:top-20">
          <EventForm onAdded={handleAdded} />
        </div>
      </div>
    </main>
  );
}
