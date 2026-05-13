import { EmptyState, Panel } from "@/components/ui";
import type { RecentUpdateItem } from "@/lib/subscriptions/types";

type Props = {
  monthlySpend: string;
  recurringSpend: string;
  oneTimeSpend: string;
  recentUpdates: RecentUpdateItem[];
};

export function SpendAndUpdates({
  monthlySpend,
  recurringSpend,
  oneTimeSpend,
  recentUpdates,
}: Props) {
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Panel title="Monthly Spend Estimate">
        <p className="text-3xl font-bold text-slate-950">{monthlySpend}</p>
        <p className="mt-1 text-sm text-slate-500">
          Estimated recurring spend based on active subscriptions.
        </p>
        <div className="mt-5 space-y-3">
          <SpendBar label="Recurring" value={recurringSpend} width="w-[82%]" />
          <SpendBar
            label="One-time"
            value={oneTimeSpend}
            width="w-[18%]"
            color="bg-amber-500"
          />
        </div>
      </Panel>

      <Panel title="Recent Updates">
        <div className="space-y-3">
          {recentUpdates.map((update) => (
            <div
              key={`${update.service}-${update.detail}`}
              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
            >
              <div>
                <p className="font-semibold text-slate-950">
                  {update.service}
                </p>
                <p className="text-sm text-slate-500">{update.detail}</p>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {update.time}
              </p>
            </div>
          ))}
          {recentUpdates.length === 0 && (
            <EmptyState
              title="No recent updates"
              description="Create or edit a subscription to see activity here."
            />
          )}
        </div>
      </Panel>
    </section>
  );
}

function SpendBar({
  label,
  value,
  width,
  color = "bg-teal-700",
}: Readonly<{
  label: string;
  value: string;
  width: string;
  color?: string;
}>) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${width} ${color}`} />
      </div>
    </div>
  );
}
