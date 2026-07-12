"use client";

import {
  Brain,
  Loader2,
  Sparkles,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function ProcessingOverlay() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">

        {/* Icon */}

        <div className="flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-600/10">

            <Brain
              size={42}
              className="text-blue-500"
            />

            <Loader2
              size={20}
              className="absolute -right-1 -top-1 animate-spin text-blue-400"
            />

          </div>
        </div>

        {/* Heading */}

        <h2 className="mt-8 text-center text-3xl font-bold">
          AI is Processing your CSV
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Sit back and relax.
          We're understanding your CSV,
          mapping different column names,
          validating records and converting
          everything into GrowEasy CRM format.
        </p>

        {/* Progress */}

        <div className="mt-10">

          <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
            <span>Processing</span>

            <span>Please Wait...</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />

          </div>

        </div>

        {/* Steps */}

        <div className="mt-12 space-y-6">

          <div className="flex items-center gap-4">

            <Database
              className="text-blue-500"
              size={22}
            />

            <div>

              <h3 className="font-semibold">
                Reading CSV Records
              </h3>

              <p className="text-sm text-slate-400">
                Parsing uploaded CSV file...
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <Brain
              className="text-violet-500"
              size={22}
            />

            <div>

              <h3 className="font-semibold">
                AI Field Mapping
              </h3>

              <p className="text-sm text-slate-400">
                Identifying email, phone, company,
                city and CRM fields.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <Sparkles
              className="text-yellow-500"
              size={22}
            />

            <div>

              <h3 className="font-semibold">
                Confidence Calculation
              </h3>

              <p className="text-sm text-slate-400">
                Verifying extracted fields and
                assigning confidence levels.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <CheckCircle2
              className="text-green-500"
              size={22}
            />

            <div>

              <h3 className="font-semibold">
                Preparing CRM Records
              </h3>

              <p className="text-sm text-slate-400">
                Generating final GrowEasy CRM output.
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-center text-sm text-slate-500">
            Processing time depends on the number of
            records in your CSV.
          </p>

        </div>

      </div>
    </section>
  );
}