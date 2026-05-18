# Permission-Based Access Control - Testing Guide

## 🧪 How to Test

### Step 1: Create a Limited Staff Role

1. Log in as Admin
2. Go to **Staff Portal → Roles**
3. Click **Create Role**
4. Enter:
   - **Name**: "MIS Staff"
   - **Description**: "Troubleshooting tickets and viewing reports"
5. Select ONLY these permissions:
   - ✅ view_tickets
   - ✅ create_tickets
   - ✅ edit_tickets
   - ✅ delete_tickets
   - ✅ accept_tickets
   - ✅ view_reports
   - ✅ export_reports
   - ✅ view_notifications
6. Click **Create**

### Step 2: Create a User with Limited Role

1. Go to **Staff Portal → Users**
2. Click **Create User**
3. Enter:
   - **Email**: `misstaff@example.com`
   - **Password**: `TestPassword123!`
   - **Display Name**: "MIS Staff Member"
   - **Role**: "MIS Staff" (the role you just created)
   - **Department**: Select any department
4. Click **Create**

### Step 3: Test Access with Limited Role

1. Log out from Admin account
2. Go to `/admin-login`
3. Log in with:
   - **Email**: `misstaff@example.com`
   - **Password**: `TestPassword123!`
4. You should see the Staff Portal dashboard

### Step 4: Test Page Access

#### ✅ Pages You SHOULD Be Able to Access

1. **Dashboard** (`/admin`)
   - Expected: ✅ Accessible
   - Reason: No permission required

2. **Ticket Board** (`/admin/board`)
   - Expected: ✅ Accessible
   - Reason: Has `view_tickets` permission

3. **Ticket Detail** (`/admin/ticket/:id`)
   - Expected: ✅ Accessible
   - Reason: Has `view_tickets` permission

#### ❌ Pages You SHOULD NOT Be Able to Access

1. **Users** (`/admin/users`)
   - Expected: ❌ Redirected to `/admin`
   - Reason: Missing `view_users` permission
   - Console: "Unauthorized access attempt: User lacks required permission 'view_users'"

2. **Departments** (`/admin/departments`)
   - Expected: ❌ Redirected to `/admin`
   - Reason: Missing `view_departments` permission
   - Console: "Unauthorized access attempt: User lacks required permission 'view_departments'"

3. **Roles** (`/admin/roles`)
   - Expected: ❌ Redirected to `/admin`
   - Reason: Missing `manage_roles` permission
   - Console: "Unauthorized access attempt: User lacks required permission 'manage_roles'"

4. **KPM Reports** (`/admin/kpm-reports`)
   - Expected: ❌ Redirected to `/admin`
   - Reason: Missing `view_kpm_reports` permission
   - Console: "Unauthorized access attempt: User lacks required permission 'view_kpm_reports'"

5. **Settings** (`/admin/settings`)
   - Expected: ❌ Redirected to `/admin`
   - Reason: Missing `view_settings` permission
   - Console: "Unauthorized access attempt: User lacks required permission 'view_settings'"

---

## 🔍 How to Verify

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Try accessing a page without permission
4. You should see:
   ```
   Unauthorized access attempt: User lacks required permission 'view_users'
   ```

### Check Sidebar Navigation

