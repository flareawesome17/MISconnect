import { listMyNotifications } from "@misconnect/api";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ notifications: await listMyNotifications(await getRequestSessionUser()) }));
}
