import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Table({
  children,
}: Props) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-800">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  );
}