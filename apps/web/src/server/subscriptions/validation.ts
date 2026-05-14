import type {
  ActionResult,
  SubscriptionMutationInput,
} from "@/lib/subscriptions/types";
import { toModelCycle } from "@/lib/subscriptions/types";

type ValidationSuccess = {
  ok: true;
  data: {
    serviceName: string;
    usdAmount: string | null;
    renewalCycle: ReturnType<typeof toModelCycle>;
    nextRenewalDate: Date | null;
    expirationDate: Date | null;
    datePaid: Date | null;
    done: boolean;
    remarks: string | null;
  };
};

type ValidationFailure = ActionResult & { ok: false };

export function validateSubscriptionInput(
  input: SubscriptionMutationInput,
): ValidationSuccess | ValidationFailure {
  const fieldErrors: ValidationFailure["fieldErrors"] = {};
  const serviceName = input.service.trim();
  const remarks = input.remarks.trim();
  const amount = parseAmount(input.amount);
  const nextRenewalDate = parseDateInput(input.nextRenewal);
  const expirationDate = parseDateInput(input.expiration);
  const datePaid = parseDateInput(input.datePaid ?? "");
  const renewalCycle = isSubscriptionCycle(input.cycle) ? toModelCycle(input.cycle) : null;

  if (!serviceName) {
    fieldErrors.service = "Service name is required.";
  }

  if (amount === "invalid") {
    fieldErrors.amount = "Amount must be a non-negative number.";
  }

  if (!renewalCycle) {
    fieldErrors.cycle = "Renewal cycle must be Monthly, Quarterly, Yearly, or One-time.";
  }

  if (input.nextRenewal && !nextRenewalDate) {
    fieldErrors.nextRenewal = "Next renewal date must be valid.";
  }

  if (input.expiration && !expirationDate) {
    fieldErrors.expiration = "Expiration date must be valid.";
  }

  if (input.datePaid && !datePaid) {
    fieldErrors.datePaid = "Date paid must be valid.";
  }

  if (renewalCycle === "OneTime" && !expirationDate) {
    fieldErrors.expiration = "Expiration date is required for one-time subscriptions.";
  }

  if (renewalCycle && renewalCycle !== "OneTime" && !nextRenewalDate) {
    fieldErrors.nextRenewal = "Next renewal date is required for recurring subscriptions.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  if (!renewalCycle) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors: {
        cycle: "Renewal cycle must be Monthly, Quarterly, Yearly, or One-time.",
      },
    };
  }

  return {
    ok: true,
    data: {
      serviceName,
      usdAmount: amount,
      renewalCycle,
      nextRenewalDate,
      expirationDate,
      datePaid,
      done: input.done,
      remarks: remarks || null,
    },
  };
}

function parseAmount(value: string): string | null | "invalid" {
  const normalized = value.trim().replace(/[$,\s]/g, "");

  if (!normalized) {
    return null;
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) {
    return "invalid";
  }

  return amount.toFixed(2);
}

function parseDateInput(value: string): Date | null {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSubscriptionCycle(value: string): value is SubscriptionMutationInput["cycle"] {
  return ["Monthly", "Quarterly", "Yearly", "One-time"].includes(value);
}
