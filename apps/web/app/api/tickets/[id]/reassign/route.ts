import { reassignTicketForUser } from "@misconnect/api";
import { reassignTicketSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    const body = reassignTicketSchema.parse(await request.json());
    return reassignTicketForUser(await getRequestSessionUser(), id, body.toEmail);
  });
}
