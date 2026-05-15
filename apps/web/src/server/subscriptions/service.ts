import { Prisma, type ReminderType, type Subscription } from "@prisma/client";
import {
  calculateSubscriptionStatus,
  type AlertState,
  type SubscriptionStatus,
} from "@/lib/subscriptions/status";
import {
  type ActionResult,
  type DashboardSummary,
  type SortDirection,
  type SubscriptionFormValues,
  type SubscriptionListFilters,
  type SubscriptionMutationInput,
  type SubscriptionRow,
  type SubscriptionSortField,
  toDisplayCycle,
} from "@/lib/subscriptions/types";
import { prisma } from "@/server/db/prisma";
import {
  describeStatusAction,
  formatAmount,
  formatDisplayDate,
  formatReadableDate,
  formatShortDate,
} from "./format";
import { validateSubscriptionInput } from "./validation";

const defaultSortField: SubscriptionSortField = "nextRenewal";
const defaultSortDirection: SortDirection = "asc";
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const reminderAlertStates = new Set<AlertState>(["Upcoming", "DueToday", "Overdue"]);

type RefreshSummary = {
  usersChecked: number;
  subscriptionsChecked: number;
  subscriptionsUpdated: number;
  remindersCreated: number;
};

export async function countSubscriptions(userId: string): Promise<number> {
  return prisma.subscription.count({ where: { userId } });
}

export async function listSubscriptions(
  userId: string,
  filters: SubscriptionListFilters = {},
): Promise<SubscriptionRow[]> {
  const subscriptions = await prisma.subscription.findMany({
    where: buildWhere(userId, filters),
    orderBy: buildOrderBy(filters.sortField, filters.sortDirection),
  });

  return subscriptions.map(mapSubscriptionRow);
}

export async function getSubscriptionById(
  userId: string,
  id: string,
): Promise<SubscriptionRow | null> {
  const subscription = await prisma.subscription.findFirst({
    where: { id, userId },
  });

  return subscription ? mapSubscriptionRow(subscription) : null;
}

export async function getSubscriptionFormValues(
  userId: string,
  id: string,
): Promise<SubscriptionFormValues | null> {
  const subscription = await prisma.subscription.findFirst({
    where: { id, userId },
  });

  return subscription ? mapSubscriptionFormValues(subscription) : null;
}

export async function createSubscription(
  userId: string,
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const validation = validateSubscriptionInput(input);
  if (!validation.ok) {
    return validation;
  }

  const status = calculateSubscriptionStatus(validation.data);
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      ...validation.data,
      status: status.status,
      alertState: status.alertState,
    },
  });

  return {
    ok: true,
    message: "Subscription saved.",
    id: subscription.id,
  };
}

export async function updateSubscription(
  userId: string,
  id: string,
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const validation = validateSubscriptionInput(input);
  if (!validation.ok) {
    return validation;
  }

  const existing = await prisma.subscription.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return {
      ok: false,
      message: "Subscription was not found.",
    };
  }

  const status = calculateSubscriptionStatus(validation.data);
  await prisma.subscription.update({
    where: { id_userId: { id, userId } },
    data: {
      ...validation.data,
      status: status.status,
      alertState: status.alertState,
    },
  });

  return {
    ok: true,
    message: "Subscription updated.",
    id,
  };
}

export async function deleteSubscription(
  userId: string,
  id: string,
): Promise<ActionResult> {
  const existing = await prisma.subscription.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return {
      ok: false,
      message: "Subscription was not found.",
    };
  }

  await prisma.subscription.delete({
    where: { id_userId: { id, userId } },
  });

  return {
    ok: true,
    message: "Subscription deleted.",
    id,
  };
}

