import type { NextRequest } from "next/server";
import { requireCurrentApiUser } from "@/server/auth/currentUser";
import { listSubscriptions } from "@/server/subscriptions/service";
import type {
  SortDirection,
  SubscriptionListFilters,
  SubscriptionSortField,
} from "@/lib/subscriptions/types";

export async function GET(request: NextRequest) {
  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  const searchParams = request.nextUrl.searchParams;
  const rows = await listSubscriptions(user.id, {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") as SubscriptionListFilters["status"],
    cycle: searchParams.get("cycle") as SubscriptionListFilters["cycle"],
    doneState: searchParams.get("doneState") as SubscriptionListFilters["doneState"],
    dateRange: searchParams.get("dateRange") as SubscriptionListFilters["dateRange"],
    sortField: searchParams.get("sortField") as SubscriptionSortField | undefined,
    sortDirection: searchParams.get("sortDirection") as SortDirection | undefined,
  });

  return Response.json({ rows });
}
