"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createSubscriptionAction,
  updateSubscriptionAction,
} from "@/actions/subscriptions";
import { ErrorNotice, StatusBadge } from "@/components/ui";
import {
  computeSubscriptionStatus as getStatusLabel,
  formatDate,
} from "@/data/subscriptions";
import type {
  SubscriptionDisplayCycle,
  SubscriptionFormValues,
} from "@/lib/subscriptions/types";

type Props = {
  initialValues: SubscriptionFormValues;
  submitLabel?: string;
  secondaryActionLabel?: string;
  redirectTo?: string;
  resetAfterSave?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
};

export function SubscriptionForm({
  initialValues,
  submitLabel = "Save Subscription",
  secondaryActionLabel = "Save and Add Another",
  redirectTo,
  resetAfterSave = false,
  cancelLabel,
  onCancel,
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState<SubscriptionFormValues>(initialValues);
  const [toastMessage, setToastMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const computedStatus = useMemo(
    () => getStatusLabel(values),
    [values],
  );

  const isOneTime = values.cycle === "One-time";

  const handleInput = (field: keyof SubscriptionFormValues, value: string) => {
    setValues((current) => {
      const nextValues = {
        ...current,
        [field]: field === "done" ? value === "true" : value,
      };

      if (field === "datePaid" || field === "cycle") {
        const cycle = nextValues.cycle as SubscriptionDisplayCycle;
        const nextRenewal = getNextRenewalDate(nextValues.datePaid, cycle);

        if (nextRenewal) {
          nextValues.nextRenewal = nextRenewal;
        }
      }

      return nextValues;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    const result = values.id
      ? await updateSubscriptionAction(values.id, values)
      : await createSubscriptionAction(values);

    setIsSubmitting(false);
    setToastMessage(result.message);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.message);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      return;
    }

    if (resetAfterSave) {
      setValues(initialValues);
    }
  };

  const handleSecondary = async () => {
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");
    const result = await createSubscriptionAction(values);
    setIsSubmitting(false);
    setToastMessage(result.ok ? "Subscription saved. Add another." : result.message);

    if (result.ok) {
      setValues(initialValues);
      return;
    }

    setFieldErrors(result.fieldErrors ?? {});
    setFormError(result.message);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/subscriptions");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && <ErrorNotice title="Subscription was not saved" message={formError} />}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Service name
                </label>
                <input
                  value={values.service}
                  onChange={(event) =>
                    handleInput("service", event.target.value)
                  }
                  placeholder="Netflix, Canva Pro, etc."
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
                {fieldErrors.service && (
                  <p className="mt-2 text-sm text-rose-600">{fieldErrors.service}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Amount
                  <input
                    value={values.amount}
                    onChange={(event) =>
                      handleInput("amount", event.target.value)
                    }
                    placeholder="$12.99"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                  {fieldErrors.amount && (
                    <p className="mt-2 text-sm text-rose-600">{fieldErrors.amount}</p>
                  )}
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  Renewal cycle
                  <select
                    value={values.cycle}
                    onChange={(event) =>
                      handleInput("cycle", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    <option>One-time</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Date paid
                  <input
                    type="date"
                    value={values.datePaid}
                    onChange={(event) =>
                      handleInput("datePaid", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                  {fieldErrors.datePaid && (
                    <p className="mt-2 text-sm text-rose-600">{fieldErrors.datePaid}</p>
                  )}
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  {isOneTime ? "Expiration date" : "Next renewal date"}
                  <input
                    type="date"
                    value={isOneTime ? values.expiration : values.nextRenewal}
                    onChange={(event) =>
                      handleInput(
                        isOneTime ? "expiration" : "nextRenewal",
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                  {!isOneTime && fieldErrors.nextRenewal && (
                    <p className="mt-2 text-sm text-rose-600">{fieldErrors.nextRenewal}</p>
                  )}
                  {isOneTime && fieldErrors.expiration && (
                    <p className="mt-2 text-sm text-rose-600">{fieldErrors.expiration}</p>
                  )}
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Done
                  <select
                    value={values.done ? "true" : "false"}
                    onChange={(event) =>
                      handleInput("done", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option value="false">Not done</option>
                    <option value="true">Done</option>
                  </select>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Remarks
                    <textarea
                      value={values.remarks}
                      onChange={(event) =>
                        handleInput("remarks", event.target.value)
                      }
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                      placeholder="Plan notes, cancellation details, or billing reminders"
                    />
                  </label>
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status preview
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <StatusBadge status={computedStatus} />
                <span className="text-sm text-slate-600">
                  {isOneTime ? "Expiration is the key date for one-time plans." : "Next renewal is the key date for recurring plans."}
                </span>
              </div>
              <div className="mt-4 space-y-3 rounded-3xl bg-white p-4">
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Service</p>
                  <p>{values.service || "Untitled subscription"}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Amount</p>
                  <p>{values.amount || "—"}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Next renewal</p>
                  <p>{values.nextRenewal ? formatDate(values.nextRenewal) : "—"}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Expiration</p>
                  <p>{values.expiration ? formatDate(values.expiration) : "—"}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Enter the subscription details above. Saves are validated and persisted through the Next.js backend layer.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {cancelLabel ?? "Cancel"}
            </button>
            {resetAfterSave && (
              <button
                type="button"
                onClick={handleSecondary}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : secondaryActionLabel}
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </form>

      {toastMessage && (
        <div className="rounded-3xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900 shadow-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function getNextRenewalDate(
  datePaid: string,
  cycle: SubscriptionDisplayCycle,
): string {
  if (!datePaid || cycle === "One-time") {
    return "";
  }

  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePaid);
  if (!dateParts) {
    return "";
  }

  const [, yearValue, monthValue, dayValue] = dateParts;
  const year = Number(yearValue);
  const monthIndex = Number(monthValue) - 1;
  const day = Number(dayValue);

  if (!isValidDateParts(year, monthIndex, day)) {
    return "";
  }

  const monthsToAdd = getCycleMonthIncrement(cycle);
  if (monthsToAdd === 0) {
    return "";
  }

  const targetMonthIndex = monthIndex + monthsToAdd;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedTargetMonthIndex = targetMonthIndex % 12;
  const targetDay = Math.min(
    day,
    getDaysInMonth(targetYear, normalizedTargetMonthIndex),
  );

  return formatDateInput(targetYear, normalizedTargetMonthIndex, targetDay);
}

function getCycleMonthIncrement(cycle: SubscriptionDisplayCycle): number {
  switch (cycle) {
    case "Monthly":
      return 1;
    case "Quarterly":
      return 3;
    case "Yearly":
      return 12;
    case "One-time":
      return 0;
  }
}

function isValidDateParts(
  year: number,
  monthIndex: number,
  day: number,
): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || !Number.isInteger(day)) {
    return false;
  }

  return (
    monthIndex >= 0 &&
    monthIndex <= 11 &&
    day >= 1 &&
    day <= getDaysInMonth(year, monthIndex)
  );
}

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function formatDateInput(
  year: number,
  monthIndex: number,
  day: number,
): string {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");

  return `${year}-${month}-${date}`;
}
