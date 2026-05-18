# ⚡ RBAC Quick Reference

## 3 Inconsistencies at a Glance

### 1️⃣ Authentication Mismatch
```
PROBLEM:
  AdminLogin.tsx checks: user.role === "admin"
  CreateUserModal assigns: roleId (not role)
  Result: Custom roles can't log in

FIX:
  AdminLogin.tsx should check:
    if (user.role === "admin") OR
    if (user.roleId exists AND has manage_roles permission)
```

### 2️⃣ Authorization Gap
```
PROBLEM:
  RoleManagement.tsx defines 19 permissions
  ProtectedRoute.tsx ignores them
  Result: Permission system unused

FIX:
  ProtectedRoute.tsx should check:
    if (user.role === requiredRole) AND
    if (hasPermission(userPermissions, requiredPermission))
```

### 3️⃣ Role Assignment Inconsistency
```
PROBLEM:
  CreateUserModal assigns: roleId + roleName
  AuthContext checks: role field
  Result: Mismatch between assignment and auth

FIX:
  CreateUserModal should assign:
    roleId (custom role ID)
    roleName (display name)
    role (legacy field for compatibility)
```

---

## Files to Fix

| File | Line | Change | Priority |
|------|------|--------|----------|
| AdminLogin.tsx | 40-44 | Add roleId check | 🔴 CRITICAL |
| AuthContext.tsx | 39 | Add roleId admin check | 🔴 CRITICAL |
| ProtectedRoute.tsx | 42-54 | Add permission checking | 🟠 IMPORTANT |
| CreateUserModal.tsx | 66-110 | Set both role fields | 🟠 IMPORTANT |
| roleService.ts | - | Add helper functions | 🟡 NICE-TO-HAVE |

---

## Code Snippets

### Fix 1: AdminLogin.tsx
```typescript
// BEFORE (Line 40-44)
if (user.role !== "admin") {
  toast.error("Access denied. Admin credentials required.");
  return;
}

// AFTER
if (user.role === "admin") {
  navigate("/admin");
  return;
}

if (user.roleId) {
  const role = await getRoleById(user.roleId);
  if (role && isRoleAdmin(role)) {
    navigate("/admin");
    return;
  }
}

toast.error("Access denied. Admin credentials required.");
```

### Fix 2: AuthContext.tsx
```typescript
// BEFORE (Line 39)
const isAdmin = user?.role === "admin";

// AFTER
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    if (user.role === "admin") {
      setIsAdmin(true);
      return;
    }

    if (user.roleId) {
      const role = await getRoleById(user.roleId);
      setIsAdmin(isRoleAdmin(role));
    } else {
      setIsAdmin(false);
    }
  };

  checkAdminStatus();
}, [user]);
```

### Fix 3: ProtectedRoute.tsx
```typescript
// ADD to interface
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "department" | "user";
  requiredPermission?: Permission; // ✅ NEW
}

// ADD permission checking
if (requiredPermission) {
  const permissions = await getUserPermissions(user.uid);
  if (!hasPermission(permissions, requiredPermission)) {
    return <Navigate to="/" replace />;
  }
}
```

### Fix 4: CreateUserModal.tsx
```typescript
// ADD helper function
const getLegacyRoleFromPermissions = (role: Role | undefined): string => {
  if (!role) return "user";
  if (role.permissions?.includes("manage_roles")) return "admin";
  if (role.permissions?.includes("accept_tickets")) return "department";
  return "user";
};

// UPDATE handleSubmit
const selectedRole = roles.find((r) => r.id === formData.role);

await createUserWithEmailPassword({
  displayName: formData.displayName,
  email: formData.email,
  password: formData.password,
  department: formData.department,
  roleId: formData.role,
  roleName: selectedRole?.name,
  role: getLegacyRoleFromPermissions(selectedRole), // ✅ NEW
});
```

### Fix 5: roleService.ts
```typescript
// ADD helper functions
export const isRoleAdmin = (role: Role | null | undefined): boolean => {
  if (!role) return false;
  return role.permissions?.includes("manage_roles") ?? false;
};

export const getUserEffectivePermissions = async (
  user: AuthUser
): Promise<Permission[]> => {
  if (user.role) {
    const legacyRole = SYSTEM_ROLES[user.role as keyof typeof SYSTEM_ROLES];
    if (legacyRole) return legacyRole.permissions;
  }

  if (user.roleId) {
    try {
      const role = await getRoleById(user.roleId);
      if (role) return role.permissions;
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  }

  return [];
};
```

---

## Testing Checklist

### Test 1: Custom Role Login
- [ ] Create user with custom "Administrator" role
- [ ] Login with that user
- [ ] ✅ Should succeed and redirect to /admin

### Test 2: Custom Role Denied
- [ ] Create user with custom "Support Manager" role (no manage_roles)
- [ ] Login with that user
- [ ] ✅ Should succeed
- [ ] Try to access /admin/roles
- [ ] ✅ Should be denied

### Test 3: Legacy Role Still Works
- [ ] Create user with legacy "admin" role
- [ ] Login with that user
- [ ] ✅ Should succeed and redirect to /admin

### Test 4: Permission Checking
- [ ] Create user with "view_tickets" permission only
- [ ] Try to access /admin/roles (requires manage_roles)
- [ ] ✅ Should be denied
- [ ] Try to access /admin/tickets (requires view_tickets)
- [ ] ✅ Should be allowed

### Test 5: Backward Compatibility
- [ ] Existing users still work
- [ ] Existing roles still work
- [ ] No data migration needed

---

## Rollback Plan

If issues occur:

1. **Revert AdminLogin.tsx** to check only `user.role`
2. **Revert AuthContext.tsx** to simple role check
3. **Revert ProtectedRoute.tsx** to remove permission checking
4. System will work as before (custom roles broken, but stable)

---

## Decision Matrix

| Scenario | Option A | Option B | Option C |
|----------|----------|----------|----------|
| **Just fix login** | ✅ | ✅ | ✅ |
| **Add permission checking** | ❌ | ✅ | ✅ |
| **Deprecate legacy role** | ❌ | ❌ | ✅ |
| **Time required** | 30 min | 2-3 hrs | 1 day |
| **Risk level** | 🟢 Low | 🟢 Low | 🟡 Medium |
| **Recommended** | ❌ | ✅ | ❌ |

---

## Key Takeaways

1. **Your custom role system is good** - Just needs authentication support
2. **The fix is straightforward** - Add roleId checks in 2 places
3. **Low risk** - Backward compatible, optional parameters
4. **High value** - Enables full RBAC system
5. **Quick implementation** - 2-3 hours for complete fix

---

## What Stays the Same

✅ Role Management page works as-is
✅ User Management page works as-is
✅ All 19 permissions stay defined
✅ Modern UI design unchanged
✅ Responsive layout unchanged
✅ All existing users work
✅ All existing roles work

---

## What Changes

❌ → ✅ Custom roles now work for login
❌ → ✅ Permission checking is enforced
❌ → ✅ Consistent role assignment
❌ → ✅ Admin detection works with both systems

---

## Ready to Implement?

**Choose your option:**
- [ ] Option A - Minimal fix (login only)
- [ ] Option B - Complete fix (recommended)
- [ ] Option C - Full migration

**Then I'll:**
1. Implement the exact changes
2. Run comprehensive tests
3. Verify everything works
4. Update documentation


