import { StaticAppFrame } from "@/components/layout";
import { CardListSkeleton, Skeleton, TableSkeleton } from "@/components/ui";

export default function SubscriptionsLoading() {
  return (
    <StaticAppFrame>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-9 w-full max-w-lg" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </div>
      <Skeleton className="mt-6 h-28" />
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="mb-4 h-6 w-44" />
        <TableSkeleton />
        <CardListSkeleton />
      </section>
    </StaticAppFrame>
  );
}
