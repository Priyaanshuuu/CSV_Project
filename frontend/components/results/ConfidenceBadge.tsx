interface Props {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: Props) {
  const pct = Math.round(confidence * 100);

  const color =
    pct >= 80
      ? "bg-green-500/10 text-green-400 border-green-700"
      : pct >= 50
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-700"
      : "bg-red-500/10 text-red-400 border-red-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}
    >
      {pct}%
    </span>
  );
}
