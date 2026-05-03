import Link from "next/link";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase text-teal-700">
          May 1, 2026
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-normal text-slate-950">
          Subscription Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Track renewals, overdue items, and monthly spend in one place.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          Import CSV
        </button>
        <Link
          href="/subscriptions/new"
          className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
        >
          Add Subscription
        </Link>
      </div>
    </div>
  );
}
