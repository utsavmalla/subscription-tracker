import { AppShell } from "@/components/layout";
import { Panel } from "@/components/ui";

const settingRows = [
  {
    label: "Default currency",
    value: "USD",
    helper: "Currency display will become configurable when multi-currency support is added.",
  },
  {
    label: "Reminder window",
    value: "7 days",
    helper: "Renewal reminders currently use the MVP seven-day upcoming window.",
  },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Workspace preferences
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review planned preferences for currency, reminder timing, and future email alerts.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Placeholders
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Display and reminders">
          <div className="space-y-4">
            {settingRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-950">{row.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {row.helper}
                  </p>
                </div>
                <div className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 sm:w-36">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Email reminders">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-950">Email alerts</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Email delivery is planned for the later reminder integration milestone.
                </p>
              </div>
              <div
                className="relative h-7 w-12 shrink-0 rounded-full bg-slate-300"
                aria-label="Email alerts off"
                role="switch"
                aria-checked="false"
                aria-disabled="true"
              >
                <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
