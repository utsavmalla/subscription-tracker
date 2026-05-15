import type {
  AlertState,
  RenewalCycle,
  SubscriptionStatus,
} from "@/lib/subscriptions/status";

export type SubscriptionDisplayCycle = "Monthly" | "Quarterly" | "Yearly" | "One-time";

export type SubscriptionRow = {
  id: string;
  service: string;
  amount: string;
  cycle: SubscriptionDisplayCycle;
  nextRenewal: string;
  expiration: string;
  status: SubscriptionStatus;
  alertState: AlertState;
  done: boolean;
  updated: string;
  remarks: string;
};

export type SubscriptionFormValues = {
  id: string;
  service: string;
  amount: string;
  cycle: SubscriptionDisplayCycle;
  nextRenewal: string;
  expiration: string;
  datePaid: string;
  done: boolean;
  remarks: string;
};

export type SubscriptionSortField =
  | "service"
  | "amount"
  | "nextRenewal"
  | "expiration"
  | "updated";

export type SortDirection = "asc" | "desc";

export type SubscriptionListFilters = {
  search?: string;
  status?: "All" | SubscriptionStatus;
  cycle?: "All" | SubscriptionDisplayCycle;
  doneState?: "All" | "Done" | "Not done";
  dateRange?: "Any time" | "This week" | "Next 30 days" | "This quarter";
  sortField?: SubscriptionSortField;
  sortDirection?: SortDirection;
};

export type SubscriptionMutationInput = {
  service: string;
  amount: string;
  cycle: SubscriptionDisplayCycle;
  nextRenewal: string;
  expiration: string;
  datePaid?: string;
  done: boolean;
  remarks: string;
};

export type ActionResult = {
  ok: boolean;
  message: string;
  id?: string;
  subscription?: SubscriptionRow;
  fieldErrors?: Partial<Record<keyof SubscriptionMutationInput, string>>;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
  tone: string;
};

export type UpcomingRenewalItem = {
  id: string;
  service: string;
  date: string;
  amount: string;
  cycle: SubscriptionDisplayCycle;
  status: SubscriptionStatus;
};

export type OverdueItem = {
  id: string;
  service: string;
  date: string;
  amount: string;
  days: string;
};

export type RecentUpdateItem = {
  service: string;
  detail: string;
  time: string;
};

export type DashboardSummary = {
  metrics: DashboardMetric[];
  upcomingRenewals: UpcomingRenewalItem[];
  overdueItems: OverdueItem[];
  recentUpdates: RecentUpdateItem[];
  previewRows: SubscriptionRow[];
  monthlySpend: string;
  recurringSpend: string;
  oneTimeSpend: string;
  reviewThisWeekCount: number;
};

export function toModelCycle(cycle: SubscriptionDisplayCycle): RenewalCycle {
  return cycle === "One-time" ? "OneTime" : cycle;
}

export function toDisplayCycle(cycle: RenewalCycle): SubscriptionDisplayCycle {
  return cycle === "OneTime" ? "One-time" : cycle;
}