export async function markSubscriptionDone(
  userId: string,
  id: string,
  done: boolean,
): Promise<ActionResult> {
  const subscription = await prisma.subscription.findFirst({
    where: { id, userId },
  });

  if (!subscription) {
    return {
      ok: false,
      message: "Subscription was not found.",
    };
  }

  const status = calculateSubscriptionStatus({
    renewalCycle: subscription.renewalCycle,
    done,
    nextRenewalDate: subscription.nextRenewalDate,
    expirationDate: subscription.expirationDate,
  });

  const updated = await prisma.subscription.update({
    where: { id_userId: { id, userId } },
    data: {
      done,
      status: status.status,
      alertState: status.alertState,
    },
  });

  return {
    ok: true,
    message: done ? "Subscription marked done." : "Subscription reopened.",
    id,
    subscription: mapSubscriptionRow(updated),
  };
}

export async function markSubscriptionPaid(
  userId: string,
  id: string,
): Promise<ActionResult> {
  const subscription = await prisma.subscription.findFirst({
    where: { id, userId },
  });

  if (!subscription) {
    return {
      ok: false,
      message: "Subscription was not found.",
    };
  }

  if (subscription.renewalCycle === "OneTime") {
    return {
      ok: false,
      message: "One-time subscriptions should be marked done instead.",
      id,
    };
  }

  if (!subscription.nextRenewalDate) {
    return {
      ok: false,
      message: "Next renewal date is required before marking this subscription paid.",
      id,
    };
  }

  const datePaid = startOfUtcDay(subscription.nextRenewalDate);
  const nextRenewalDate = addCycleMonths(datePaid, subscription.renewalCycle);
  const status = calculateSubscriptionStatus({
    renewalCycle: subscription.renewalCycle,
    done: false,
    nextRenewalDate,
    expirationDate: subscription.expirationDate,
  });

  const updated = await prisma.subscription.update({
    where: { id_userId: { id, userId } },
    data: {
      datePaid,
      nextRenewalDate,
      done: false,
      status: status.status,
      alertState: status.alertState,
    },
  });

  return {
    ok: true,
    message: "Subscription marked paid.",
    id,
    subscription: mapSubscriptionRow(updated),
  };
}

export async function refreshSubscriptionStatuses(userId: string) {
  const subscriptions = await prisma.subscription.findMany({ where: { userId } });

  return refreshSubscriptionBatch(subscriptions, 1);
}

export async function refreshAllSubscriptionStatuses() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: [{ userId: "asc" }, { nextRenewalDate: "asc" }, { expirationDate: "asc" }],
  });
  const usersChecked = new Set(subscriptions.map((subscription) => subscription.userId)).size;

  return refreshSubscriptionBatch(subscriptions, usersChecked);
}

