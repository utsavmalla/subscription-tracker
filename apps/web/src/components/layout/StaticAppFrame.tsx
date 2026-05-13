import type { ReactNode } from "react";

export function StaticAppFrame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#f8f5ee] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
}
