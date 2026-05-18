import { deleteManagedDepartment, getManagedDepartment, updateManagedDepartment } from "@misconnect/api";
import { updateDepartmentSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => getManagedDepartment(await getRequestSessionUser(), (await params).id));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const body = updateDepartmentSchema.parse(await request.json());
    return updateManagedDepartment(await getRequestSessionUser(), (await params).id, body);
  });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await deleteManagedDepartment(await getRequestSessionUser(), (await params).id);
    return { success: true };
  });
}
