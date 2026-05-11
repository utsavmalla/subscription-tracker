import { AlertsClient } from "@/components/alerts/AlertsClient";
import { AppShell } from "@/components/layout";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { listSubscriptions } from "@/server/subscriptions/service";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const user = await requireCurrentUser();
  const rows = await listSubscriptions(user.id);
  const alertsKey = rows
    .map((row) => `${row.id}:${row.status}:${row.done ? "done" : "open"}`)
    .join("|");

  return (
    <AppShell>
      <AlertsClient key={alertsKey} initialRows={rows} />
    </AppShell>
  );
}
