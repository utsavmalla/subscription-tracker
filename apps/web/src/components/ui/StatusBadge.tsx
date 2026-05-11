const statusStyles: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Upcoming: "border-amber-200 bg-amber-50 text-amber-700",
  DueToday: "border-orange-300 bg-orange-50 text-orange-700",
  Overdue: "border-rose-200 bg-rose-50 text-rose-700",
  Expired: "border-stone-300 bg-stone-100 text-stone-700",
  Completed: "border-slate-200 bg-slate-100 text-slate-700",
};

export function StatusBadge({ status }: Readonly<{ status: string }>) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
