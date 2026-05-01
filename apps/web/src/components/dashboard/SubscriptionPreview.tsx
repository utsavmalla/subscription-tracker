import { previewRows } from "@/data/dashboard";
import { StatusBadge } from "@/components/ui";

const filters = ["All", "Upcoming", "Overdue", "Active"];

export function SubscriptionPreview() {
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
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                filter === "All"
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <DesktopTable />
      <MobileCards />
    </section>
  );
}

function DesktopTable() {
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
            <tr key={row.service} className="bg-white">
              <td className="px-4 py-4 font-semibold text-slate-950">
                {row.service}
              </td>
              <td className="px-4 py-4 text-slate-600">{row.amount}</td>
              <td className="px-4 py-4 text-slate-600">{row.cycle}</td>
              <td className="px-4 py-4 text-slate-600">{row.next}</td>
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

function MobileCards() {
  return (
    <div className="space-y-3 md:hidden">
      {previewRows.map((row) => (
        <article
          key={row.service}
          className="rounded-md border border-slate-200 p-4"
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
            Next renewal: {row.next}
          </p>
          <p className="mt-1 text-sm text-slate-500">{row.remarks}</p>
        </article>
      ))}
    </div>
  );
}