The sidebar should only show pages you have permission to access:
- ✅ Dashboard (always visible)
- ✅ Tickets (visible if you have ticket permissions)
- ❌ Users (hidden if you don't have `view_users`)
- ❌ Departments (hidden if you don't have `view_departments`)
- ❌ Roles (hidden if you don't have `manage_roles`)
- ❌ Settings (hidden if you don't have `view_settings`)

---

## 📊 Test Scenarios

### Scenario 1: MIS Staff with Ticket Permissions

**Role**: MIS Staff
**Permissions**: view_tickets, create_tickets, edit_tickets, delete_tickets, accept_tickets, view_reports, export_reports, view_notifications

**Expected Results**:
- ✅ Can access Dashboard
- ✅ Can access Ticket Board
- ✅ Can access Ticket Details
- ❌ Cannot access Users
- ❌ Cannot access Departments
- ❌ Cannot access Roles
- ❌ Cannot access KPM Reports
- ❌ Cannot access Settings

### Scenario 2: Support Manager with Extended Permissions

**Role**: Support Manager
**Permissions**: view_tickets, create_tickets, edit_tickets, delete_tickets, accept_tickets, reassign_tickets, view_reports, export_reports

**Expected Results**:
- ✅ Can access Dashboard
- ✅ Can access Ticket Board
- ✅ Can access Ticket Details
- ❌ Cannot access Users
- ❌ Cannot access Departments
- ❌ Cannot access Roles
- ❌ Cannot access KPM Reports
- ❌ Cannot access Settings

### Scenario 3: Admin with All Permissions

**Role**: Admin
**Permissions**: All 19 permissions

**Expected Results**:
- ✅ Can access Dashboard
- ✅ Can access Ticket Board
- ✅ Can access Ticket Details
- ✅ Can access Users
- ✅ Can access Departments
- ✅ Can access Roles
- ✅ Can access KPM Reports
- ✅ Can access Settings

---

## 🐛 Troubleshooting

### Issue: User can access all pages

**Possible Causes**:
1. User has `manage_roles` permission (admin-level)
2. User is assigned `admin` legacy role
3. Permission checking not working

**Solution**:
1. Check user's role and permissions in Firestore
2. Verify role has correct permissions
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: User cannot access any pages

**Possible Causes**:
1. User doesn't have any staff permissions
2. User is not assigned a role
3. Role doesn't exist

**Solution**:
1. Verify user has at least one staff permission
2. Check user's `roleId` in Firestore
3. Verify role exists in `roles` collection
4. Assign a valid role to user

### Issue: Permission checking is slow

**Possible Causes**:
1. Firestore queries are slow
2. Network latency
3. Too many permission checks

**Solution**:
1. Check Firestore performance
2. Verify network connection
3. Consider caching permissions

---

## ✅ Testing Checklist

- [ ] Created limited staff role with specific permissions
- [ ] Created user with limited role
- [ ] Logged in as limited staff user
- [ ] Accessed Dashboard (should work)
- [ ] Accessed Ticket Board (should work)
- [ ] Tried accessing Users page (should be denied)
- [ ] Tried accessing Departments page (should be denied)
- [ ] Tried accessing Roles page (should be denied)
- [ ] Tried accessing KPM Reports page (should be denied)
- [ ] Tried accessing Settings page (should be denied)
- [ ] Checked browser console for permission warnings
- [ ] Verified sidebar only shows accessible pages
- [ ] Tested with different role combinations
- [ ] Verified admin can access all pages
- [ ] Verified customer cannot access staff portal

---

## 📝 Permission Reference

### Ticket Permissions
- `view_tickets` - View tickets
- `create_tickets` - Create new tickets
- `edit_tickets` - Edit existing tickets
- `delete_tickets` - Delete tickets
- `accept_tickets` - Accept tickets
- `reassign_tickets` - Reassign tickets

### User Permissions
- `view_users` - View users
- `create_users` - Create new users
- `edit_users` - Edit user details
- `delete_users` - Delete users

### Department Permissions
- `view_departments` - View departments
- `create_departments` - Create new departments
- `edit_departments` - Edit department details
- `delete_departments` - Delete departments

### Report Permissions
- `view_reports` - View standard reports
- `export_reports` - Export standard reports
- `view_kpm_reports` - View KPM reports
- `export_kpm_reports` - Export KPM reports

### Other Permissions
- `view_notifications` - View notifications
- `manage_roles` - Create and manage roles
- `view_settings` - View system settings
- `edit_settings` - Edit system settings

---

**Status**: ✅ **READY FOR TESTING**

