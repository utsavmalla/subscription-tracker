import { requireCurrentApiUser } from "@/server/auth/currentUser";
import { refreshSubscriptionStatuses } from "@/server/subscriptions/service";

export async function POST() {
  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  const result = await refreshSubscriptionStatuses(user.id);

  return Response.json(result);
}
