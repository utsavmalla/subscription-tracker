import { getCurrentUser } from "@/server/auth/currentUser";
import { getDashboardSummary } from "@/server/subscriptions/service";

export async function GET() {
  const user = await getCurrentUser();
  const summary = await getDashboardSummary(user.id);

  return Response.json({ summary });
}
