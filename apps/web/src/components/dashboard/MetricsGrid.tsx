import type { DashboardMetric } from "@/lib/subscriptions/types";

type Props = {
  metrics: DashboardMetric[];
};

export function MetricsGrid({ metrics }: Props) {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={`rounded-lg border p-4 shadow-sm ${metric.tone}`}
        >
          <p className="text-sm font-medium text-slate-600">{metric.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {metric.value}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {metric.helper}
          </p>
        </article>
      ))}
    </section>
  );
}
