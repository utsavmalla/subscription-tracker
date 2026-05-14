import type { NextRequest } from "next/server";
import { requireCurrentApiUser } from "@/server/auth/currentUser";
import { exportSubscriptionsCsv } from "@/server/subscriptions/csv";
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

  if (user.isAnonymous) {
    return Response.json(
      { message: "CSV export is available after signing in with email." },
      { status: 403 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const includeFilters = searchParams.get("scope") === "filtered";
  const csv = await exportSubscriptionsCsv(
    user.id,
    includeFilters
      ? {
          search: searchParams.get("search") ?? undefined,
          status: searchParams.get("status") as SubscriptionListFilters["status"],
          cycle: searchParams.get("cycle") as SubscriptionListFilters["cycle"],
          doneState: searchParams.get("doneState") as SubscriptionListFilters["doneState"],
          dateRange: searchParams.get("dateRange") as SubscriptionListFilters["dateRange"],
          sortField: searchParams.get("sortField") as SubscriptionSortField | undefined,
          sortDirection: searchParams.get("sortDirection") as SortDirection | undefined,
        }
      : {},
  );

  const filename = `subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
