import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
}