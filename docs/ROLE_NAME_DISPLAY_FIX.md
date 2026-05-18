# ✅ Role Name Display Fix - Show Role Names Instead of IDs

## 🎯 Issue Fixed

When editing a user and changing their role, the role dropdown was showing random strings (Firestore document IDs) instead of role names.

**Before:**
```
Role dropdown showed: "U1YhKav6LpST9XTTNu8A" (random ID)
```

**After:**
```
Role dropdown shows: "Support Manager" (actual role name)
```

---

## 📝 Root Cause

The system was storing only the `roleId` (Firestore document ID) in the user profile, but not the role name. When displaying the role, it would show the ID instead of the human-readable name.

---

## ✨ Solution

### 1. **Updated UserProfile Interface**
Added `roleName` field to store the display name:

```typescript
export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  role?: UserRole; // Legacy (optional)
  roleId?: string; // Firestore role ID
  roleName?: string; // NEW: Display name of the role
  department?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
```

### 2. **Updated EditUserModal.tsx**
When updating a user, fetch the role name and store it:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Find the selected role to get its name
  const selectedRole = roles.find((r) => r.id === formData.role);
  
  await updateUserProfile(user.id!, {
    displayName: formData.displayName,
    department: formData.department,
    roleId: formData.role,
    roleName: selectedRole?.name || formData.role,
  });
};
```

### 3. **Updated CreateUserModal.tsx**
Same approach - fetch role name when creating:

```typescript
const selectedRole = roles.find((r) => r.id === formData.role);

await createUserWithEmailPassword(
  formData.email,
  formData.password,
  formData.displayName,
  formData.department,
  formData.role,
  selectedRole?.name || formData.role
);
```

### 4. **Updated userService.ts**
Store both roleId and roleName:

```typescript
export const createUserWithEmailPassword = async (
  email: string,
  password: string,
  displayName: string,
  department: string,
  roleId: string,
  roleName?: string
): Promise<string> => {
  const profileId = await createUserProfile({
    uid,
    email,
    displayName,
    roleId,
    roleName: roleName || roleId,
    department,
  });
  return profileId;
};
```

### 5. **Updated Users.tsx**
Display roleName instead of role ID:

```typescript
<Badge variant="secondary" className="text-xs">
  {user.roleName || user.role || "N/A"}
</Badge>
```

---

## 📊 Data Structure

### Before
```
users/
├── uid: string
├── email: string
├── displayName: string
├── roleId: "U1YhKav6LpST9XTTNu8A"  ← Random ID shown to user
├── department: string
└── ...
```

### After
```
users/
├── uid: string
├── email: string
├── displayName: string
├── roleId: "U1YhKav6LpST9XTTNu8A"  ← Stored for reference
├── roleName: "Support Manager"     ← NEW: Displayed to user
├── department: string
└── ...
```

---

## 🔄 User Flow

### Creating a User
1. Admin selects a role from dropdown
2. System fetches the role name
3. User is created with both `roleId` and `roleName`
4. Users table displays the `roleName`

### Editing a User
1. Admin changes the role
2. System fetches the new role name
3. User profile updated with new `roleId` and `roleName`
4. Users table displays the updated `roleName`

---

## ✅ What's Fixed

✅ Role dropdown shows role names (not IDs)
✅ Users table displays role names (not IDs)
✅ Both roleId and roleName stored for reference
✅ Backward compatible with legacy `role` field
✅ No more random strings in UI

---

## 🧪 Testing

### Test 1: Create User
1. Go to `/admin/users` → "Add User"
2. Select a role from dropdown
3. ✅ Should show role name (e.g., "Support Manager")
4. Create user
5. ✅ Users table should show role name

### Test 2: Edit User
1. Go to `/admin/users` → Edit a user
2. Change the role
3. ✅ Should show role name in dropdown
4. Update user
5. ✅ Users table should show new role name

### Test 3: Create New Role and Assign
1. Go to `/admin/roles` → Create new role (e.g., "Supervisor")
2. Go to `/admin/users` → Create/Edit user
3. ✅ New role should appear in dropdown with correct name
4. Assign user to new role
5. ✅ Users table should show "Supervisor"

---

## 🚀 Build Status

✅ Build successful with no errors
✅ All TypeScript checks passed
✅ Dev server running on http://localhost:5146/

---

## 📝 Files Modified

1. `src/services/userService.ts`
   - Added `roleName` to UserProfile interface
   - Updated `createUserWithEmailPassword` to accept and store roleName

2. `src/components/modals/EditUserModal.tsx`
   - Fetch role name when updating user
   - Pass roleName to updateUserProfile

3. `src/components/modals/CreateUserModal.tsx`
   - Fetch role name when creating user
   - Pass roleName to createUserWithEmailPassword

4. `src/pages/admin/Users.tsx`
   - Display `roleName` instead of `role` in users table

---

**Status**: ✅ COMPLETE
**Impact**: Low - Display fix only
**Rollback**: Easy - Revert to showing role ID if needed

