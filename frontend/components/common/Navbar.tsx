"use client";

import { FileSpreadsheet } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <FileSpreadsheet size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Smart Import Engine
            </h1>

            <p className="text-xs text-slate-400">
              AI Powered CRM CSV Importer
            </p>
          </div>
        </div>

        {/* Assignment Badge */}
        <div className="hidden rounded-full border border-blue-600 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 md:block">
          GrowEasy Assignment
        </div>
      </div>
    </header>
  );
}