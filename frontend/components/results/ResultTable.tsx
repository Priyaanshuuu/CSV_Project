"use client";

import { useState } from "react";
import { CRMRecord } from "@/types/crm";
import ConfidenceBadge from "./ConfidenceBadge";

interface Props {
  records: CRMRecord[];
}

const PAGE_SIZE = 20;

const CRM_FIELDS = ["name", "email", "phone", "company", "city", "source"];

export default function ResultTable({ records }: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const visible = records.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <div className="max-h-[500px] overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-900">
              <tr>
                {CRM_FIELDS.map((f) => (
                  <th
                    key={f}
                    className="whitespace-nowrap border-b border-slate-700 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {f}
                  </th>
                ))}
                <th className="whitespace-nowrap border-b border-slate-700 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-800 transition hover:bg-slate-900"
                >
                  {CRM_FIELDS.map((f) => (
                    <td
                      key={f}
                      className="whitespace-nowrap px-5 py-3 text-sm text-slate-300"
                    >
                      {row[f] ? (
                        String(row[f])
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-5 py-3">
                    {row.confidence !== undefined ? (
                      <ConfidenceBadge confidence={Number(row.confidence)} />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-slate-700 px-3 py-1.5 transition hover:bg-slate-800 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-lg border border-slate-700 px-3 py-1.5 transition hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
