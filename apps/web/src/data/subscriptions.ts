import {
  calculateSubscriptionStatus,
  type RenewalCycle as SharedRenewalCycle,
  type SubscriptionStatus,
} from "@/lib/subscriptions/status";
import type {
  SubscriptionDisplayCycle,
  SubscriptionFormValues,
  SubscriptionRow,
} from "@/lib/subscriptions/types";

export type { SubscriptionFormValues, SubscriptionRow };

export const statusOptions = ["All", "Active", "Upcoming", "DueToday", "Overdue", "Expired"] as const;
export const cycleOptions = ["All", "Monthly", "Quarterly", "Yearly", "One-time"] as const;
export const doneOptions = ["All", "Done", "Not done"] as const;
export const dateRangeOptions = ["Any time", "This week", "Next 30 days", "This quarter"] as const;

const displayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const subscriptionRows: SubscriptionRow[] = [
  {
    id: "1",
    service: "Netflix",
    amount: "$15.49",
    cycle: "Monthly",
    nextRenewal: "2026-05-04",
    expiration: "2027-05-04",
    status: "Upcoming",
    alertState: "Upcoming",
    done: false,
    updated: "2026-04-28",
    remarks: "Family streaming plan",
  },
  {
    id: "2",
    service: "Canva Pro",
    amount: "$12.99",
    cycle: "Monthly",
    nextRenewal: "2026-04-28",
    expiration: "2027-04-28",
    status: "Overdue",
    alertState: "Overdue",
    done: false,
    updated: "2026-04-26",
    remarks: "Team design workspace",
  },
  {
    id: "3",
    service: "Domain Renewal",
    amount: "$18.00",
    cycle: "Yearly",
    nextRenewal: "2026-09-22",
    expiration: "2027-09-22",
    status: "Active",
    alertState: "None",
    done: true,
    updated: "2026-04-25",
    remarks: "Company domain registration",
  },
  {
    id: "4",
    service: "Adobe Creative Cloud",
    amount: "$54.99",
    cycle: "Monthly",
    nextRenewal: "2026-05-06",
    expiration: "2027-05-06",
    status: "Upcoming",
    alertState: "Upcoming",
    done: false,
    updated: "2026-04-30",
    remarks: "Creative suite for content team",
  },
  {
    id: "5",
    service: "Spotify",
    amount: "$10.99",
    cycle: "Monthly",
    nextRenewal: "2026-05-08",
    expiration: "2027-05-08",
    status: "Upcoming",
    alertState: "Upcoming",
    done: false,
    updated: "2026-04-27",
    remarks: "Music account",
  },
];

export const initialSubscriptionValues: SubscriptionFormValues = {
  id: "",
  service: "",
  amount: "",
  cycle: "Monthly",
  nextRenewal: new Date().toISOString().slice(0, 10),
  expiration: new Date().toISOString().slice(0, 10),
  datePaid: "",
  done: false,
  remarks: "",
};

export function getSubscriptionById(id: string) {
  return subscriptionRows.find((row) => row.id === id) ?? null;
}

export function formatDate(value: string) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return displayFormatter.format(date);
}

export function computeSubscriptionStatus(values: Pick<SubscriptionFormValues, "done" | "cycle" | "nextRenewal" | "expiration">): SubscriptionStatus {
  return calculateSubscriptionStatus({
    renewalCycle: toSharedRenewalCycle(values.cycle),
    done: values.done,
    nextRenewalDate: values.nextRenewal,
    expirationDate: values.expiration,
  }).status;
}

function toSharedRenewalCycle(cycle: SubscriptionDisplayCycle): SharedRenewalCycle {
  return cycle === "One-time" ? "OneTime" : cycle;
}
