/*"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function EventForm({ onAdded }: { onAdded: () => void }) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [topics, setTopics] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, name, topics }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Something went wrong.",
        });
        return;
      }

      setDate("");
      setName("");
      setTopics("");
      setStatus({ type: "success" });
      onAdded();
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    }
  }

  const loading = status.type === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Programma un interrogazione</h2>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="date"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          Data
        </label>
        <input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Nome 
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="topics"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          Teoremi 
          <span className="font-normal text-slate-400">(puoi decidere anche dopo)</span>
        </label>
        <textarea
          id="topics"
          rows={3}
          maxLength={500}
          placeholder="Lascia vuoto se non hai deciso"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {loading ? "Registrando…" : "Aggiungi al calendario"}
      </button>

      {status.type === "success" && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Fatto! Il calendario potrebbe 
          qualche secondo per aggiornarsi.
        </p>
      )}
      {status.type === "error" && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {status.message}
        </p>
      )}
    </form>
  );
}
*/
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import DatePicker from "./DatePicker";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function EventForm({ onAdded }: { onAdded: () => void }) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [topics, setTopics] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCounts(data.counts ?? {});
    } catch {
      /* the server re-checks the limit anyway */
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setStatus({ type: "error", message: "Pick a date first." });
      return;
    }
    setStatus({ type: "loading" });

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, name, topics }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Something went wrong.",
        });
        loadCounts();
        if (res.status === 409) setDate("");
        return;
      }

      setDate("");
      setName("");
      setTopics("");
      setStatus({ type: "success" });
      loadCounts();
      onAdded();
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    }
  }

  const loading = status.type === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Programma un interrogazione</h2>
      </div>

      <div className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          Data
        </span>
        <DatePicker value={date} onChange={setDate} counts={counts} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="topics"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          Teoremi
          <span className="font-normal text-slate-400">(Opzionale)</span>
        </label>
        <textarea
          id="topics"
          rows={3}
          maxLength={500}
          placeholder="Puoi lasciarlo vuoto"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !date}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {loading ? "Aspetta…" : "Aggiungi"}
      </button>

      {status.type === "success" && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Fatto! Il calendario potrebbe 
          impiegare qualche secondo per aggiornarsi.
        </p>
      )}
      {status.type === "error" && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {status.message}
        </p>
      )}
    </form>
  );
}
