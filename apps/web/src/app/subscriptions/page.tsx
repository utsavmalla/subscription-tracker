import { AppShell } from "@/components/layout";
import { SubscriptionListClient } from "@/components/subscriptions/SubscriptionListClient";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { listSubscriptions } from "@/server/subscriptions/service";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const user = await requireCurrentUser();
  const rows = await listSubscriptions(user.id);

  return (
    <AppShell>
      <SubscriptionListClient initialRows={rows} />
    </AppShell>
  );
}
