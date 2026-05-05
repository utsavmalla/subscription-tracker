import { requireCurrentApiUser } from "@/server/auth/currentUser";
import { getDashboardSummary } from "@/server/subscriptions/service";

export async function GET() {
  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  const summary = await getDashboardSummary(user.id);

  return Response.json({ summary });
}
