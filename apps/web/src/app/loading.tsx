import { StaticAppFrame } from "@/components/layout";
import { Skeleton } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <StaticAppFrame>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-9 w-full max-w-md" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </div>
      <Skeleton className="mt-6 h-36" />
      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </section>
      <section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </section>
    </StaticAppFrame>
  );
}
