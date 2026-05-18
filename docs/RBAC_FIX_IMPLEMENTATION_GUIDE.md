# 🔧 RBAC Fix Implementation Guide

## Overview

This guide provides exact code changes needed to fix RBAC inconsistencies while maintaining your customizable role system.

---

## Step 1: Add Helper Function to roleService.ts

**Purpose:** Determine if a role has admin access

**Add to `src/services/roleService.ts`:**

```typescript
/**
 * Check if a role has admin access
 * A role is considered admin if it has the "manage_roles" permission
 */
export const isRoleAdmin = (role: Role | null | undefined): boolean => {
  if (!role) return false;
  return role.permissions?.includes("manage_roles") ?? false;
};

/**
 * Get user's effective permissions from both legacy and new systems
 */
export const getUserEffectivePermissions = async (
  user: AuthUser
): Promise<Permission[]> => {
  // Check legacy role first
  if (user.role) {
    const legacyRole = SYSTEM_ROLES[user.role as keyof typeof SYSTEM_ROLES];
    if (legacyRole) return legacyRole.permissions;
  }

  // Check custom role
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

## Step 2: Fix AdminLogin.tsx

**Current (BROKEN):**
```typescript
if (user.role !== "admin") {
  toast.error("Access denied. Admin credentials required.");
  return;
}
```

**Fixed:**
```typescript
import { getRoleById, isRoleAdmin } from "@/services/roleService";

// Check legacy role
if (user.role === "admin") {
  navigate("/admin");
  return;
}

// Check custom role system
if (user.roleId) {
  try {
    const role = await getRoleById(user.roleId);
    if (role && isRoleAdmin(role)) {
      navigate("/admin");
      return;
    }
  } catch (error) {
    console.error("Error checking role:", error);
  }
}

toast.error("Access denied. Admin credentials required.");
setIsLoading(false);
```

---

## Step 3: Fix AuthContext.tsx

**Current (BROKEN):**
```typescript
const isAdmin = user?.role === "admin";
```

**Fixed:**
```typescript
import { getRoleById, isRoleAdmin } from "@/services/roleService";

const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Check legacy role
    if (user.role === "admin") {
      setIsAdmin(true);
      return;
    }

    // Check custom role
    if (user.roleId) {
      try {
        const role = await getRoleById(user.roleId);
        setIsAdmin(isRoleAdmin(role));
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  checkAdminStatus();
}, [user]);

// Update return statement
return (
  <AuthContext.Provider 
    value={{ user, loading, logout: handleLogout, isAdmin, isCustomer }}
  >
    {children}
  </AuthContext.Provider>
);
```

---

## Step 4: Fix ProtectedRoute.tsx

**Add permission checking:**

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Permission, hasPermission } from "@/services/roleService";
import { getUserPermissions } from "@/services/userService";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "department" | "user";
  requiredPermission?: Permission; // ✅ NEW
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      // Check role if specified
      if (requiredRole && user.role !== requiredRole) {
        setIsAuthorized(false);
        return;
      }

      // ✅ Check permission if specified
      if (requiredPermission) {
        try {
          const permissions = await getUserPermissions(user.uid);
          setIsAuthorized(hasPermission(permissions, requiredPermission));
          return;
        } catch (error) {
          console.error("Error checking permissions:", error);
          setIsAuthorized(false);
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuthorization();
  }, [user, requiredRole, requiredPermission]);

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    console.warn("Unauthorized access attempt");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

---

## Step 5: Update CreateUserModal.tsx (Hybrid Approach)

**Add this helper:**
```typescript
// Determine legacy role based on permissions
const getLegacyRoleFromPermissions = (role: Role | undefined): string => {
  if (!role) return "user";
  
  if (role.permissions?.includes("manage_roles")) {
    return "admin";
  } else if (role.permissions?.includes("accept_tickets")) {
    return "department";
  }
  
  return "user";
};
```

**Update handleSubmit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... validation code ...

  try {
    setLoading(true);
    const selectedRole = roles.find((r) => r.id === formData.role);

    // ✅ Set both legacy role and custom roleId
    await createUserWithEmailPassword({
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      roleId: formData.role,
      roleName: selectedRole?.name,
      // Set legacy role based on permissions for backward compatibility
      role: getLegacyRoleFromPermissions(selectedRole),
    });

    toast.success("User created successfully!");
    onSuccess();
  } catch (error: any) {
    console.error("Error creating user:", error);
    toast.error(error.message || "Failed to create user");
  } finally {
    setLoading(false);
  }
};
```

---

## Step 6: Update App.tsx Routes (Optional but Recommended)

**Use permission-based protection:**

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Routes>
  {/* Admin routes with permission checking */}
  <Route
    path="/admin/roles"
    element={
      <ProtectedRoute requiredPermission="manage_roles">
        <RoleManagement />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/admin/users"
    element={
      <ProtectedRoute requiredPermission="view_users">
        <UserManagement />
      </ProtectedRoute>
    }
  />

  {/* Fallback to role-based for other admin routes */}
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## Testing Checklist

After implementing fixes:

- [ ] Create user with custom "Administrator" role
- [ ] Login with that user → Should succeed
- [ ] Create user with custom "Support Manager" role (no manage_roles permission)
- [ ] Try to access `/admin/roles` → Should be denied
- [ ] Create user with legacy "admin" role
- [ ] Login with that user → Should succeed
- [ ] Verify existing users still work
- [ ] Check console for no errors

---

## Rollback Plan

If issues occur:
1. Revert AdminLogin.tsx to check only `user.role`
2. Revert AuthContext.tsx to simple role check
3. Revert ProtectedRoute.tsx to remove permission checking
4. System will work as before (with custom roles broken)


