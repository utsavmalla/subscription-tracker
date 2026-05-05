import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/data/subscriptions";
import type { SubscriptionRow } from "@/lib/subscriptions/types";

export type SortField = "service" | "amount" | "nextRenewal" | "expiration" | "updated";

type Props = {
  rows: SubscriptionRow[];
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
};

const headings: { key: SortField; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "amount", label: "Amount" },
  { key: "nextRenewal", label: "Next renewal" },
  { key: "expiration", label: "Expiration" },
  { key: "updated", label: "Updated" },
];

export function SubscriptionsTable({
  rows,
  sortField,
  sortDirection,
  onSort,
  onMarkDone,
  onDelete,
}: Props) {
  function renderSortIndicator(field: SortField) {
    if (sortField !== field) {
      return <span className="ml-2 text-slate-400">↕</span>;
    }

    return (
      <span className="ml-2 text-slate-600">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-md border border-slate-200 md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {headings.map((heading) => (
              <th
                key={heading.key}
                className="px-4 py-3 font-semibold"
              >
                <button
                  type="button"
                  onClick={() => onSort(heading.key)}
                  className="inline-flex items-center gap-1 text-left"
                >
                  {heading.label}
                  {renderSortIndicator(heading.key)}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Cycle</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-4 font-semibold text-slate-950">
                {row.service}
              </td>
              <td className="px-4 py-4 text-slate-600">{row.amount}</td>
              <td className="px-4 py-4 text-slate-600">{formatDate(row.nextRenewal)}</td>
              <td className="px-4 py-4 text-slate-600">{formatDate(row.expiration)}</td>
              <td className="px-4 py-4 text-slate-600">{formatDate(row.updated)}</td>
              <td className="px-4 py-4 text-slate-600">{row.cycle}</td>
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/subscriptions/${row.id}`}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </Link>
                  <Link
                    href={`/subscriptions/${row.id}/edit`}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onMarkDone(row.id)}
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    {row.done ? "Undo" : "Mark done"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row.id)}
                    className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
