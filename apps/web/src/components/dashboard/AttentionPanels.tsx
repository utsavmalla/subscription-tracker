import { Panel, StatusBadge } from "@/components/ui";
import type {
  OverdueItem,
  UpcomingRenewalItem,
} from "@/lib/subscriptions/types";

type Props = {
  upcomingRenewals: UpcomingRenewalItem[];
  overdueItems: OverdueItem[];
};

export function AttentionPanels({ upcomingRenewals, overdueItems }: Props) {
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <Panel title="Upcoming Renewals" action="View all">
        <div className="space-y-3">
          {upcomingRenewals.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-md border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-950">{item.service}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.date} · {item.cycle} · {item.amount}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} />
                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Mark Done
                </button>
              </div>
            </div>
          ))}
          {upcomingRenewals.length === 0 && (
            <p className="rounded-md border border-slate-200 p-4 text-sm text-slate-500">
              No upcoming renewals need attention.
            </p>
          )}
        </div>
      </Panel>

      <Panel title="Overdue Items" action="Resolve">
        <div className="space-y-3">
          {overdueItems.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-rose-200 bg-rose-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">
                    {item.service}
                  </p>
                  <p className="mt-1 text-sm text-rose-700">
                    Due {item.date} · {item.days} overdue
                  </p>
                </div>
                <p className="font-semibold text-slate-950">{item.amount}</p>
              </div>
              <button className="mt-3 rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800">
                Update Payment
              </button>
            </div>
          ))}
          {overdueItems.length === 0 && (
            <p className="rounded-md border border-slate-200 p-4 text-sm text-slate-500">
              No overdue subscriptions.
            </p>
          )}
        </div>
      </Panel>
    </section>
  );
}
