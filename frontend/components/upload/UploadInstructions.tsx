import { FileSpreadsheet, Brain, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: <FileSpreadsheet size={24} className="text-blue-500" />,
    title: "Upload Any CSV",
    desc: "Facebook Leads, Google Ads, Excel exports, or any custom spreadsheet.",
  },
  {
    icon: <Brain size={24} className="text-violet-500" />,
    title: "AI Understands Your Columns",
    desc: "Gemini AI maps any column names to standard CRM fields automatically.",
  },
  {
    icon: <CheckCircle2 size={24} className="text-green-500" />,
    title: "Clean CRM Records",
    desc: "Get structured, validated records with confidence scores — ready for GrowEasy.",
  },
];

export default function UploadInstructions() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex items-center gap-3">
            {step.icon}
            <h3 className="font-semibold">{step.title}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
