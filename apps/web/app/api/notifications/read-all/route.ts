import { markAllNotificationsReadForUser } from "@misconnect/api";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function PATCH() {
  return routeGuard(async () => {
    await markAllNotificationsReadForUser(await getRequestSessionUser());
    return { success: true };
  });
}
