import { getKpmReport } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { ReportsClient } from "@/components/reports-client";
import { requireSession } from "@/lib/session";

export default async function AdminReportsPage() {
  const user = await requireSession();
  const report = await getKpmReport(user, {});

  return (
    <DataCard title="KPM Reports">
      <ReportsClient initialReport={report} />
    </DataCard>
  );
}
