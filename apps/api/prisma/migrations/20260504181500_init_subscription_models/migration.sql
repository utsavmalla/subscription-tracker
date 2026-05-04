-- EnableExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "RenewalCycle" AS ENUM ('Monthly', 'Quarterly', 'Yearly', 'OneTime');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Active', 'Upcoming', 'DueToday', 'Overdue', 'Expired', 'Completed');

-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('None', 'Upcoming', 'DueToday', 'Overdue', 'Expired');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('Upcoming', 'DueToday', 'Overdue');

-- CreateEnum
CREATE TYPE "ReminderEventStatus" AS ENUM ('Pending', 'Sent', 'Failed', 'Dismissed');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_name" TEXT NOT NULL,
    "usd_amount" DECIMAL(10,2),
    "local_amount" DECIMAL(12,2),
    "currency_code" TEXT DEFAULT 'NPR',
    "date_paid" DATE,
    "renewal_cycle" "RenewalCycle" NOT NULL,
    "next_renewal_date" DATE,
    "expiration_date" DATE,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'Active',
    "alert_state" "AlertState" NOT NULL DEFAULT 'None',
    "done" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription_id" UUID NOT NULL,
    "reminder_type" "ReminderType" NOT NULL,
    "scheduled_for" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "status" "ReminderEventStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminder_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_renewal_cycle_idx" ON "subscriptions"("renewal_cycle");

-- CreateIndex
CREATE INDEX "subscriptions_next_renewal_date_idx" ON "subscriptions"("next_renewal_date");

-- CreateIndex
CREATE INDEX "subscriptions_expiration_date_idx" ON "subscriptions"("expiration_date");

-- CreateIndex
CREATE INDEX "reminder_events_subscription_id_idx" ON "reminder_events"("subscription_id");

-- CreateIndex
CREATE INDEX "reminder_events_scheduled_for_idx" ON "reminder_events"("scheduled_for");

-- AddForeignKey
ALTER TABLE "reminder_events" ADD CONSTRAINT "reminder_events_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
