import { AppShell } from "@/components/layout";
import { AttentionPanels } from "./AttentionPanels";
import { DashboardHeader } from "./DashboardHeader";
import { HeroSummary } from "./HeroSummary";
import { MetricsGrid } from "./MetricsGrid";
import { SpendAndUpdates } from "./SpendAndUpdates";
import { SubscriptionPreview } from "./SubscriptionPreview";
import type { DashboardSummary } from "@/lib/subscriptions/types";

type Props = {
  summary: DashboardSummary;
};

export function Dashboard({ summary }: Props) {
  return (
    <AppShell>
      <DashboardHeader />
      <HeroSummary
        monthlySpend={summary.monthlySpend}
        reviewThisWeekCount={summary.reviewThisWeekCount}
        overdueCount={summary.overdueItems.length}
      />
      <MetricsGrid metrics={summary.metrics} />
      <AttentionPanels
        upcomingRenewals={summary.upcomingRenewals}
        overdueItems={summary.overdueItems}
      />
      <SpendAndUpdates
        monthlySpend={summary.monthlySpend}
        recurringSpend={summary.recurringSpend}
        oneTimeSpend={summary.oneTimeSpend}
        recentUpdates={summary.recentUpdates}
      />
      <SubscriptionPreview previewRows={summary.previewRows} />
    </AppShell>
  );
}
