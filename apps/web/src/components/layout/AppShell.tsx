import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#f8f5ee] text-slate-950">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="mb-8">
            <p className="text-xl font-bold text-teal-800">SubTrack</p>
            <p className="mt-1 text-sm text-slate-500">Subscription tracker</p>
          </div>
          <SidebarNav />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-teal-800">SubTrack</p>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
              <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
                Add
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
