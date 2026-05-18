import { getVisibleTicket, updateTicketForUser } from "@misconnect/api";
import { updateTicketSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    return getVisibleTicket(await getRequestSessionUser(), id);
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    const body = updateTicketSchema.parse(await request.json());
    return updateTicketForUser(await getRequestSessionUser(), id, body);
  });
}
