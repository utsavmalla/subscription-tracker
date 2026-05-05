"use client";

import { useMemo, useState } from "react";
import {
  deleteSubscriptionAction,
  markSubscriptionDoneAction,
} from "@/actions/subscriptions";
import { SubscriptionFilters } from "@/components/subscriptions/SubscriptionFilters";
import {
  SubscriptionsTable,
  type SortField,
} from "@/components/subscriptions/SubscriptionsTable";
import { SubscriptionCards } from "@/components/subscriptions/SubscriptionCards";
import type { SubscriptionRow } from "@/lib/subscriptions/types";

type Props = {
  initialRows: SubscriptionRow[];
};

const defaultSortField: SortField = "nextRenewal";

function parseAmount(amount: string) {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0;
}

function parseDate(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function SubscriptionListClient({ initialRows }: Props) {
  const [rows, setRows] = useState<SubscriptionRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [cycle, setCycle] = useState("All");
  const [doneState, setDoneState] = useState("All");
  const [dateRange, setDateRange] = useState("Any time");
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [today] = useState(() => Date.now());

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const matchesSearch =
          normalizedSearch === "" ||
          row.service.toLowerCase().includes(normalizedSearch) ||
          row.remarks.toLowerCase().includes(normalizedSearch);

        const matchesStatus = status === "All" || row.status === status;
        const matchesCycle = cycle === "All" || row.cycle === cycle;
        const matchesDone =
          doneState === "All" ||
          (doneState === "Done" ? row.done : !row.done);

        const renewalDate = parseDate(row.nextRenewal);
        const daysUntilRenewal = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));

        const matchesDateRange =
          dateRange === "Any time" ||
          (dateRange === "This week" && daysUntilRenewal >= 0 && daysUntilRenewal <= 7) ||
          (dateRange === "Next 30 days" && daysUntilRenewal >= 0 && daysUntilRenewal <= 30) ||
          (dateRange === "This quarter" && daysUntilRenewal >= 0 && daysUntilRenewal <= 90);

        return matchesSearch && matchesStatus && matchesCycle && matchesDone && matchesDateRange;
      })
      .sort((a, b) => {
        let left: string | number = "";
        let right: string | number = "";

        switch (sortField) {
          case "service":
            left = a.service;
            right = b.service;
            break;
          case "amount":
            left = parseAmount(a.amount);
            right = parseAmount(b.amount);
            break;
          case "nextRenewal":
            left = parseDate(a.nextRenewal);
            right = parseDate(b.nextRenewal);
            break;
          case "expiration":
            left = parseDate(a.expiration);
            right = parseDate(b.expiration);
            break;
          case "updated":
            left = parseDate(a.updated);
            right = parseDate(b.updated);
            break;
        }

        if (left < right) {
          return sortDirection === "asc" ? -1 : 1;
        }

        if (left > right) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      });
  }, [rows, search, status, cycle, doneState, dateRange, sortField, sortDirection, today]);

  const activeCount = rows.filter((row) => row.status === "Active").length;
  const overdueCount = rows.filter((row) => row.status === "Overdue").length;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

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
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) {
      return;
    }

    const result = await deleteSubscriptionAction(deleteTargetId);
    setToastMessage(result.message);

    if (result.ok) {
      setRows((current) => current.filter((row) => row.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setCycle("All");
    setDoneState("All");
    setDateRange("Any time");
  };

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              Subscriptions
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Manage your recurring services
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search, filter, sort, and manage your subscriptions from one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">Active subscriptions</p>
              <p className="text-xl font-semibold text-slate-950">{activeCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Overdue</p>
              <p className="text-xl font-semibold text-rose-600">{overdueCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        <SubscriptionFilters
          search={search}
          status={status}
          cycle={cycle}
          doneState={doneState}
          dateRange={dateRange}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onCycleChange={setCycle}
          onDoneChange={setDoneState}
          onDateRangeChange={setDateRange}
          onClearFilters={clearFilters}
        />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Subscription list</h2>
              <p className="mt-1 text-sm text-slate-500">
                Use the table on desktop or the cards on mobile to review each item.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">{filteredRows.length} records</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Sorted by {sortField}</span>
            </div>
          </div>

          <SubscriptionsTable
            rows={filteredRows}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onMarkDone={handleMarkDone}
            onDelete={handleDelete}
          />

          <SubscriptionCards
            rows={filteredRows}
            onMarkDone={handleMarkDone}
            onDelete={handleDelete}
          />

          {filteredRows.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
              No subscriptions match your current filters. Try clearing filters or adjusting the search term.
            </div>
          )}
        </section>
      </div>

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

      {deleteTargetId && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-950">Delete subscription?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This action will remove the subscription from the database. You can undo it by re-adding the service later.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
