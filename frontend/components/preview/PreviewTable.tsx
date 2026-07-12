"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Play } from "lucide-react";

import PreviewStats from "./PreviewStats";
import { useUploadContext } from "@/context/uploadContext";
import { processCSV } from "@/services/process.service";

export default function PreviewTable() {
  const { state, dispatch } = useUploadContext();

  const [loading, setLoading] = useState(false);

  const previewData = state.preview;

  const displayedRows = useMemo(() => {
    return previewData?.preview.slice(0, 10) ?? [];
  }, [previewData]);

  if (!previewData) return null;

  const { headers, records, totalRows } = previewData;

  async function handleImport() {
    try {
      setLoading(true);

      dispatch({
        type: "START_PROCESSING",
      });

      const result = await processCSV(records);

      dispatch({
        type: "SET_RESULT",
        payload: result,
      });

      toast.success("CSV Imported Successfully");
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ??
          "Something went wrong while processing the CSV."
        : error instanceof Error
          ? error.message
          : "Something went wrong while processing the CSV.";

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });

      toast.error("Import Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Eye
              size={30}
              className="text-blue-500"
            />

            <h2 className="text-3xl font-bold">
              Preview CSV
            </h2>

          </div>

          <p className="mt-3 text-slate-400">
            Review your uploaded CSV before sending it
            to AI for intelligent field mapping.
          </p>

        </div>

        <button
          disabled={loading}
          onClick={handleImport}
          className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={18} />

          {loading
            ? "Processing..."
            : "Start AI Import"}
        </button>

      </div>

      {/* Stats */}

      <PreviewStats
        totalRows={totalRows}
        totalColumns={headers.length}
        previewRows={displayedRows.length}
      />

      {/* Table */}

      <div className="mt-10 overflow-hidden rounded-xl border border-slate-800">

        <div className="max-h-[600px] overflow-auto">

          <table className="min-w-full border-collapse">

            <thead className="sticky top-0 z-20 bg-slate-900">

              <tr>

                {headers.map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap border-b border-slate-700 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-300"
                  >
                    {header}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {displayedRows.length === 0 ? (

                <tr>

                  <td
                    colSpan={headers.length}
                    className="py-16 text-center text-slate-500"
                  >
                    No Preview Available
                  </td>

                </tr>

              ) : (

                displayedRows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 transition hover:bg-slate-900"
                  >
                    {headers.map((header) => (
                      <td
                        key={`${index}-${header}`}
                        className="whitespace-nowrap px-6 py-4 text-sm text-slate-300"
                      >
                        {row[header] ? (
                          <span>{String(row[header])}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Footer Information */}

      <div className="mt-8 rounded-xl border border-blue-900/40 bg-blue-950/20 p-6">

        <h3 className="text-lg font-semibold text-blue-400">
          What happens after you click &quot;Start AI Import&quot;?
        </h3>

        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">

          <li>
            ✅ Your CSV records are sent to the backend.
          </li>

          <li>
            ✅ Records are divided into smaller batches.
          </li>

          <li>
            ✅ Gemini AI intelligently understands different column names.
          </li>

          <li>
            ✅ AI converts every record into GrowEasy CRM format.
          </li>

          <li>
            ✅ Invalid records (without email and phone) are skipped.
          </li>

          <li>
            ✅ Confidence is calculated for every imported record.
          </li>

        </ul>

      </div>

      {/* Bottom Actions */}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => dispatch({ type: "RESET" })}
          disabled={loading}
          className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Upload Another CSV
        </button>

        <button
          type="button"
          onClick={handleImport}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={18} />

          {loading ? (
            <>
              Processing...
            </>
          ) : (
            <>
              Start AI Import
            </>
          )}
        </button>

      </div>

    </section>
  );
}