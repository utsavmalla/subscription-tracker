"use client";

import { useState } from "react";

import { EmptyState, StatusBadge } from "@/components/ui";
import { formatDate } from "@/data/subscriptions";
import {
  getAlertAccentClass,
  getAlertContainerClass,
  getAlertTableRowClass,
} from "@/lib/subscriptions/alertStyles";
import type { SubscriptionStatus } from "@/lib/subscriptions/status";
import type { SubscriptionRow } from "@/lib/subscriptions/types";

type PreviewFilter = "All" | SubscriptionStatus;

const filters = ["All", "Upcoming", "Overdue", "Active"] as const satisfies ReadonlyArray<PreviewFilter>;

type Props = {
  previewRows: SubscriptionRow[];
};

export function SubscriptionPreview({ previewRows }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<PreviewFilter>("All");
  const filteredRows =
    selectedFilter === "All"
      ? previewRows
      : previewRows.filter((row) => row.status === selectedFilter);

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Subscription Preview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Quick scan of the most urgent records.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                filter === selectedFilter
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredRows.length > 0 ? (
        <>
          <DesktopTable previewRows={filteredRows} />
          <MobileCards previewRows={filteredRows} />
        </>
      ) : (
        <EmptyState
          title={previewRows.length === 0 ? "No subscriptions yet" : "No matching preview rows"}
          description={
            previewRows.length === 0
              ? "Add your first subscription to populate the dashboard preview."
              : "Choose another status filter to review the most urgent records."
          }
          actionLabel={previewRows.length === 0 ? "Add subscription" : undefined}
          actionHref={previewRows.length === 0 ? "/subscriptions/new" : undefined}
        />
      )}
    </section>
  );
}

function DesktopTable({ previewRows }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-md border border-slate-200 md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Service</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Cycle</th>
            <th className="px-4 py-3 font-semibold">Next Renewal</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {previewRows.map((row) => (
            <tr key={row.id} className={getAlertTableRowClass(row.status)}>
              <td className="px-4 py-4 font-semibold text-slate-950">
                {row.service}
              </td>
              <td className="px-4 py-4 text-slate-600">{row.amount}</td>
              <td className="px-4 py-4 text-slate-600">{row.cycle}</td>
              <td className="px-4 py-4 text-slate-600">{formatDate(row.nextRenewal)}</td>
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="max-w-[220px] truncate px-4 py-4 text-slate-600">
                {row.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ previewRows }: Props) {
  return (
    <div className="space-y-3 md:hidden">
      {previewRows.map((row) => (
        <article
          key={row.id}
          className={`rounded-md border border-l-4 p-4 ${getAlertAccentClass(
            row.status,
          )} ${getAlertContainerClass(row.status)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{row.service}</p>
              <p className="mt-1 text-sm text-slate-500">
                {row.amount} · {row.cycle}
              </p>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Next renewal: {formatDate(row.nextRenewal)}
          </p>
          <p className="mt-1 text-sm text-slate-500">{row.remarks}</p>
        </article>
      ))}
    </div>
  );
}
