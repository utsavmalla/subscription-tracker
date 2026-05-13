import { StaticAppFrame } from "@/components/layout";
import { Skeleton } from "@/components/ui";

export default function SettingsLoading() {
  return (
    <StaticAppFrame>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-full max-w-md" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </div>
      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </section>
    </StaticAppFrame>
  );
}
