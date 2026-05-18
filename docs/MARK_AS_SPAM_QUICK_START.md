# Mark as Spam Feature - Quick Start Guide

## 🎯 What Was Fixed

The "Mark as Spam" feature is now fully functional with all components working together:

1. ✅ Permission checkbox appears in Role Management UI
2. ✅ Admin role has the permission by default
3. ✅ Permission checks work correctly
4. ✅ "Mark as Spam" button appears on ticket detail page
5. ✅ Spam badge displays correctly

---

## 🚀 How to Use

### For Admins: Mark a Ticket as Spam

**Step 1: Go to Ticket Board**
- Navigate to MIS Portal → Ticket Board
- Or go to `/admin/tickets`

**Step 2: Open a Ticket**
- Click on any ticket to view details
- Or go to `/admin/tickets/[ticket-id]`

**Step 3: Find the Mark as Spam Button**
- Scroll down to the right sidebar
- Look for the "Actions" section
- You'll see a red button with a Ban icon labeled "Mark as Spam"

**Step 4: Click Mark as Spam**
- Click the red "Mark as Spam" button
- A confirmation dialog will appear
- Review the warning message
- Click "Mark as Spam" to confirm

**Step 5: Verify**
- Ticket status changes to "Spam"
- Spam badge appears (gray with line-through)
- Action entry added to ticket history
- Success notification shown

---

## 🔐 Permission Management

### For Admins: Assign Permission to Custom Roles

**Step 1: Go to Role Management**
- Navigate to MIS Portal → Admin → Role Management
- Or go to `/admin/roles`

**Step 2: Create or Edit a Role**
- Click "Create Role" to create new role
- Or click "Edit" on existing role

**Step 3: Find the Permission Checkbox**
- Scroll to "Tickets" section
- Look for "mark_tickets_as_spam" checkbox
- Check the box to enable permission

**Step 4: Save**
- Click "Save Role" button
- Role now has permission to mark tickets as spam

**Step 5: Assign Role to User**
- Go to User Management (`/admin/users`)
- Edit user and assign the role
- User can now mark tickets as spam

---

## 📊 Visual Indicators

### Mark as Spam Button
- **Location**: Right sidebar, "Actions" section
- **Color**: Red (bg-red-600)
- **Icon**: Ban icon
- **Text**: "Mark as Spam"
- **Shows when**: User has permission AND ticket is not already spam

### Spam Badge
- **Location**: Ticket list and ticket detail page
- **Color**: Gray (bg-gray-100)
- **Icon**: Ban icon
- **Text**: "Spam"
- **Style**: Line-through text, reduced opacity
- **Shows when**: Ticket status is "spam"

### Spam Ticket in List
- **Appearance**: Grayed out
- **Badge**: "Spam" badge visible
- **Text**: Line-through styling
- **Opacity**: Reduced (60%)

---

## 🔍 Verification Steps

### Verify Permission Checkbox Appears

1. Go to `/admin/roles`
2. Click on "Admin" role
3. Scroll to "Tickets" section
4. Look for "mark_tickets_as_spam" checkbox
5. ✅ Should be checked for Admin role

### Verify Button Appears on Ticket

1. Go to `/admin/tickets`
2. Click on any ticket
3. Scroll to right sidebar "Actions" section
4. Look for red "Mark as Spam" button
5. ✅ Button should be visible

### Verify Spam Badge Works

1. Mark a ticket as spam (follow steps above)
2. Go back to ticket board
3. Look at the marked ticket
4. ✅ Should show gray "Spam" badge
5. ✅ Should have line-through styling

---

## ⚙️ Technical Details

### Permission Type
- **Name**: `mark_tickets_as_spam`
- **Category**: Tickets
- **Default**: Enabled for Admin role
- **Type**: Boolean (enabled/disabled)

### Ticket Status
- **New Status**: "spam"
- **Added to**: Ticket status union type
- **Tracking Fields**:
  - `markedAsSpamBy`: Email of staff who marked it
  - `markedAsSpamAt`: Timestamp when marked

### Audit Trail
When a ticket is marked as spam:
- Action entry created: "Marked as spam by [email]"
- Author recorded: Staff member's email
- Timestamp recorded: Exact time of marking
- Visible in: Actions Taken section

---

## 🐛 Troubleshooting

### Button Not Showing?

**Check 1: Browser Cache**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Check 2: User Permissions**
- Go to `/admin/roles`
- Verify your role has "mark_tickets_as_spam" permission

**Check 3: Ticket Status**
- Button only shows if ticket is NOT already spam
- If ticket status is "spam", button won't appear

**Check 4: Browser Console**
- Open DevTools (F12)
- Check Console for errors
- Look for permission check logs

### Permission Checkbox Not Showing?

**Check 1: Refresh Page**
- Hard refresh: `Ctrl+Shift+R`

**Check 2: Check Section**
- Permission is under "Tickets" section
- Not under Users, Departments, Reports, etc.

**Check 3: Browser Console**
- Check for JavaScript errors
- Verify role data loads correctly

---

## 📋 Complete Feature Checklist

- [x] Permission added to roleService.ts
- [x] Permission added to Role Management UI
- [x] Admin role has permission by default
- [x] Permission checkbox appears in UI
- [x] Custom roles can be assigned permission
- [x] Permission check works on ticket detail page
- [x] Mark as Spam button appears when authorized
- [x] Mark as Spam button hidden when not authorized
- [x] Mark as Spam button hidden when ticket already spam
- [x] Confirmation dialog appears before marking
- [x] Ticket status changes to "spam"
- [x] Action entry added to history
- [x] Spam badge displays correctly
- [x] Spam ticket appears grayed out in lists
- [x] Audit trail recorded (who, when)
- [x] Success notification shown
- [x] Error handling implemented
- [x] Responsive design working
- [x] Build successful
- [x] Deployment successful

---

## 🎉 You're All Set!

The "Mark as Spam" feature is now fully functional and ready to use. 

**Live at**: https://misconnect.web.app

**Next Steps**:
1. Hard refresh your browser
2. Log in as admin
3. Go to a ticket
4. Try marking it as spam
5. Verify the spam badge appears

Enjoy! 🚀


