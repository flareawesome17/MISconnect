import { createManagedUser, listManagedUsers } from "@misconnect/api";
import { createUserSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ users: await listManagedUsers(await getRequestSessionUser()) }));
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    const body = createUserSchema.parse(await request.json());
    return createManagedUser(await getRequestSessionUser(), body);
  });
}
