# 🧹 Cleanup Custom Roles - Remove All Prebuilt Roles

## 📋 Overview

This guide explains how to remove all custom roles from Firestore, keeping only the 3 system roles:
- Admin
- Department Staff
- Customer

## 🔧 How to Clean Up

### Option 1: Using Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your MISconnect project
3. Navigate to **Firestore Database**
4. Find the **roles** collection
5. Delete each custom role document:
   - Administrator
   - Administrator of all types function of the system
   - Clerk
   - Any other custom roles

### Option 2: Using the Cleanup Function (Programmatic)

A new function `deleteAllCustomRoles()` has been added to `roleService.ts` that can delete all custom roles at once.

**To use it:**

1. Open browser console (F12)
2. Run this code:

```javascript
// Import the function
import { deleteAllCustomRoles } from './src/services/roleService.ts';

// Delete all custom roles
await deleteAllCustomRoles();
console.log('All custom roles deleted!');
```

### Option 3: Using a Temporary Admin Page

You can create a temporary admin cleanup page that deletes all custom roles with a button click.

**Steps:**

1. Create a new file: `src/pages/admin/CleanupRoles.tsx`
2. Add a "Delete All Custom Roles" button
3. Call `deleteAllCustomRoles()` when clicked
4. Delete the file after cleanup

## ✅ After Cleanup

Your Role Management page will show only:

| Role | Type | Description |
|------|------|-------------|
| Admin | System | Full system access |
| Department Staff | System | Can manage tickets and view reports |
| Customer | System | Can create and view own tickets |

## 🔐 Safety Notes

- ✅ System roles (admin, department, user) **cannot be deleted**
- ✅ Only custom roles in Firestore will be removed
- ✅ User assignments will still work (they reference role keys, not IDs)
- ⚠️ If users have custom permissions, they will keep those permissions

## 📊 What Gets Deleted

**From Firestore `roles` collection:**
- ❌ Administrator
- ❌ Administrator of all types function of the system
- ❌ Clerk
- ❌ Any other custom roles

**What Stays:**
- ✅ System roles (defined in code, not in Firestore)
- ✅ User data and assignments
- ✅ User permissions

## 🚀 Recommended Approach

1. **Backup** - Take a screenshot of current roles (optional)
2. **Delete** - Use Firebase Console to manually delete each custom role
3. **Verify** - Refresh the Role Management page to confirm only system roles remain
4. **Test** - Create a new user and verify role assignment works

## 📝 Code Reference

The new function in `roleService.ts`:

```typescript
export const deleteAllCustomRoles = async (): Promise<void> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, ROLES_COLLECTION));
    const deletePromises = querySnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting all custom roles:", error);
    throw error;
  }
};
```

---

**Status**: Ready to cleanup
**Date**: 2025-10-20

