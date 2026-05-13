type SkeletonProps = Readonly<{
  className?: string;
}>;

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 6 }: Readonly<{ rows?: number }>) {
  return (
    <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block">
      <div className="grid grid-cols-7 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-4" />
        ))}
      </div>
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-4 px-4 py-4">
            {Array.from({ length: 7 }).map((_, cellIndex) => (
              <Skeleton key={cellIndex} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardListSkeleton({ rows = 3 }: Readonly<{ rows?: number }>) {
  return (
    <div className="space-y-4 md:hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-full max-w-[220px] space-y-2">
              <Skeleton className="h-5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
