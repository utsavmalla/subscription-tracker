type Props = {
  monthlySpend: string;
  reviewThisWeekCount: number;
  overdueCount: number;
};

export function HeroSummary({
  monthlySpend,
  reviewThisWeekCount,
  overdueCount,
}: Props) {
  const upcomingCopy =
    reviewThisWeekCount === 1 ? "1 item needs review" : `${reviewThisWeekCount} items need review`;

  return (
    <section className="mt-6 rounded-lg border border-teal-100 bg-teal-800 p-5 text-white shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-normal">
            What needs attention right now?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
            {overdueCount} overdue and {upcomingCopy}. Review overdue records first,
            then clear upcoming items that have already been handled.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/12 p-4">
            <p className="text-sm text-teal-50">Monthly spend</p>
            <p className="mt-1 text-2xl font-bold">{monthlySpend}</p>
          </div>
          <div className="rounded-lg bg-white/12 p-4">
            <p className="text-sm text-teal-50">Review this week</p>
            <p className="mt-1 text-2xl font-bold">{reviewThisWeekCount} items</p>
          </div>
        </div>
      </div>
    </section>
  );
}
