# 🔄 RBAC Flow Diagrams

## Current Flow (BROKEN)

### User Creation Flow
```
Admin Portal
    ↓
CreateUserModal.tsx
    ├─ Fetches: getAllRoles() → [Admin, Support Manager, ...]
    ├─ User selects: "Administrator" role
    ├─ Assigns: roleId = "abc123", roleName = "Administrator"
    └─ Saves to Firestore
         ├─ uid: "user123"
         ├─ email: "admin@example.com"
         ├─ roleId: "abc123" ✅
         ├─ roleName: "Administrator" ✅
         └─ role: undefined ❌ (NOT SET)

Result: User created with custom role
```

### Login Flow (BROKEN)
```
User visits /admin-login
    ↓
Enters email & password
    ↓
AdminLogin.tsx calls signIn()
    ↓
authService.ts
    ├─ Firebase Auth: signInWithEmailAndPassword()
    ├─ Fetches UserProfile from Firestore
    └─ Returns: {
         uid: "user123",
         email: "admin@example.com",
         role: undefined ❌,
         roleId: "abc123" ✅,
         roleName: "Administrator" ✅
       }
    ↓
AdminLogin.tsx checks: if (user.role !== "admin")
    ├─ user.role = undefined
    ├─ undefined !== "admin" = TRUE
    └─ ❌ DENY ACCESS - "Access denied"

Result: User cannot log in despite having admin role!
```

### Route Protection Flow (INCOMPLETE)
```
User navigates to /admin/roles
    ↓
ProtectedRoute.tsx checks:
    ├─ Is user authenticated? ✅
    ├─ Does user.role === "admin"? ❌ (undefined)
    └─ Redirect to /customer

Result: User denied access even with manage_roles permission
```

---

## Fixed Flow (WORKING)

### User Creation Flow (HYBRID)
```
Admin Portal
    ↓
CreateUserModal.tsx
    ├─ Fetches: getAllRoles() → [Admin, Support Manager, ...]
    ├─ User selects: "Administrator" role
    ├─ Determines legacy role from permissions:
    │  └─ Has "manage_roles"? → role = "admin"
    ├─ Assigns:
    │  ├─ roleId = "abc123" ✅
    │  ├─ roleName = "Administrator" ✅
    │  └─ role = "admin" ✅ (for compatibility)
    └─ Saves to Firestore
         ├─ uid: "user123"
         ├─ email: "admin@example.com"
         ├─ roleId: "abc123" ✅
         ├─ roleName: "Administrator" ✅
         └─ role: "admin" ✅

Result: User created with both systems
```

### Login Flow (FIXED)
```
User visits /admin-login
    ↓
Enters email & password
    ↓
AdminLogin.tsx calls signIn()
    ↓
authService.ts returns: {
  uid: "user123",
  email: "admin@example.com",
  role: "admin" ✅,
  roleId: "abc123" ✅,
  roleName: "Administrator" ✅
}
    ↓
AdminLogin.tsx checks:
    ├─ if (user.role === "admin") ✅ TRUE
    ├─ ✅ ALLOW ACCESS
    └─ Navigate to /admin

Result: User logs in successfully!
```

### Route Protection Flow (COMPLETE)
```
User navigates to /admin/roles
    ↓
ProtectedRoute.tsx checks:
    ├─ Is user authenticated? ✅
    ├─ Does user.role === "admin"? ✅ TRUE
    ├─ Does user have "manage_roles" permission?
    │  ├─ Get user permissions from roleId
    │  ├─ Check: hasPermission(permissions, "manage_roles")
    │  └─ ✅ TRUE
    └─ ✅ ALLOW ACCESS

Result: User can access admin routes
```

---

## Permission Checking Flow (NEW)

### Before (No Permission Checking)
```
ProtectedRoute.tsx
    ├─ requiredRole: "admin"
    ├─ requiredPermission: undefined ❌
    └─ Check: user.role === "admin"
         └─ All admins have all permissions (assumed)

Problem: Cannot distinguish between:
- Admin with manage_roles permission
- Admin with only view_tickets permission
```

### After (With Permission Checking)
```
ProtectedRoute.tsx
    ├─ requiredRole: "admin"
    ├─ requiredPermission: "manage_roles" ✅
    └─ Check:
         ├─ user.role === "admin" ✅
         ├─ Get permissions from roleId
         ├─ hasPermission(permissions, "manage_roles") ✅
         └─ ✅ ALLOW ACCESS

Benefit: Can enforce specific permissions
- Route requires "manage_roles" → Only admins with that permission
- Route requires "view_tickets" → Any user with that permission
```

---

## Data Flow Comparison

### Current (Broken)
```
┌─────────────────────────────────────────────────────────────┐
│ Firestore User Document                                     │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   uid: "user123",                                           │
│   email: "admin@example.com",                               │
│   roleId: "abc123" ← Created by CreateUserModal ✅          │
│   roleName: "Administrator" ← Created by CreateUserModal ✅ │
│   role: undefined ← NOT SET ❌                              │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ AdminLogin.tsx                                              │
├─────────────────────────────────────────────────────────────┤
│ Check: user.role === "admin"                               │
│ Result: undefined === "admin" → FALSE ❌                   │
│ Action: DENY ACCESS                                         │
└─────────────────────────────────────────────────────────────┘
```

### Fixed (Working)
```
┌─────────────────────────────────────────────────────────────┐
│ Firestore User Document                                     │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   uid: "user123",                                           │
│   email: "admin@example.com",                               │
│   roleId: "abc123" ← Custom role ✅                         │
│   roleName: "Administrator" ← Display name ✅               │
│   role: "admin" ← Legacy field for compatibility ✅         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ AdminLogin.tsx                                              │
├─────────────────────────────────────────────────────────────┤
│ Check 1: user.role === "admin"                             │
│ Result: "admin" === "admin" → TRUE ✅                      │
│ Action: ALLOW ACCESS                                        │
│                                                             │
│ OR                                                          │
│                                                             │
│ Check 2: user.roleId exists + has manage_roles             │
│ Result: roleId exists + permission found → TRUE ✅         │
│ Action: ALLOW ACCESS                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## System Architecture

### Current (Inconsistent)
```
┌──────────────────────────────────────────────────────────────┐
│                    RBAC System (Broken)                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Role Management          User Management                   │
│  ├─ Create roles ✅       ├─ Create users ✅                │
│  ├─ 19 permissions ✅     ├─ Assign roleId ✅               │
│  └─ Permission UI ✅      └─ Assign permissions ✅           │
│                                                              │
│  ↓ (Disconnect)                                             │
│                                                              │
│  Authentication           Authorization                     │
│  ├─ Check role ✅         ├─ Check role ✅                  │
│  ├─ Ignore roleId ❌      ├─ Ignore permissions ❌          │
│  └─ Login fails ❌        └─ No permission enforcement ❌   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Fixed (Consistent)
```
┌──────────────────────────────────────────────────────────────┐
│                    RBAC System (Fixed)                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Role Management          User Management                   │
│  ├─ Create roles ✅       ├─ Create users ✅                │
│  ├─ 19 permissions ✅     ├─ Assign roleId ✅               │
│  └─ Permission UI ✅      ├─ Assign role ✅                 │
│                           └─ Assign permissions ✅           │
│                                                              │
│  ↓ (Connected)                                              │
│                                                              │
│  Authentication           Authorization                     │
│  ├─ Check role ✅         ├─ Check role ✅                  │
│  ├─ Check roleId ✅       ├─ Check permissions ✅           │
│  └─ Login works ✅        └─ Permission enforcement ✅      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```


