import { createManagedPassword, listManagedPasswords } from "@misconnect/api";
import { createPasswordSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ passwords: await listManagedPasswords(await getRequestSessionUser()) }));
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    const body = createPasswordSchema.parse(await request.json());
    return createManagedPassword(await getRequestSessionUser(), body);
  });
}
