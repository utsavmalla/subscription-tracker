import type { AlertState, SubscriptionStatus } from "@/lib/subscriptions/status";

type AlertTone = AlertState | SubscriptionStatus;

const containerStyles: Partial<Record<AlertTone, string>> = {
  Upcoming: "border-amber-200 bg-amber-50/70",
  DueToday: "border-orange-300 bg-orange-50/80",
  Overdue: "border-rose-200 bg-rose-50/80",
  Expired: "border-stone-300 bg-stone-100/80",
  Completed: "border-slate-200 bg-slate-50",
};

const tableRowStyles: Partial<Record<AlertTone, string>> = {
  Upcoming: "bg-amber-50/55",
  DueToday: "bg-orange-50/70",
  Overdue: "bg-rose-50/70",
  Expired: "bg-stone-100/70",
  Completed: "bg-slate-50",
};

const accentStyles: Partial<Record<AlertTone, string>> = {
  Upcoming: "border-l-amber-400",
  DueToday: "border-l-orange-500",
  Overdue: "border-l-rose-500",
  Expired: "border-l-stone-500",
  Completed: "border-l-slate-300",
};

export function getAlertContainerClass(status: AlertTone) {
  return containerStyles[status] ?? "border-slate-200 bg-white";
}

export function getAlertTableRowClass(status: AlertTone) {
  return tableRowStyles[status] ?? "bg-white";
}

export function getAlertAccentClass(status: AlertTone) {
  return accentStyles[status] ?? "border-l-slate-200";
}
