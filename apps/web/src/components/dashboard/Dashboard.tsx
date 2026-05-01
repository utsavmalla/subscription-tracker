import { AppShell } from "@/components/layout";
import { AttentionPanels } from "./AttentionPanels";
import { DashboardHeader } from "./DashboardHeader";
import { HeroSummary } from "./HeroSummary";
import { MetricsGrid } from "./MetricsGrid";
import { SpendAndUpdates } from "./SpendAndUpdates";
import { SubscriptionPreview } from "./SubscriptionPreview";

export function Dashboard() {
  return (
    <AppShell>
      <DashboardHeader />
      <HeroSummary />
      <MetricsGrid />
      <AttentionPanels />
      <SpendAndUpdates />
      <SubscriptionPreview />
    </AppShell>
  );
}
