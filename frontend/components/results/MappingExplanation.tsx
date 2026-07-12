import { Info } from "lucide-react";

export default function MappingExplanation() {
  return (
    <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-5">
      <div className="flex items-center gap-2 text-blue-400">
        <Info size={18} />
        <span className="font-semibold">How AI Mapping Works</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Gemini AI analyzed each column header in your CSV and mapped it to the
        closest matching CRM field. Confidence scores reflect how certain the AI
        was about each record&apos;s field mapping and data quality.
      </p>
    </div>
  );
}