async function refreshSubscriptionBatch(
  subscriptions: Subscription[],
  usersChecked: number,
): Promise<RefreshSummary> {
  let subscriptionsUpdated = 0;
  let remindersCreated = 0;

  for (const subscription of subscriptions) {
    const status = calculateSubscriptionStatus({
      renewalCycle: subscription.renewalCycle,
      done: subscription.done,
      nextRenewalDate: subscription.nextRenewalDate,
      expirationDate: subscription.expirationDate,
    });

    if (status.status !== subscription.status || status.alertState !== subscription.alertState) {
      await prisma.subscription.update({
        where: { id_userId: { id: subscription.id, userId: subscription.userId } },
        data: status,
      });
      subscriptionsUpdated += 1;
    }

    const reminder = buildReminderEvent(subscription, status.alertState);
    if (reminder) {
      const result = await prisma.reminderEvent.createMany({
        data: [reminder],
        skipDuplicates: true,
      });
      remindersCreated += result.count;
    }
  }

  return {
    usersChecked,
    subscriptionsChecked: subscriptions.length,
    subscriptionsUpdated,
    remindersCreated,
  };
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: [{ nextRenewalDate: "asc" }, { updatedAt: "desc" }],
  });

  const rows = subscriptions.map(mapSubscriptionRow);
  const activeCount = subscriptions.filter((item) => item.status === "Active").length;
  const upcomingCount = subscriptions.filter((item) => item.status === "Upcoming").length;
  const overdueCount = subscriptions.filter((item) => item.status === "Overdue").length;
  const expiredCount = subscriptions.filter((item) => item.status === "Expired").length;
  const dueTodayCount = subscriptions.filter((item) => item.status === "DueToday").length;
  const recurringSpend = sumUsd(
    subscriptions.filter((item) => item.renewalCycle !== "OneTime" && !item.done),
  );
  const oneTimeSpend = sumUsd(
    subscriptions.filter((item) => item.renewalCycle === "OneTime" && !item.done),
  );
  const reviewThisWeekCount = subscriptions.filter((item) =>
    ["Upcoming", "DueToday", "Overdue"].includes(item.status),
  ).length;

  return {
    metrics: [
      {
        label: "Total",
        value: String(subscriptions.length),
        helper: "Across all tracked services",
        tone: "border-slate-200 bg-white",
      },
      {
        label: "Active",
        value: String(activeCount),
        helper: "Currently renewing",
        tone: "border-emerald-200 bg-emerald-50",
      },
      {
        label: "Upcoming",
        value: String(upcomingCount + dueTodayCount),
        helper: "Due in the next 7 days",
        tone: "border-amber-200 bg-amber-50",
      },
      {
        label: "Overdue",
        value: String(overdueCount),
        helper: "Need payment review",
        tone: "border-rose-200 bg-rose-50",
      },
      {
        label: "Expired",
        value: String(expiredCount),
        helper: "One-time plans ended",
        tone: "border-stone-300 bg-stone-100",
      },
    ],
    upcomingRenewals: subscriptions
      .filter((item) => item.status === "Upcoming" || item.status === "DueToday")
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        service: item.serviceName,
        date: formatShortDate(item.nextRenewalDate ?? item.expirationDate),
        amount: formatAmount(item.usdAmount, item.currencyCode),
        cycle: toDisplayCycle(item.renewalCycle),
        status: item.status as SubscriptionStatus,
      })),
    overdueItems: subscriptions
      .filter((item) => item.status === "Overdue")
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        service: item.serviceName,
        date: formatShortDate(item.nextRenewalDate),
        amount: formatAmount(item.usdAmount, item.currencyCode),
        days: formatDaysOverdue(item.nextRenewalDate),
      })),
    recentUpdates: subscriptions
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map((item) => ({
        service: item.serviceName,
        detail: describeStatusAction(item.status as SubscriptionStatus),
        time: formatReadableDate(item.updatedAt),
      })),
    previewRows: rows.slice(0, 5),
    monthlySpend: formatAmount(recurringSpend + oneTimeSpend, "USD"),
    recurringSpend: formatAmount(recurringSpend, "USD"),
    oneTimeSpend: formatAmount(oneTimeSpend, "USD"),
    reviewThisWeekCount,
  };
}

