"use client";

import { StaticAppFrame } from "@/components/layout/StaticAppFrame";
import { ErrorNotice } from "@/components/ui";

export default function AlertsError({
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <StaticAppFrame>
      <ErrorNotice
        title="Alerts could not load"
        message="Refresh the alerts queue and try again."
      />
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
      >
        Try again
      </button>
    </StaticAppFrame>
  );
}
