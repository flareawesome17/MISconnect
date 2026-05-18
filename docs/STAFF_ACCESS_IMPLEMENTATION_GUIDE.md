# Staff Portal Access Control - Implementation Guide

## 🎯 Overview

This guide explains how the Staff Portal access control system works and how to use it.

---

## 🔧 Technical Implementation

### 1. Staff Role Detection (`isRoleStaff()`)

**Location:** `src/services/roleService.ts`

```typescript
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

**How it works:**
- Checks if a role has ANY staff-related permission
- Returns `true` if role is a staff role
- Returns `false` if role is not a staff role

### 2. Login Checkpoint (`AdminLogin.tsx`)

**Location:** `src/pages/AdminLogin.tsx`

```typescript
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
```

**How it works:**
1. Check if user has legacy `admin` or `department` role
2. If yes, allow access
3. If no, check custom role using `isRoleStaff()`
4. If custom role is staff role, allow access
5. Otherwise, deny access

### 3. Route Protection (`ProtectedRoute.tsx`)

**Location:** `src/components/ProtectedRoute.tsx`

```typescript
if (requiredRole === "staff") {
  // Check legacy role
  if (user.role === "admin" || user.role === "department") {
    // Check permission if required
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
    const role = await getRoleById(user.roleId);
    if (role && isRoleStaff(role)) {
      // Check permission if required
      if (requiredPermission) {
        setIsAuthorized(hasPermission(role.permissions, requiredPermission));
        return;
      }
      setIsAuthorized(true);
      return;
    }
  }

  setIsAuthorized(false);
  return;
}
```

**How it works:**
1. Check if `requiredRole === "staff"`
2. Check legacy roles (`admin` or `department`)
3. Check custom roles using `isRoleStaff()`
4. If permission is required, check it
5. Set authorization accordingly

### 4. Auth Context (`AuthContext.tsx`)

**Location:** `src/context/AuthContext.tsx`

```typescript
const [isStaff, setIsStaff] = useState(false);

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
      const role = await getRoleById(user.roleId);
      setIsAdmin(isRoleAdmin(role));
      setIsStaff(isRoleStaff(role));
    }
  };

  checkRoleStatus();
}, [user]);
```

**How it works:**
1. Check legacy roles and set `isStaff` accordingly
2. Check custom roles using `isRoleStaff()`
3. Provide `isStaff` flag to components via context

---

## 🚀 Usage Examples

### Example 1: Check if User is Staff

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

### Example 2: Protect Route for Staff Only

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/admin"
  element={<ProtectedRoute requiredRole="staff"><AdminLayout /></ProtectedRoute>}
>
  {/* Admin routes */}
</Route>
```

### Example 3: Protect Route for Staff with Specific Permission

```typescript
<Route
  path="/admin/users"
  element={<ProtectedRoute requiredRole="staff" requiredPermission="view_users"><Users /></ProtectedRoute>}
>
</Route>
```

### Example 4: Create Custom Staff Role

1. Go to Staff Portal → Roles
2. Click "Create Role"
3. Enter role name: "MIS Staff"
4. Select permissions:
   - ✅ view_tickets
   - ✅ accept_tickets
   - ✅ view_reports
5. Click "Create"
6. Assign to users

---

## 📊 Permission Categories

### Staff Permissions
These permissions indicate a staff member:
- `view_tickets`
- `accept_tickets`
- `reassign_tickets`
- `view_users`
- `view_departments`
- `view_reports`
- `manage_roles`

### Admin Permissions
These permissions indicate an admin:
- `manage_roles` (primary indicator)
- `isAdmin` flag (if set)

### Customer Permissions
These permissions indicate a customer:
- `create_tickets`
- `view_tickets` (own only)

---

## 🔄 Access Flow Diagram

```
User Login
    ↓
Check Legacy Role
    ├─ admin → Allow (Staff)
    ├─ department → Allow (Staff)
    └─ user → Deny (Customer)
    ↓
Check Custom Role
    ├─ Has staff permissions → Allow (Staff)
    └─ No staff permissions → Deny
    ↓
Redirect to Dashboard
    ├─ Staff → /admin
    └─ Customer → /customer
```

---

## ✅ Testing Checklist

- [ ] Admin user can log in to Staff Portal
- [ ] Department staff can log in to Staff Portal
- [ ] Custom staff role can log in to Staff Portal
- [ ] Customer cannot log in to Staff Portal
- [ ] Custom role without staff permissions cannot log in
- [ ] Staff member can access `/admin/*` routes
- [ ] Customer cannot access `/admin/*` routes
- [ ] Permission-based route protection works
- [ ] `isStaff` flag is set correctly in AuthContext
- [ ] Build completes without errors

---

**Status**: ✅ **COMPLETE** - Staff Portal access control fully implemented!

