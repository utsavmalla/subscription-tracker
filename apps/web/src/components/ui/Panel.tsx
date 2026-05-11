import type { ReactNode } from "react";
import Link from "next/link";

type PanelProps = Readonly<{
  title: string;
  action?: string;
  actionHref?: string;
  children: ReactNode;
}>;

export function Panel({ title, action, actionHref, children }: PanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {action && actionHref ? (
          <Link
            href={actionHref}
            className="text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            {action}
          </Link>
        ) : action ? (
          <button className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
