import type { SubscriptionStatus } from "@/lib/subscriptions/status";

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatDisplayDate(value: Date | string | null | undefined): string {
  const date = parseOptionalDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

export function formatReadableDate(value: Date | string | null | undefined): string {
  const date = parseOptionalDate(value);
  return date ? displayDateFormatter.format(date) : "Not set";
}

export function formatShortDate(value: Date | string | null | undefined): string {
  const date = parseOptionalDate(value);
  return date ? shortDateFormatter.format(date) : "Not set";
}

export function formatAmount(value: unknown, currencyCode?: string | null): string {
  if (value === null || value === undefined) {
    return "Not set";
  }

  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return "Not set";
  }

  if (!currencyCode || currencyCode === "USD") {
    return currencyFormatter.format(amount);
  }

  return `${amount.toFixed(2)} ${currencyCode}`;
}

export function describeStatusAction(status: SubscriptionStatus): string {
  if (status === "Completed") {
    return "Marked done";
  }

  return "Updated";
}

function parseOptionalDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? new Date(`${value}T00:00:00.000Z`) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}
