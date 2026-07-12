"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2
        className="animate-spin text-blue-500"
        size={40}
      />
    </div>
  );
}