import { Database, Columns, Eye } from "lucide-react";

interface Props {
  totalRows: number;
  totalColumns: number;
  previewRows?: number;
}

export default function PreviewStats({
  totalRows,
  totalColumns,
  previewRows = 10,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Database className="text-blue-500" size={20} />
          <span className="font-semibold">Total Records</span>
        </div>
        <p className="mt-4 text-3xl font-bold">{totalRows}</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Columns className="text-green-500" size={20} />
          <span className="font-semibold">Columns</span>
        </div>
        <p className="mt-4 text-3xl font-bold">{totalColumns}</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Eye className="text-purple-500" size={20} />
          <span className="font-semibold">Preview Rows</span>
        </div>
        <p className="mt-4 text-3xl font-bold">{previewRows}</p>
      </div>
    </div>
  );
}
