import type { ReminderEvent, Subscription } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import {
  formatAmount,
  formatDisplayDate,
  formatReadableDate,
} from "@/server/subscriptions/format";

type ReminderWithSubscription = ReminderEvent & {
  subscription: Pick<
    Subscription,
    "id" | "serviceName" | "usdAmount" | "currencyCode" | "nextRenewalDate" | "expirationDate"
  >;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
};

export async function getEmailSettings(userId: string, accountEmail: string | null) {
  const settings = await prisma.userNotificationSetting.findUnique({
    where: { userId },
  });

  return {
    emailEnabled: settings?.emailEnabled ?? false,
    emailTo: settings?.emailTo ?? accountEmail ?? "",
    emailVerifiedAt: settings?.emailVerifiedAt ? formatDisplayDate(settings.emailVerifiedAt) : "",
  };
}

export async function setEmailRemindersEnabled(
  userId: string,
  email: string | null,
  enabled: boolean,
) {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  if (enabled && !normalizedEmail) {
    return {
      ok: false,
      message: "Add an email to your account before enabling email reminders.",
    };
  }

  await prisma.userNotificationSetting.upsert({
    where: { userId },
    create: {
      userId,
      emailEnabled: enabled,
      emailTo: enabled ? normalizedEmail : null,
      emailVerifiedAt: enabled ? new Date() : null,
    },
    update: {
      emailEnabled: enabled,
      emailTo: enabled ? normalizedEmail : null,
      emailVerifiedAt: enabled ? new Date() : null,
    },
  });

  return {
    ok: true,
    message: enabled ? "Email due-today reminders are on." : "Email due-today reminders are off.",
  };
}

export async function sendDueTodayEmailNotifications(userId?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { attempted: 0, sent: 0, failed: 0, skipped: 0 };
  }

  const today = startOfUtcDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const settings = await prisma.userNotificationSetting.findMany({
    where: {
      ...(userId ? { userId } : {}),
      emailEnabled: true,
      emailTo: { not: null },
    },
    select: { userId: true, emailTo: true },
  });
  const emailByUserId = new Map(settings.map((setting) => [setting.userId, setting.emailTo]));

  if (emailByUserId.size === 0) {
    return { attempted: 0, sent: 0, failed: 0, skipped: 0 };
  }

  const reminders = await prisma.reminderEvent.findMany({
    where: {
      userId: { in: [...emailByUserId.keys()] },
      reminderType: "DueToday",
      status: "Pending",
      scheduledFor: { gte: today, lt: tomorrow },
    },
    include: {
      subscription: {
        select: {
          id: true,
          serviceName: true,
          usdAmount: true,
          currencyCode: true,
          nextRenewalDate: true,
          expirationDate: true,
        },
      },
    },
    orderBy: [{ scheduledFor: "asc" }, { createdAt: "asc" }],
  });

  let attempted = 0;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const reminder of reminders) {
    const emailTo = emailByUserId.get(reminder.userId);
    if (!emailTo) {
      skipped += 1;
      continue;
    }

    attempted += 1;
    const result = await sendReminderEmail(emailTo, reminder);

    if (result.ok) {
      await prisma.reminderEvent.update({
        where: { id: reminder.id },
        data: { status: "Sent", sentAt: new Date() },
      });
      sent += 1;
    } else {
      await prisma.reminderEvent.update({
        where: { id: reminder.id },
        data: { status: "Failed" },
      });
      failed += 1;
    }
  }

  return { attempted, sent, failed, skipped };
}

async function sendReminderEmail(emailTo: string, reminder: ReminderWithSubscription) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `subscription-tracker-reminder-${reminder.id}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [emailTo],
      subject: `${reminder.subscription.serviceName} is due today`,
      text: buildDueTodayText(reminder),
      html: buildDueTodayHtml(reminder),
    }),
  });

  const body = (await response.json().catch(() => null)) as ResendEmailResponse | null;
  return {
    ok: response.ok && Boolean(body?.id),
    message: body?.message,
  };
}

function buildDueTodayText(reminder: ReminderWithSubscription): string {
  const subscription = reminder.subscription;
  const dueDate = subscription.nextRenewalDate ?? subscription.expirationDate ?? reminder.scheduledFor;
  const amount = subscription.usdAmount
    ? `\nAmount: ${formatAmount(subscription.usdAmount, subscription.currencyCode)}`
    : "";
  const link = buildSubscriptionLink(subscription.id);

  return [
    "Subscription due today",
    "",
    `Service: ${subscription.serviceName}`,
    `Due date: ${formatReadableDate(dueDate)}`,
    amount.trim(),
    link ? `Open: ${link}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildDueTodayHtml(reminder: ReminderWithSubscription): string {
  const subscription = reminder.subscription;
  const dueDate = subscription.nextRenewalDate ?? subscription.expirationDate ?? reminder.scheduledFor;
  const link = buildSubscriptionLink(subscription.id);
  const amount = subscription.usdAmount
    ? `<p><strong>Amount:</strong> ${escapeHtml(formatAmount(subscription.usdAmount, subscription.currencyCode))}</p>`
    : "";

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">Subscription due today</h1>
      <p><strong>Service:</strong> ${escapeHtml(subscription.serviceName)}</p>
      <p><strong>Due date:</strong> ${escapeHtml(formatReadableDate(dueDate))}</p>
      ${amount}
      ${
        link
          ? `<p><a href="${escapeHtml(link)}" style="color: #0f766e;">Open subscription</a></p>`
          : ""
      }
    </div>
  `;
}

function buildSubscriptionLink(subscriptionId: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    return "";
  }

  return `${siteUrl.replace(/\/$/, "")}/subscriptions/${subscriptionId}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}
