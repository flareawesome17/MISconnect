import { createManagedRole, listManagedRoles } from "@misconnect/api";
import { createRoleSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ roles: await listManagedRoles(await getRequestSessionUser()) }));
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    const body = createRoleSchema.parse(await request.json());
    return createManagedRole(await getRequestSessionUser(), body);
  });
}
