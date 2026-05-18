import { deleteManagedRole, getManagedRole, updateManagedRole } from "@misconnect/api";
import { updateRoleSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => getManagedRole(await getRequestSessionUser(), (await params).id));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    const body = updateRoleSchema.parse(await request.json());
    return updateManagedRole(await getRequestSessionUser(), id, body);
  });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await deleteManagedRole(await getRequestSessionUser(), (await params).id);
    return { success: true };
  });
}
