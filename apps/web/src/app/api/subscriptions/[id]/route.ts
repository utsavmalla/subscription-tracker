import type { NextRequest } from "next/server";
import { requireCurrentApiUser } from "@/server/auth/currentUser";
import { getSubscriptionById } from "@/server/subscriptions/service";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/subscriptions/[id]">,
) {
  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  const { id } = await context.params;
  const subscription = await getSubscriptionById(user.id, id);

  if (!subscription) {
    return Response.json({ error: "Subscription not found." }, { status: 404 });
  }

  return Response.json({ subscription });
}
