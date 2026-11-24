"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LoaderPinwheel, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isRuota = pathname === "/ruota";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm">
            <img
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ4eWJ0d29pY2hhbjFnMWZob3RubGpteXJsMHNwemxiZTlhMmVsciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kemBxAQvIlYOayzyaV/giphy.gif"
              alt="Horse"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-bold tracking-tight text-slate-900">
            67
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <Link
            href="/"
            className={[
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              !isRuota
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Calendar className="h-4 w-4" />
            Calendario
          </Link>

          <Link
            href="/ruota"
            className={[
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              isRuota
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <LoaderPinwheel className="h-4 w-4" />
            Ruota
          </Link>
        </div>
      </div>
    </nav>
  );
}
