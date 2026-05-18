import { getMyPermissions } from "@misconnect/api";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ permissions: await getMyPermissions(await getRequestSessionUser()) }));
}
