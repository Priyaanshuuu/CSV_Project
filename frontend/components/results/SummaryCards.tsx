import { CheckCircle2, XCircle, Clock, BarChart3 } from "lucide-react";
import { ProcessResponse } from "@/context/uploadContext";

interface Props {
  summary: ProcessResponse["summary"];
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      icon: <BarChart3 size={22} className="text-blue-500" />,
      label: "Total Rows",
      value: summary.totalRows,
      bg: "border-slate-800 bg-slate-900",
    },
    {
      icon: <CheckCircle2 size={22} className="text-green-500" />,
      label: "Imported",
      value: summary.imported,
      bg: "border-green-900/40 bg-green-950/20",
    },
    {
      icon: <XCircle size={22} className="text-red-500" />,
      label: "Skipped",
      value: summary.skipped,
      bg: "border-red-900/40 bg-red-950/20",
    },
    {
      icon: <Clock size={22} className="text-violet-400" />,
      label: "Processing Time",
      value: `${(summary.processingTime / 1000).toFixed(1)}s`,
      bg: "border-violet-900/40 bg-violet-950/20",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-5 ${card.bg}`}
        >
          <div className="flex items-center gap-3">
            {card.icon}
            <span className="text-sm font-medium text-slate-400">
              {card.label}
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
