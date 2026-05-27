"use client";

import { useState, useTransition } from "react";
import {
  disableEmailRemindersAction,
  enableEmailRemindersAction,
} from "@/actions/notifications";
import type {
  EmailSettingsView,
  NotificationActionState,
} from "@/lib/notifications/types";

type Props = Readonly<{
  settings: EmailSettingsView;
}>;

const initialMessage: NotificationActionState = {
  ok: true,
  message: "",
};

export function EmailReminderSettings({ settings }: Props) {
  const [message, setMessage] = useState<NotificationActionState>(initialMessage);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<NotificationActionState>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result);
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">Email due-today alerts</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Receive one transactional email when a subscription is due today.
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
              settings.emailEnabled
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {settings.emailEnabled ? "On" : "Off"}
          </span>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">
            {settings.emailTo || "No account email"}
          </p>
          <p className="mt-1">
            {settings.emailVerifiedAt
              ? `Enabled ${settings.emailVerifiedAt}`
              : "Reminder emails use your signed-in account email."}
          </p>
        </div>
      </div>

      {message.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!settings.emailEnabled ? (
          <button
            type="button"
            disabled={isPending || !settings.canEnableEmail}
            onClick={() => runAction(enableEmailRemindersAction)}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Enable email alerts
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(disableEmailRemindersAction)}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Disable email alerts
          </button>
        )}
      </div>

      {!settings.canEnableEmail ? (
        <p className="text-sm text-slate-600">
          Add an email to your guest account before enabling email reminders.
        </p>
      ) : null}
    </div>
  );
}
