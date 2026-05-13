import { StaticAppFrame } from "@/components/layout";
import { Skeleton } from "@/components/ui";

export default function AlertsLoading() {
  return (
    <StaticAppFrame>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-full max-w-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-32 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-6 h-6 w-40" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      </section>
    </StaticAppFrame>
  );
}
