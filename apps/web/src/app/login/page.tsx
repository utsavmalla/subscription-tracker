import { redirect } from "next/navigation";
import {
  continueAsGuestAction,
  sendMagicLinkAction,
} from "@/actions/auth";
import { getCurrentUser } from "@/server/auth/currentUser";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ message?: string }>;
};

const featureHighlights = [
  {
    eyebrow: "Inbox ready",
    title: "Email renewal alerts",
    description:
      "Get renewal reminders in your inbox before upcoming charges, overdue payments, or one-time access dates slip by.",
    icon: "@",
    meta: "Email + dashboard",
    accentClass: "border-teal-200 bg-teal-50 text-teal-800",
    iconClass: "bg-teal-700 text-white",
    cardClass: "sm:col-span-2",
  },
  {
    eyebrow: "Focus queue",
    title: "Attention dashboard",
    description:
      "See upcoming, due today, overdue, and expired subscriptions in one focused workspace.",
    icon: "!",
    meta: "Review this week",
    accentClass: "border-amber-200 bg-amber-50 text-amber-800",
    iconClass: "bg-amber-500 text-white",
  },
  {
    eyebrow: "Spend map",
    title: "Spend clarity",
    description:
      "Review recurring and one-time costs so monthly obligations are easier to understand.",
    icon: "$",
    meta: "Recurring + one-time",
    accentClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconClass: "bg-emerald-600 text-white",
  },
  {
    eyebrow: "Data portable",
    title: "CSV migration",
    description:
      "Import and export subscription records when moving from spreadsheet tracking.",
    icon: "CSV",
    meta: "Import / export",
    accentClass: "border-slate-200 bg-slate-50 text-slate-700",
    iconClass: "bg-slate-800 text-white",
  },
  {
    eyebrow: "Try first",
    title: "Guest trial",
    description:
      "Try up to 10 subscriptions before adding an email to keep your workspace.",
    icon: "10",
    meta: "Limited workspace",
    accentClass: "border-sky-200 bg-sky-50 text-sky-800",
    iconClass: "bg-sky-700 text-white",
  },
];

const previewRows = [
  {
    service: "Figma Pro",
    status: "Renews in 3 days",
    amount: "$15",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    service: "Domain renewal",
    status: "Expires today",
    amount: "$18",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-800",
  },
  {
    service: "Cloud hosting",
    status: "Overdue",
    amount: "$42",
    badgeClass: "border-red-200 bg-red-50 text-red-800",
  },
];

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const { message } = await searchParams;

  if (user && !user.isAnonymous) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <section className="py-4 lg:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            SubTrack
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            Know which subscriptions need attention before they cost you.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            SubTrack helps you manage recurring subscriptions, one-time access,
            renewal dates, overdue payments, monthly spend, and email renewal
            alerts from one practical dashboard.
          </p>

          <div className="mt-8 rounded-lg border border-teal-100 bg-teal-800 p-5 text-white shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-50">
                  Dashboard preview
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-normal">
                  Review renewals in one place.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                  Scan upcoming renewals, overdue items, email reminder moments,
                  and monthly obligations without maintaining another spreadsheet
                  by hand.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-sm">
                <div className="rounded-lg bg-white/12 p-4">
                  <p className="text-sm text-teal-50">Monthly spend</p>
                  <p className="mt-1 text-2xl font-bold">$248.90</p>
                </div>
                <div className="rounded-lg bg-white/12 p-4">
                  <p className="text-sm text-teal-50">Review this week</p>
                  <p className="mt-1 text-2xl font-bold">6 items</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {previewRows.map((row) => (
                <div
                  key={row.service}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 text-slate-950"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {row.service}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{row.amount}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${row.badgeClass}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${feature.cardClass ?? ""}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${feature.iconClass}`}
                  >
                    {feature.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {feature.eyebrow}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${feature.accentClass}`}
                      >
                        {feature.meta}
                      </span>
                    </div>
                    <h2 className="mt-2 text-base font-bold text-slate-950">
                      {feature.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-500">
            Permanent accounts use email magic links. Guest mode is limited and
            can be lost if browser data is cleared.
          </p>
        </section>

        <section className="flex flex-col justify-center pb-4 lg:pb-0">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                SubTrack
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {user?.isAnonymous ? "Upgrade guest account" : "Sign in"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {user?.isAnonymous
                  ? "Add an email to keep your guest subscriptions and continue without the trial cap."
                  : "Use a magic link or continue as a guest with a limited trial workspace."}
              </p>
            </div>

            {message && (
              <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
                {message}
              </div>
            )}

            <form action={sendMagicLinkAction} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-900">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
              >
                {user?.isAnonymous ? "Send upgrade link" : "Send magic link"}
              </button>
            </form>

            {!user && (
              <form action={continueAsGuestAction} className="mt-3">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Continue as guest
                </button>
              </form>
            )}

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Guest mode is limited to 10 subscriptions and does not include
              import or export. Clearing browser data can remove guest access.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
