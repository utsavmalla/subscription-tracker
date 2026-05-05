import { Dashboard } from "@/components/dashboard";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { getDashboardSummary } from "@/server/subscriptions/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await requireCurrentUser();
  const summary = await getDashboardSummary(user.id);

  return <Dashboard summary={summary} />;
}
