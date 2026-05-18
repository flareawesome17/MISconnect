import { markNotificationReadForUser } from "@misconnect/api";
import { markNotificationReadSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    markNotificationReadSchema.parse(await request.json());
    return markNotificationReadForUser(await getRequestSessionUser(), (await params).id);
  });
}
