"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";

type MobileNavProps = Readonly<{
  accountLabel: string;
  isAnonymous: boolean;
  signOutAction: () => Promise<void>;
}>;

export function MobileNav({
  accountLabel,
  isAnonymous,
  signOutAction,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition ${
                isOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-teal-800">SubTrack</p>
          <p className="truncate text-xs text-slate-500">{accountLabel}</p>
        </div>

        <Link
          href="/subscriptions/new"
          className="shrink-0 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
        >
          Add
        </Link>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-[65px] z-20 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full bg-slate-950/30"
            onClick={() => setIsOpen(false)}
          />
          <div
            id={menuId}
            className="relative max-h-[calc(100dvh-65px)] overflow-y-auto border-b border-slate-200 bg-white px-4 py-5 shadow-xl"
          >
            <SidebarNav onNavigate={() => setIsOpen(false)} />

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Account
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                {accountLabel}
              </p>
              {isAnonymous && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
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
        </div>
      )}
    </header>
  );
}
