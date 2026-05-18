import { acceptTicketForUser } from "@misconnect/api";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    return acceptTicketForUser(await getRequestSessionUser(), id);
  });
}
