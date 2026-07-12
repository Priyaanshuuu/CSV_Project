"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { SkippedRecord } from "@/types/crm";

interface Props {
  records: SkippedRecord[];
}

export default function SkippedRecords({ records }: Props) {
  const [open, setOpen] = useState(false);

  if (!records.length) return null;

  return (
    <div className="rounded-xl border border-red-900/40 bg-red-950/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <XCircle size={20} className="text-red-500" />
          <span className="font-semibold text-red-400">
            {records.length} Skipped Records
          </span>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="overflow-auto border-t border-red-900/40 px-6 pb-6">
          <table className="mt-4 min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Row
                </th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-t border-slate-800">
                  <td className="py-2 pr-6 text-slate-400">{r.row}</td>
                  <td className="py-2 text-red-300">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
