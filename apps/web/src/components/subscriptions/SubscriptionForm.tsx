"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui";
import type { SubscriptionFormValues } from "@/data/subscriptions";
import {
  computeSubscriptionStatus as getStatusLabel,
  formatDate,
} from "@/data/subscriptions";

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

  const computedStatus = useMemo(
    () => getStatusLabel(values),
    [values],
  );

  const isOneTime = values.cycle === "One-time";

  const handleInput = (field: keyof SubscriptionFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: field === "done" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToastMessage("Subscription saved.");

    if (resetAfterSave) {
      setValues(initialValues);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  const handleSecondary = () => {
    setToastMessage("Subscription saved. Add another.");
    setValues(initialValues);
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
                  {isOneTime ? "Expiration date" : "Next renewal date"}
                  <input
                    type="date"
                    value={values.expiration}
                    onChange={(event) =>
                      handleInput("expiration", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  Next renewal date
                  <input
                    type="date"
                    value={values.nextRenewal}
                    onChange={(event) =>
                      handleInput("nextRenewal", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
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
              Enter the subscription details above. The form is locally interactive and can be wired to an API later.
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
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {secondaryActionLabel}
              </button>
            )}
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              {submitLabel}
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
