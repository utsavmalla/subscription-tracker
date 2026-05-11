"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { markSubscriptionDoneAction } from "@/actions/subscriptions";
import { StatusBadge } from "@/components/ui";
import {
  getAlertAccentClass,
  getAlertContainerClass,
} from "@/lib/subscriptions/alertStyles";
import type { SubscriptionStatus } from "@/lib/subscriptions/status";
import type { SubscriptionRow } from "@/lib/subscriptions/types";

type AlertTab = "Upcoming" | "DueToday" | "Overdue" | "Expired" | "Completed";

type Props = {
  initialRows: SubscriptionRow[];
};

const tabs: { key: AlertTab; label: string; helper: string }[] = [
  { key: "Upcoming", label: "Upcoming", helper: "Due in the next 7 days" },
  { key: "DueToday", label: "Due Today", helper: "Needs attention today" },
  { key: "Overdue", label: "Overdue", helper: "Past renewal date" },
  { key: "Expired", label: "Expired", helper: "One-time plans ended" },
  { key: "Completed", label: "Completed", helper: "Handled alerts" },
];

export function AlertsClient({ initialRows }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [selectedTab, setSelectedTab] = useState<AlertTab>("Upcoming");
  const [toastMessage, setToastMessage] = useState("");

  const counts = useMemo(() => {
    return tabs.reduce<Record<AlertTab, number>>(
      (nextCounts, tab) => ({
        ...nextCounts,
        [tab.key]: rows.filter((row) => matchesTab(row, tab.key)).length,
      }),
      {
        Upcoming: 0,
        DueToday: 0,
        Overdue: 0,
        Expired: 0,
        Completed: 0,
      },
    );
  }, [rows]);

  const visibleRows = rows.filter((row) => matchesTab(row, selectedTab));
  const activeTab = tabs.find((tab) => tab.key === selectedTab) ?? tabs[0];
  const attentionCount =
    counts.Upcoming + counts.DueToday + counts.Overdue + counts.Expired;

  const handleMarkDone = async (id: string) => {
    const row = rows.find((current) => current.id === id);
    if (!row) {
      return;
    }

    const nextDone = !row.done;
    const result = await markSubscriptionDoneAction(id, nextDone);
    setToastMessage(result.message);

    if (result.ok) {
      setRows((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                done: nextDone,
                status: nextDone ? "Completed" : item.status,
                alertState: nextDone ? "None" : item.alertState,
              }
            : item,
        ),
      );

      if (nextDone) {
        setSelectedTab("Completed");
      }

      router.refresh();
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              Alerts
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Review renewals that need attention
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Clear due, overdue, and expired subscription tasks without leaving the alerts queue.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">Open alerts</p>
              <p className="text-xl font-semibold text-slate-950">{attentionCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-xl font-semibold text-slate-700">{counts.Completed}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const isSelected = tab.key === selectedTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                  isSelected
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">{activeTab.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{activeTab.helper}</p>
          </div>
          <p className="text-sm text-slate-500">{visibleRows.length} records</p>
        </div>

        <div className="mt-5 space-y-3">
          {visibleRows.map((row) => (
            <AlertRow key={row.id} row={row} onMarkDone={handleMarkDone} />
          ))}

          {visibleRows.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
              No alerts in this tab.
            </p>
          )}
        </div>
      </section>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-20 rounded-2xl bg-slate-950 px-5 py-3 text-sm text-white shadow-xl sm:right-8">
          {toastMessage}
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="ml-4 text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

function AlertRow({
  row,
  onMarkDone,
}: {
  row: SubscriptionRow;
  onMarkDone: (id: string) => void;
}) {
  const relevantDate = row.cycle === "One-time" ? row.expiration : row.nextRenewal;
  const reason = getAlertReason(row);

  return (
    <article
      className={`rounded-md border border-l-4 p-4 ${getAlertAccentClass(
        row.status,
      )} ${getAlertContainerClass(row.status)}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-950">{row.service}</h3>
            <StatusBadge status={row.status} />
          </div>
          <p className="mt-2 text-sm text-slate-700">{reason}</p>
          <p className="mt-1 text-sm text-slate-500">
            {relevantDate} · {row.amount} · {row.cycle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onMarkDone(row.id)}
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            {row.done ? "Undo" : "Mark done"}
          </button>
          <Link
            href={`/subscriptions/${row.id}/edit`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <Link
            href={`/subscriptions/${row.id}`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function matchesTab(row: SubscriptionRow, tab: AlertTab) {
  if (tab === "Completed") {
    return row.done || row.status === "Completed";
  }

  return row.status === tab;
}

function getAlertReason(row: SubscriptionRow) {
  const reasons: Record<SubscriptionStatus, string> = {
    Active: "No active alert.",
    Upcoming: "Renewal is coming up soon.",
    DueToday: row.cycle === "One-time" ? "Subscription expires today." : "Renewal is due today.",
    Overdue: "Renewal is overdue.",
    Expired: "One-time subscription has expired.",
    Completed: "Alert task has been handled.",
  };

  return reasons[row.status];
}
