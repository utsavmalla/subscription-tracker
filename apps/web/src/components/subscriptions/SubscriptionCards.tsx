import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/data/subscriptions";
import type { SubscriptionRow } from "@/lib/subscriptions/types";

type Props = {
  rows: SubscriptionRow[];
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SubscriptionCards({ rows, onMarkDone, onDelete }: Props) {
  return (
    <div className="space-y-4 md:hidden">
      {rows.map((row) => (
        <article
          key={row.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-950">{row.service}</p>
              <p className="mt-1 text-sm text-slate-600">
                {row.amount} · {row.cycle}
              </p>
            </div>
            <StatusBadge status={row.status} />
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>Next renewal: {formatDate(row.nextRenewal)}</p>
            <p>Expiration: {formatDate(row.expiration)}</p>
            <p>Last updated: {formatDate(row.updated)}</p>
            <p className="text-slate-500">{row.remarks}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/subscriptions/${row.id}`}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              View
            </Link>
            <Link
              href={`/subscriptions/${row.id}/edit`}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onMarkDone(row.id)}
              className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              {row.done ? "Undo" : "Mark done"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(row.id)}
              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
