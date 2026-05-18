import { createManagedDepartment, listManagedDepartments } from "@misconnect/api";
import { createDepartmentSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => ({ departments: await listManagedDepartments(await getRequestSessionUser()) }));
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    const body = createDepartmentSchema.parse(await request.json());
    return createManagedDepartment(await getRequestSessionUser(), body);
  });
}
