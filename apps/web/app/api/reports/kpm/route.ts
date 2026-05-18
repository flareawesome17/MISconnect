import { getKpmReport } from "@misconnect/api";
import { kpmReportQuerySchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(request: Request) {
  return routeGuard(async () => {
    const url = new URL(request.url);
    const filters = kpmReportQuerySchema.parse({
      startDate: url.searchParams.get("startDate") || undefined,
      endDate: url.searchParams.get("endDate") || undefined,
    });
    return getKpmReport(await getRequestSessionUser(), filters);
  });
}
