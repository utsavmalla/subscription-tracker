import { requireCurrentApiUser } from "@/server/auth/currentUser";
import {
  refreshAllSubscriptionStatuses,
  refreshSubscriptionStatuses,
} from "@/server/subscriptions/service";

export async function POST(request: Request) {
  const authorizedJob = isAuthorizedScheduledRefresh(request);
  if (authorizedJob === true) {
    const result = await refreshAllSubscriptionStatuses();
    return Response.json(result);
  }

  if (authorizedJob === false) {
    return Response.json({ message: "Unauthorized reminder refresh." }, { status: 401 });
  }

  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  const result = await refreshSubscriptionStatuses(user.id);

  return Response.json(result);
}

function isAuthorizedScheduledRefresh(request: Request): boolean | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(/\s+/, 2);
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return false;
  }

  const expectedSecret = process.env.REMINDER_REFRESH_SECRET;
  if (!expectedSecret) {
    return false;
  }

  return token === expectedSecret;
}
