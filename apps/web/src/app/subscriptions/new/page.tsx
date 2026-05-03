import { AppShell } from "@/components/layout";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { initialSubscriptionValues } from "@/data/subscriptions";

export default function NewSubscriptionPage() {
  return (
    <AppShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Add subscription
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            New subscription record
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Create a new subscription entry and save it to the list.
          </p>
        </div>

        <SubscriptionForm
          initialValues={initialSubscriptionValues}
          redirectTo="/subscriptions"
          resetAfterSave
        />
      </div>
    </AppShell>
  );
}
