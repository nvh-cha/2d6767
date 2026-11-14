"use client";

import { useState } from "react";
import { ExternalLink, FolderOpen, RefreshCw } from "lucide-react";

const FOLDER_ID = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;

export default function DriveSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Drive
            </h2>
          </div>
        </div>

        {FOLDER_ID && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              title="Refresh the list"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <a
              href={`https://drive.google.com/drive/folders/${FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <ExternalLink className="h-4 w-4" />
              Apri il drive
            </a>
          </div>
        )}
      </div>

      {FOLDER_ID ? (
        <iframe
          key={refreshKey}
          src={`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#list`}
          title="Shared files"
          className="h-80 w-full border-0"
        />
      ) : (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          Drive non configurato (missing NEXT_PUBLIC_DRIVE_FOLDER_ID).
        </p>
      )}
    </section>
  );
}
