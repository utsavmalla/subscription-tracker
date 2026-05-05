import { getCurrentUser } from "@/server/auth/currentUser";
import { refreshSubscriptionStatuses } from "@/server/subscriptions/service";

export async function POST() {
  const user = await getCurrentUser();
  const result = await refreshSubscriptionStatuses(user.id);

  return Response.json(result);
}
