# 📊 RBAC Detailed Comparison: Current vs Recommended

## 1️⃣ AUTHENTICATION LAYER

### Current Implementation (BROKEN)

**AdminLogin.tsx (Line 40-44):**
```typescript
// ❌ PROBLEM: Only checks legacy role field
if (user.role !== "admin") {
  toast.error("Access denied. Admin credentials required.");
  setIsLoading(false);
  return;
}
```

**AuthContext.tsx (Line 39):**
```typescript
// ❌ PROBLEM: Only uses legacy role
const isAdmin = user?.role === "admin";
```

**Result:**
- User with `{ roleId: "custom-admin-id", role: undefined }` → ❌ DENIED
- User with `{ role: "admin", roleId: undefined }` → ✅ ALLOWED

---

### Recommended Implementation

**AdminLogin.tsx (FIXED):**
```typescript
// ✅ Check both systems
if (user.role === "admin") {
  navigate("/admin");
  return;
}

// Check custom role system
if (user.roleId) {
  const role = await getRoleById(user.roleId);
  if (role && isRoleAdmin(role)) {
    navigate("/admin");
    return;
  }
}

toast.error("Access denied. Admin credentials required.");
```

**AuthContext.tsx (FIXED):**
```typescript
// ✅ Determine admin from both systems
const checkAdminStatus = async () => {
  if (user?.role === "admin") {
    setIsAdmin(true);
    return;
  }
  
  if (user?.roleId) {
    const role = await getRoleById(user.roleId);
    setIsAdmin(role ? isRoleAdmin(role) : false);
  }
};
```

---

## 2️⃣ AUTHORIZATION LAYER

### Current Implementation (INCOMPLETE)

**ProtectedRoute.tsx (Line 42-54):**
```typescript
// ❌ PROBLEM: Only checks role string, no permissions
if (requiredRole && user.role !== requiredRole) {
  console.warn(`Unauthorized access attempt...`);
  
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (user.role === "user" || user.role === "department") {
    return <Navigate to="/customer" replace />;
  }
}

return <>{children}</>;
```

**Result:**
- Cannot distinguish between users with different permissions
- All admin routes require `role === "admin"`
- Custom roles with specific permissions are ignored

---

### Recommended Implementation

**ProtectedRoute.tsx (FIXED):**
```typescript
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
    const checkAuth = async () => {
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
        const permissions = await getUserPermissions(user.uid);
        setIsAuthorized(hasPermission(permissions, requiredPermission));
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [user, requiredRole, requiredPermission]);

  if (loading || isAuthorized === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

---

## 3️⃣ ROLE ASSIGNMENT LAYER

### Current Implementation (INCONSISTENT)

**CreateUserModal.tsx (Line 66-110):**
```typescript
// ✅ Fetches custom roles
const [roles, setRoles] = useState<Role[]>([]);
const allRoles = await getAllRoles();

// ✅ Assigns roleId
await createUserWithEmailPassword({
  ...formData,
  roleId: formData.role,
  roleName: selectedRole?.name,
});

// ❌ BUT: AdminLogin only checks user.role field!
```

**Result:**
- User created with `roleId: "custom-admin-id"`
- User cannot log in because login checks `role === "admin"`
- Confusing: role appears assigned but doesn't work

---

### Recommended Implementation

**Option 1: Pure Custom Role System**
```typescript
// CreateUserModal.tsx
const handleSubmit = async () => {
  const selectedRole = roles.find(r => r.id === formData.role);
  
  await createUserWithEmailPassword({
    displayName: formData.displayName,
    email: formData.email,
    password: formData.password,
    roleId: formData.role,
    roleName: selectedRole?.name,
    // ❌ Don't set legacy role field
  });
};

// AdminLogin.tsx checks roleId
if (user.roleId) {
  const role = await getRoleById(user.roleId);
  if (isRoleAdmin(role)) navigate("/admin");
}
```

**Option 2: Hybrid System (RECOMMENDED)**
```typescript
// CreateUserModal.tsx
const handleSubmit = async () => {
  const selectedRole = roles.find(r => r.id === formData.role);
  
  // ✅ Set both for compatibility
  await createUserWithEmailPassword({
    displayName: formData.displayName,
    email: formData.email,
    password: formData.password,
    roleId: formData.role,
    roleName: selectedRole?.name,
    // Set legacy role based on permissions
    role: selectedRole?.permissions?.includes("manage_roles") 
      ? "admin" 
      : "department",
  });
};
```

---

## 4️⃣ PERMISSION CHECKING

### Current Implementation (NOT USED)

**RoleManagement.tsx:**
```typescript
// ✅ 19 permissions defined
const ALL_PERMISSIONS: Permission[] = [
  "view_tickets",
  "create_tickets",
  "edit_tickets",
  // ... 16 more
  "manage_roles",
];

// ✅ Permission checking utilities exist
export const hasPermission = (
  userPermissions: Permission[], 
  requiredPermission: Permission
): boolean => {
  return userPermissions.includes(requiredPermission);
};

// ❌ BUT: Never used in ProtectedRoute or AdminLogin!
```

---

### Recommended Implementation

**Use permissions in route protection:**
```typescript
// App.tsx
<ProtectedRoute requiredPermission="manage_roles">
  <RoleManagement />
</ProtectedRoute>

<ProtectedRoute requiredPermission="view_users">
  <UserManagement />
</ProtectedRoute>

<ProtectedRoute requiredPermission="view_tickets">
  <TicketBoard />
</ProtectedRoute>
```

---

## 📈 Comparison Table

| Aspect | Current | Recommended |
|--------|---------|-------------|
| **Auth Check** | `user.role === "admin"` | Both `role` and `roleId` |
| **Permission Check** | None | `hasPermission()` utility |
| **Route Protection** | Role only | Role + Permission |
| **Custom Roles** | Assigned but ignored | Fully functional |
| **User Experience** | Broken for custom roles | Works end-to-end |
| **Code Complexity** | Simple but broken | Moderate but complete |

---

## 🔧 Implementation Priority

1. **CRITICAL:** Fix AdminLogin.tsx to check both `role` and `roleId`
2. **CRITICAL:** Fix AuthContext.tsx to determine admin from both systems
3. **IMPORTANT:** Add permission checking to ProtectedRoute
4. **IMPORTANT:** Update CreateUserModal to set both fields (hybrid approach)
5. **NICE-TO-HAVE:** Add permission checks to action buttons


