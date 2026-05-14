import { ImportExportClient } from "@/components/import-export/ImportExportClient";
import { AppShell } from "@/components/layout";
import { requireCurrentUser } from "@/server/auth/currentUser";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const user = await requireCurrentUser();

  return (
    <AppShell>
      <ImportExportClient isGuest={user.isAnonymous} />
    </AppShell>
  );
}
