"use client";

import { FileSearch } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">

      <FileSearch
        size={60}
        className="text-slate-500"
      />

      <h2 className="mt-6 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-center text-slate-400">
        {description}
      </p>

    </div>
  );
}