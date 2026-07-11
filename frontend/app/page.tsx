"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadInstructions from "@/components/upload/UploadInstructions";
import { UploadResponse } from "@/types/upload";

export default function Home() {
  const [previewData, setPreviewData] = useState<UploadResponse | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold leading-tight">
            AI Powered
            <span className="text-blue-500"> CSV Importer</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400">
            Upload CSV files from any CRM, Facebook Leads, Google Ads,
            Excel sheets or manually created spreadsheets.
            Our AI automatically understands your columns and converts
            them into GrowEasy CRM format.
          </p>
        </div>

        <div className="mt-12 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <UploadDropzone onUploadSuccess={setPreviewData} />
        </div>

        <div className="mt-8 w-full max-w-4xl">
          <UploadInstructions />
        </div>

        {previewData && (
          <div className="mt-10 w-full rounded-xl border border-green-700 bg-green-900/20 p-6">
            <h2 className="text-xl font-semibold text-green-400">
              Upload Successful 🎉
            </h2>

            <p className="mt-2 text-slate-300">
              Parsed{" "}
              <span className="font-semibold">
                {previewData.totalRows}
              </span>{" "}
              records successfully.
            </p>

            <p className="mt-1 text-slate-400">
              Preview screen will be implemented next.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
);
}