import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout";
import { SubscriptionDetails } from "@/components/subscriptions/SubscriptionDetails";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { getSubscriptionById } from "@/server/subscriptions/service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function SubscriptionDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const subscription = await getSubscriptionById(user.id, id);
  if (!subscription) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Subscription detail
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {subscription.service}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/subscriptions"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to list
          </Link>
          <Link
            href={`/subscriptions/${subscription.id}/edit`}
            className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Edit subscription
          </Link>
        </div>
      </div>

      <SubscriptionDetails subscription={subscription} />
    </AppShell>
  );
}
