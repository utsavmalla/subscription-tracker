export const renewalCycles = ['Monthly', 'Quarterly', 'Yearly', 'OneTime'] as const;

export type RenewalCycle = (typeof renewalCycles)[number];

export const subscriptionStatuses = [
  'Active',
  'Upcoming',
  'DueToday',
  'Overdue',
  'Expired',
  'Completed',
] as const;

export type SubscriptionStatus = (typeof subscriptionStatuses)[number];

export const alertStates = ['None', 'Upcoming', 'DueToday', 'Overdue', 'Expired'] as const;

export type AlertState = (typeof alertStates)[number];

export type StatusCalculationInput = {
  renewalCycle: RenewalCycle;
  done?: boolean;
  nextRenewalDate?: Date | string | null;
  expirationDate?: Date | string | null;
  today?: Date | string;
};

export type StatusCalculationResult = {
  status: SubscriptionStatus;
  alertState: AlertState;
};

const upcomingWindowDays = 7;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function calculateSubscriptionStatus(
  input: StatusCalculationInput,
): StatusCalculationResult {
  const today = startOfUtcDay(input.today ?? new Date());

  if (input.done) {
    return { status: 'Completed', alertState: 'None' };
  }

  if (input.renewalCycle === 'OneTime') {
    return calculateOneTimeStatus(input.expirationDate, today);
  }

  return calculateRecurringStatus(input.nextRenewalDate, today);
}

export function hasAutoRenewalCancelRemark(remarks?: string | null): boolean {
  return /\bauto\s+renewal\s+cancel(?:led|ed)?\b/i.test(remarks ?? '');
}

function calculateOneTimeStatus(
  expirationDate: Date | string | null | undefined,
  today: Date,
): StatusCalculationResult {
  const expirationDay = parseOptionalDay(expirationDate);

  if (!expirationDay) {
    return { status: 'Active', alertState: 'None' };
  }

  const dayDifference = diffInDays(expirationDay, today);

  if (dayDifference < 0) {
    return { status: 'Expired', alertState: 'Expired' };
  }

  if (dayDifference === 0) {
    return { status: 'DueToday', alertState: 'DueToday' };
  }

  return { status: 'Active', alertState: 'None' };
}

function calculateRecurringStatus(
  nextRenewalDate: Date | string | null | undefined,
  today: Date,
): StatusCalculationResult {
  const renewalDay = parseOptionalDay(nextRenewalDate);

  if (!renewalDay) {
    return { status: 'Active', alertState: 'None' };
  }

  const dayDifference = diffInDays(renewalDay, today);

  if (dayDifference < 0) {
    return { status: 'Overdue', alertState: 'Overdue' };
  }

  if (dayDifference === 0) {
    return { status: 'DueToday', alertState: 'DueToday' };
  }

  if (dayDifference <= upcomingWindowDays) {
    return { status: 'Upcoming', alertState: 'Upcoming' };
  }

  return { status: 'Active', alertState: 'None' };
}

function parseOptionalDay(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return startOfUtcDay(value);
}

function startOfUtcDay(value: Date | string): Date {
  const date = typeof value === 'string' ? parseDateString(value) : value;

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseDateString(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  return new Date(value);
}

function diffInDays(date: Date, today: Date): number {
  return Math.round((date.getTime() - today.getTime()) / millisecondsPerDay);
}
