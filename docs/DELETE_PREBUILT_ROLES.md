# 🗑️ Delete Prebuilt Roles - Complete Guide

## 📋 Roles to Delete

The following prebuilt roles will be deleted from Firestore:

- ❌ Clerk
- ❌ Administrator
- ❌ Administrator of all types function of the system
- ❌ Customer (if custom)
- ❌ Department Staff (if custom)
- ❌ Admin (if custom)

## 🎯 What Stays

The 3 system roles (defined in code, not in Firestore) will remain:

- ✅ Admin (System)
- ✅ Department Staff (System)
- ✅ Customer (System)

## 🚀 Option 1: Using the Cleanup UI (Easiest)

### Step 1: Navigate to Cleanup Page
```
http://localhost:5173/admin/cleanup-roles
```

### Step 2: Load Custom Roles
Click **"Load Custom Roles"** button to see all roles that will be deleted.

### Step 3: Delete All
1. Click **"Delete All Custom Roles"**
2. Confirm in the warning dialog
3. Wait for success message

### Step 4: Verify
Navigate to `/admin/roles` and verify only system roles remain.

---

## 🚀 Option 2: Using Firebase Console (Manual)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/

### Step 2: Select Your Project
Choose the MISconnect project.

### Step 3: Navigate to Firestore
- Click **Firestore Database** in the left sidebar
- Find the **roles** collection

### Step 4: Delete Each Role
For each custom role:
1. Click the role document
2. Click the **Delete** button (trash icon)
3. Confirm deletion

### Step 5: Verify
Refresh the page and confirm only system roles remain.

---

## 🚀 Option 3: Using Node.js Script (Programmatic)

### Prerequisites
- Node.js installed
- Firebase service account key file

### Step 1: Get Firebase Service Account Key
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save as `firebase-service-account.json` in project root

### Step 2: Run Cleanup Script
```bash
node scripts/cleanup-roles.js
```

### Step 3: Confirm Results
The script will display:
- List of roles to delete
- Deletion progress
- Final results

---

## 🚀 Option 4: Using Browser Console (Advanced)

### Step 1: Open Browser Console
Press `F12` and go to **Console** tab.

### Step 2: Run Cleanup Code
```javascript
// Import the cleanup function
import { deleteAllCustomRoles, getCustomRoles } from './src/services/roleService.ts';

// Load and display roles
const roles = await getCustomRoles();
console.log('Roles to delete:', roles);

// Delete all
await deleteAllCustomRoles();
console.log('✅ All custom roles deleted!');
```

---

## ✅ After Deletion

### Role Management Page
Your `/admin/roles` page will show only:

| Role | Type | Description |
|------|------|-------------|
| Admin | System | Full system access |
| Department Staff | System | Can manage tickets and view reports |
| Customer | System | Can create and view own tickets |

### User Creation
When creating users, the role dropdown will show only:
- Customer
- Department Staff
- Admin

### User Editing
When editing users, the role dropdown will show only:
- Customer
- Department Staff
- Admin

---

## 🔐 Safety Notes

✅ System roles **cannot be deleted** (protected in code)
✅ Only custom roles from Firestore are removed
✅ User data and assignments remain intact
✅ User permissions are preserved
✅ No data migration needed

---

## 📊 Verification Checklist

After deletion, verify:

- [ ] Navigate to `/admin/roles`
- [ ] Only 3 system roles visible (Admin, Department Staff, Customer)
- [ ] No custom roles visible
- [ ] Create user modal shows only 3 roles
- [ ] Edit user modal shows only 3 roles
- [ ] No React console warnings
- [ ] Application works normally

---

## 🆘 Troubleshooting

### Issue: Cleanup page not loading
**Solution:** Ensure you're logged in as admin and navigate to `/admin/cleanup-roles`

### Issue: "Failed to load custom roles"
**Solution:** Check browser console for errors. Ensure Firestore permissions allow reading roles.

### Issue: Deletion fails
**Solution:** Check Firestore security rules. Ensure your user has permission to delete documents.

### Issue: Roles still showing after deletion
**Solution:** Refresh the page. Clear browser cache if needed.

---

## 📝 Recommended Approach

1. **Backup** - Take a screenshot of current roles (optional)
2. **Delete** - Use Option 1 (Cleanup UI) for easiest approach
3. **Verify** - Check `/admin/roles` to confirm deletion
4. **Test** - Create a new user and verify role assignment works
5. **Cleanup** - Delete `src/pages/admin/CleanupRoles.tsx` if desired

---

**Status**: Ready to delete
**Date**: 2025-10-20

