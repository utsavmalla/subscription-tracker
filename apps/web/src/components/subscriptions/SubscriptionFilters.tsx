import type { ChangeEvent } from "react";
import {
  cycleOptions,
  dateRangeOptions,
  doneOptions,
  statusOptions,
} from "@/data/subscriptions";

type Props = {
  search: string;
  status: string;
  cycle: string;
  doneState: string;
  dateRange: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCycleChange: (value: string) => void;
  onDoneChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onClearFilters: () => void;
};

export function SubscriptionFilters({
  search,
  status,
  cycle,
  doneState,
  dateRange,
  onSearchChange,
  onStatusChange,
  onCycleChange,
  onDoneChange,
  onDateRangeChange,
  onClearFilters,
}: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label className="block text-sm font-semibold text-slate-900">
            Search services
          </label>
          <input
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by service or remarks"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-900">
          Status
          <select
            value={status}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onStatusChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Renewal cycle
          <select
            value={cycle}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onCycleChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            {cycleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Done state
          <select
            value={doneState}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onDoneChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            {doneOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Date range
          <select
            value={dateRange}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onDateRangeChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            {dateRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
