import { createTicketForUser, listVisibleTickets } from "@misconnect/api";
import { createTicketSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ tickets: await listVisibleTickets(await getRequestSessionUser()) }));
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    const body = createTicketSchema.parse(await request.json());
    return createTicketForUser(await getRequestSessionUser(), body);
  });
}
