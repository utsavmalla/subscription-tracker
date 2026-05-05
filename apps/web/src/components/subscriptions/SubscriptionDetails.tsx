import { StatusBadge } from "@/components/ui";
import type { SubscriptionRow } from "@/lib/subscriptions/types";
import { formatDate } from "@/data/subscriptions";

type Props = {
  subscription: SubscriptionRow;
};

export function SubscriptionDetails({ subscription }: Props) {
  const isExpired = new Date(subscription.expiration) < new Date();
  const isOneTime = subscription.cycle === "One-time";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Subscription details
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {subscription.service}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Review the full subscription record and use the edit flow to update amounts, dates, or status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={subscription.status} />
          {subscription.done && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Completed
            </span>
          )}
          {isExpired && isOneTime && (
            <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Expired one-time subscription
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-900">Amount</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{subscription.amount}</p>
          <p className="mt-2 text-sm text-slate-600">{subscription.cycle}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Next renewal</p>
              <p className="mt-2 text-sm text-slate-600">{formatDate(subscription.nextRenewal)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Expiration</p>
              <p className="mt-2 text-sm text-slate-600">{formatDate(subscription.expiration)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Last updated</p>
              <p className="mt-2 text-sm text-slate-600">{formatDate(subscription.updated)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm font-semibold text-slate-900">Remarks</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{subscription.remarks}</p>
      </div>
    </section>
  );
}
