interface Props {
  children: React.ReactNode;
}

export default function Badge({
  children,
}: Props) {
  return (
    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400">
      {children}
    </span>
  );
}