function buildWhere(
  userId: string,
  filters: SubscriptionListFilters,
): Prisma.SubscriptionWhereInput {
  const where: Prisma.SubscriptionWhereInput = { userId };

  if (filters.search?.trim()) {
    const search = filters.search.trim();
    where.OR = [
      { serviceName: { contains: search, mode: "insensitive" } },
      { remarks: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filters.status && filters.status !== "All") {
    where.status = filters.status;
  }

  if (filters.cycle && filters.cycle !== "All") {
    where.renewalCycle = filters.cycle === "One-time" ? "OneTime" : filters.cycle;
  }

  if (filters.doneState && filters.doneState !== "All") {
    where.done = filters.doneState === "Done";
  }

  if (filters.dateRange && filters.dateRange !== "Any time") {
    where.nextRenewalDate = buildDateRange(filters.dateRange);
  }

  return where;
}

function buildOrderBy(
  sortField = defaultSortField,
  sortDirection = defaultSortDirection,
): Prisma.SubscriptionOrderByWithRelationInput[] {
  const direction = sortDirection === "desc" ? "desc" : "asc";

  switch (sortField) {
    case "service":
      return [{ serviceName: direction }];
    case "amount":
      return [{ usdAmount: direction }, { localAmount: direction }];
    case "expiration":
      return [{ expirationDate: direction }];
    case "updated":
      return [{ updatedAt: direction }];
    case "nextRenewal":
    default:
      return [{ nextRenewalDate: direction }, { expirationDate: direction }];
  }
}

function buildDateRange(
  dateRange: NonNullable<SubscriptionListFilters["dateRange"]>,
): Prisma.DateTimeNullableFilter {
  const today = startOfUtcDay(new Date());
  const end = new Date(today);

  if (dateRange === "This week") {
    end.setUTCDate(today.getUTCDate() + 7);
  } else if (dateRange === "Next 30 days") {
    end.setUTCDate(today.getUTCDate() + 30);
  } else {
    end.setUTCDate(today.getUTCDate() + 90);
  }

  return { gte: today, lte: end };
}

function mapSubscriptionRow(subscription: Subscription): SubscriptionRow {
  return {
    id: subscription.id,
    service: subscription.serviceName,
    amount: formatAmount(subscription.usdAmount, subscription.currencyCode),
    cycle: toDisplayCycle(subscription.renewalCycle),
    nextRenewal: formatDisplayDate(subscription.nextRenewalDate),
    expiration: formatDisplayDate(subscription.expirationDate),
    status: subscription.status as SubscriptionStatus,
    alertState: subscription.alertState as AlertState,
    done: subscription.done,
    updated: formatDisplayDate(subscription.updatedAt),
    remarks: subscription.remarks ?? "",
  };
}

function mapSubscriptionFormValues(subscription: Subscription): SubscriptionFormValues {
  return {
    id: subscription.id,
    service: subscription.serviceName,
    amount: subscription.usdAmount?.toString() ?? "",
    cycle: toDisplayCycle(subscription.renewalCycle),
    nextRenewal: formatDisplayDate(subscription.nextRenewalDate),
    expiration: formatDisplayDate(subscription.expirationDate),
    datePaid: formatDisplayDate(subscription.datePaid),
    done: subscription.done,
    remarks: subscription.remarks ?? "",
  };
}

function formatDaysOverdue(value: Date | null): string {
  if (!value) {
    return "Unknown";
  }

  const today = startOfUtcDay(new Date());
  const dueDate = startOfUtcDay(value);
  const days = Math.max(1, Math.round((today.getTime() - dueDate.getTime()) / millisecondsPerDay));
  return days === 1 ? "1 day" : `${days} days`;
}

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function addCycleMonths(date: Date, cycle: Subscription["renewalCycle"]): Date {
  const monthsToAdd = getCycleMonthIncrement(cycle);
  const targetMonthIndex = date.getUTCMonth() + monthsToAdd;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const normalizedTargetMonthIndex = targetMonthIndex % 12;
  const targetDay = Math.min(
    date.getUTCDate(),
    getDaysInMonth(targetYear, normalizedTargetMonthIndex),
  );

  return new Date(Date.UTC(targetYear, normalizedTargetMonthIndex, targetDay));
}

function getCycleMonthIncrement(cycle: Subscription["renewalCycle"]): number {
  switch (cycle) {
    case "Monthly":
      return 1;
    case "Quarterly":
      return 3;
    case "Yearly":
      return 12;
    case "OneTime":
      return 0;
  }
}

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function buildReminderEvent(
  subscription: Subscription,
  alertState: AlertState,
): Prisma.ReminderEventCreateManyInput | null {
  const reminderType = toReminderType(alertState);
  if (!reminderType) {
    return null;
  }

  const scheduledFor =
    subscription.renewalCycle === "OneTime"
      ? subscription.expirationDate
      : subscription.nextRenewalDate;

  if (!scheduledFor) {
    return null;
  }

  return {
    userId: subscription.userId,
    subscriptionId: subscription.id,
    reminderType,
    scheduledFor: startOfUtcDay(scheduledFor),
  };
}

function toReminderType(alertState: AlertState): ReminderType | null {
  if (!reminderAlertStates.has(alertState)) {
    return null;
  }

  return alertState as ReminderType;
}

function sumUsd(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, item) => total + Number(item.usdAmount ?? 0), 0);
}
