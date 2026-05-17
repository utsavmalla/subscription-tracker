import type { ReactNode } from "react";
import Link from "next/link";

import { signOutAction } from "@/actions/auth";
import { MobileNav } from "@/components/layout/MobileNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { requireCurrentUser } from "@/server/auth/currentUser";

export async function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireCurrentUser();
  const accountLabel = user.isAnonymous
    ? "Guest workspace"
    : (user.email ?? "Signed in");

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-slate-950">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <p className="text-xl font-bold text-teal-800">SubTrack</p>
              <p className="mt-1 text-sm text-slate-500">Subscription tracker</p>
            </div>
            <SidebarNav />
            <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Account
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                {accountLabel}
              </p>
              {user.isAnonymous && (
                <Link
                  href="/login"
                  className="mt-3 inline-flex rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Upgrade
                </Link>
              )}
              <form action={signOutAction} className="mt-3">
                <button className="text-sm font-semibold text-slate-600 hover:text-slate-950">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <MobileNav
            accountLabel={accountLabel}
            isAnonymous={user.isAnonymous}
            signOutAction={signOutAction}
          />

          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
