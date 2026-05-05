import { AppShell } from "@/components/layout";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { getSubscriptionFormValues } from "@/server/subscriptions/service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditSubscriptionPage({ params }: Props) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const subscription = await getSubscriptionFormValues(user.id, id);
  if (!subscription) {
    notFound();
  }

  return (
    <AppShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Edit subscription
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Update {subscription.service}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Adjust the subscription details and save the latest version.
          </p>
        </div>

        <SubscriptionForm
          initialValues={subscription}
          submitLabel="Save changes"
          redirectTo="/subscriptions"
        />
      </div>
    </AppShell>
  );
}
