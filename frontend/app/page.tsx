"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadInstructions from "@/components/upload/UploadInstructions";
import PreviewTable from "@/components/preview/PreviewTable";
import ProcessingOverlay from "@/components/processing/ProcessingOverlay";
import SummaryCards from "@/components/results/SummaryCards";
import ResultTable from "@/components/results/ResultTable";
import SkippedRecords from "@/components/results/SkippedRecords";
import MappingExplanation from "@/components/results/MappingExplanation";
import { useUploadContext } from "@/context/uploadContext";
import { CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { CRMRecord, SkippedRecord } from "@/types/crm";

export default function Home() {
  const { state, dispatch } = useUploadContext();

  const reset = () => dispatch({ type: "RESET" });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* ── IDLE: Upload screen ── */}
      {state.status === "idle" && (
        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-5xl font-bold leading-tight">
              AI Powered
              <span className="text-blue-500"> CSV Importer</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Upload CSV files from any CRM, Facebook Leads, Google Ads, Excel
              sheets or manually created spreadsheets. Our AI automatically
              understands your columns and converts them into GrowEasy CRM
              format.
            </p>
          </div>

          <div className="mt-12 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <UploadDropzone />
          </div>

          <div className="mt-8 w-full max-w-4xl">
            <UploadInstructions />
          </div>
        </section>
      )}

      {/* ── PREVIEW ── */}
      {state.status === "preview" && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <PreviewTable />
        </section>
      )}

      {/* ── PROCESSING ── */}
      {state.status === "processing" && <ProcessingOverlay />}

      {/* ── COMPLETED ── */}
      {state.status === "completed" && state.result && (
        <section className="mx-auto max-w-7xl px-6 py-12 space-y-8">
          {/* Success header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={32} className="text-green-500" />
              <div>
                <h2 className="text-3xl font-bold">Import Complete!</h2>
                <p className="mt-1 text-slate-400">
                  Your CSV has been processed and converted to CRM format.
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800"
            >
              <RotateCcw size={16} />
              Import Another CSV
            </button>
          </div>

          <SummaryCards summary={state.result.summary} />

          <MappingExplanation />

          {/* Imported records */}
          {state.result.imported.length > 0 && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                Imported Records ({state.result.imported.length})
              </h3>
              <ResultTable records={state.result.imported as CRMRecord[]} />
            </div>
          )}

          {/* Skipped records */}
          {state.result.skipped.length > 0 && (
            <SkippedRecords
              records={state.result.skipped as SkippedRecord[]}
            />
          )}
        </section>
      )}

      {/* ── ERROR ── */}
      {state.status === "error" && (
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <AlertCircle size={56} className="text-red-500" />
          <h2 className="mt-6 text-3xl font-bold">Something went wrong</h2>
          <p className="mt-4 text-slate-400">
            {state.error ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </section>
      )}

      <Footer />
    </main>
  );
}
