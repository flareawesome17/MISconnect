# Staff Portal Access Control - Key Code Changes

## 1. New Helper Function: `isRoleStaff()`

**File:** `src/services/roleService.ts`

```typescript
/**
 * Check if a role is a staff role (can access Staff Portal)
 * A role is considered staff if it has any staff-related permissions
 */
export const isRoleStaff = (role: Role | undefined): boolean => {
  if (!role) return false;
  
  const staffPermissions: Permission[] = [
    "view_tickets",
    "accept_tickets",
    "reassign_tickets",
    "view_users",
    "view_departments",
    "view_reports",
    "manage_roles",
  ];
  
  return staffPermissions.some((permission) => role.permissions?.includes(permission));
};
```

---

## 2. Updated Login Logic

**File:** `src/pages/AdminLogin.tsx`

```typescript
// Import the new function
import { getRoleById, isRoleAdmin, isRoleStaff } from "@/services/roleService";

// In the login handler:
try {
  const user = await signIn(email, password);

  // Check legacy role - admin or department staff can access
  if (user.role === "admin" || user.role === "department") {
    toast.success("Staff login successful!");
    navigate("/admin");
    return;
  }

  // Check custom role system - any staff role can access
  if (user.roleId) {
    try {
      const role = await getRoleById(user.roleId);
      if (role && isRoleStaff(role)) {
        toast.success("Staff login successful!");
        navigate("/admin");
        return;
      }
    } catch (error) {
      console.error("Error checking role:", error);
    }
  }

  toast.error("Access denied. Staff credentials required.");
  setIsLoading(false);
} catch (error) {
  // Handle error
}
```

---

## 3. Enhanced Route Protection

**File:** `src/components/ProtectedRoute.tsx`

```typescript
// Import new functions
import { isRoleStaff, getRoleById } from "@/services/roleService";

// In the authorization check:
if (requiredRole === "staff") {
  // Check legacy role
  if (user.role === "admin" || user.role === "department") {
    if (requiredPermission) {
      const permissions = await getUserPermissions(user.uid);
      setIsAuthorized(hasPermission(permissions, requiredPermission));
      return;
    }
    setIsAuthorized(true);
    return;
  }

  // Check custom role system
  if (user.roleId) {
    try {
      const role = await getRoleById(user.roleId);
      if (role && isRoleStaff(role)) {
        if (requiredPermission) {
          setIsAuthorized(hasPermission(role.permissions, requiredPermission));
          return;
        }
        setIsAuthorized(true);
        return;
      }
    } catch (error) {
      console.error("Error checking role:", error);
    }
  }

  setIsAuthorized(false);
  return;
}
```

---

## 4. New Auth Context Flag

**File:** `src/context/AuthContext.tsx`

```typescript
// Import new function
import { isRoleStaff } from "@/services/roleService";

// Add new state
const [isStaff, setIsStaff] = useState(false);

// Update role checking logic
useEffect(() => {
  const checkRoleStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsStaff(false);
      return;
    }

    // Check legacy role
    if (user.role === "admin") {
      setIsAdmin(true);
      setIsStaff(true);
      return;
    }

    if (user.role === "department") {
      setIsAdmin(false);
      setIsStaff(true);
      return;
    }

    // Check custom role system
    if (user.roleId) {
      try {
        const role = await getRoleById(user.roleId);
        setIsAdmin(isRoleAdmin(role));
        setIsStaff(isRoleStaff(role));
      } catch (error) {
        console.error("Error checking role status:", error);
        setIsAdmin(false);
        setIsStaff(false);
      }
    } else {
      setIsAdmin(false);
      setIsStaff(false);
    }
  };

  checkRoleStatus();
}, [user]);

// Fix customer detection
const isCustomer = user?.role === "user";

// Export new flag
return (
  <AuthContext.Provider value={{ user, loading, logout: handleLogout, isAdmin, isStaff, isCustomer }}>
    {children}
  </AuthContext.Provider>
);
```

---

## 5. Updated Routes

**File:** `src/App.tsx`

```typescript
// BEFORE:
<Route
  path="/admin"
  element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
>

// AFTER:
<Route
  path="/admin"
  element={<ProtectedRoute requiredRole="staff"><AdminLayout /></ProtectedRoute>}
>
```

---

## 🎯 Usage Examples

### Check if User is Staff

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { isStaff } = useAuth();
  
  if (!isStaff) {
    return <div>Not a staff member</div>;
  }
  
  return <div>Welcome, staff member!</div>;
}
```

### Protect Route for Staff Only

```typescript
<Route
  path="/admin"
  element={<ProtectedRoute requiredRole="staff"><AdminLayout /></ProtectedRoute>}
>
  {/* Admin routes */}
</Route>
```

### Protect Route for Staff with Specific Permission

```typescript
<Route
  path="/admin/users"
  element={<ProtectedRoute requiredRole="staff" requiredPermission="view_users"><Users /></ProtectedRoute>}
>
</Route>
```

---

## 📊 Summary of Changes

| Component | Change | Impact |
|-----------|--------|--------|
| `isRoleStaff()` | New function | Detects staff roles by permissions |
| `AdminLogin.tsx` | Updated logic | Allows staff members to log in |
| `ProtectedRoute.tsx` | New `requiredRole="staff"` | Protects routes for staff members |
| `AuthContext.tsx` | Added `isStaff` flag | Tracks staff status globally |
| `App.tsx` | Updated routes | All staff can access admin routes |

---

**Status**: ✅ **COMPLETE** - All code changes implemented and tested!

