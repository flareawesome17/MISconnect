# Feature User Guide

## 🎯 Feature 1: Department Portal - Edit Ticket Details

### For Department Users

#### How to Edit Your Ticket

1. **Log in** to the Department Portal
2. **Navigate** to your ticket from the dashboard
3. **View** the ticket details page
4. **Look for** the green "Edit" button in the ticket header
   - The button only appears if you can edit the ticket
5. **Click** the "Edit" button
6. **Update** the following fields:
   - **Title**: Change the ticket subject
   - **Description**: Update the problem description
   - **Category**: Select from Hardware, Software, Network, Account, Other
   - **Priority**: Choose Low, Medium, or High
7. **Review** the info box explaining what you cannot edit
8. **Click** "Save Changes" to update
9. **See** the success notification confirming the update

#### When Can You Edit?

✅ **You CAN edit if:**
- You created the ticket
- The ticket status is "Pending" or "In Progress"
- You are logged in as the ticket creator

❌ **You CANNOT edit if:**
- The ticket status is "Completed" or "Urgent"
- You did not create the ticket
- The ticket has been marked as spam

#### What You Cannot Edit

The following fields are managed by MIS staff only:
- **Status** - Only MIS staff can change ticket status
- **Assigned Staff** - Only MIS staff can assign tickets
- **Actions Taken** - Only MIS staff can record actions
- **Internal Notes** - Only MIS staff can add internal notes

#### Example Workflow

```
1. Create ticket: "Printer not working"
2. MIS staff accepts and starts working
3. You realize you need to add more details
4. Click "Edit" button
5. Update description with more information
6. Save changes
7. MIS staff sees updated description and continues work
```

---

## 🎯 Feature 2: MIS Portal - Mark Tickets as Spam

### For MIS Staff

#### How to Mark a Ticket as Spam

1. **Log in** to the MIS Portal
2. **Navigate** to the ticket you want to mark as spam
3. **View** the ticket details page
4. **Scroll down** to the "Actions" section on the right sidebar
5. **Look for** the red "Mark as Spam" button
   - The button only appears if you have permission
6. **Click** the "Mark as Spam" button
7. **Review** the confirmation dialog showing:
   - What will happen when marked as spam
   - Warning about the action
   - Note that you can unmark later if needed
8. **Click** "Mark as Spam" to confirm
9. **See** the success notification
10. **Verify** the ticket status changed to "Spam"

#### Permission Requirements

To mark tickets as spam, you need:
- **Permission**: `mark_tickets_as_spam`
- **Role**: Admin role (or custom role with this permission)

#### What Happens When You Mark as Spam

✅ **Automatically:**
- Ticket status changes to "Spam"
- Action entry added to ticket history
- Your email recorded as who marked it
- Timestamp recorded
- Spam badge appears on ticket

#### Visual Indicators

**Spam Tickets Show:**
- Gray badge with "Spam" label
- Ban icon
- Line-through text styling
- Reduced opacity (grayed out appearance)

#### Example Workflow

```
1. Review ticket: "Buy me a new laptop"
2. Recognize as spam/abuse
3. Click "Mark as Spam"
4. Confirm in dialog
5. Ticket status changes to "Spam"
6. Action recorded: "Marked as spam by admin@example.com"
7. Ticket appears grayed out in lists
```

#### Spam Ticket Audit Trail

When you mark a ticket as spam, the following is recorded:
- **Who**: Your email address
- **When**: Exact timestamp
- **What**: "Marked as spam by [your email]" entry in Actions Taken

This creates a complete audit trail for compliance and review.

---

## 🔍 Viewing Spam Tickets

### In Ticket Lists
- Spam tickets appear with gray background
- "Spam" badge is visually distinct
- Easy to identify at a glance

### In Ticket Details
- Status shows as "Spam"
- Action history shows who marked it and when
- Original ticket details still visible for reference

---

## ⚠️ Important Notes

### Feature 1: Edit Tickets
- **Edits are permanent** - No undo available
- **Timestamps update** - updatedAt field changes
- **MIS staff sees changes** - They'll see your latest edits
- **Cannot edit resolved tickets** - Only pending/in-progress

### Feature 2: Mark as Spam
- **Cannot unmark** - Currently no unmark feature (planned for future)
- **Visible to all** - All staff can see spam tickets
- **Audit trail** - All marking actions are recorded
- **Cannot mark twice** - Button disappears after marking

---

## 🆘 Troubleshooting

### Feature 1: Edit Button Not Showing

**Possible reasons:**
- You didn't create the ticket
- Ticket status is not "Pending" or "In Progress"
- You're not logged in
- Browser cache issue (try hard refresh)

**Solution:**
- Verify you created the ticket
- Check ticket status
- Log out and log back in
- Hard refresh browser (Ctrl+Shift+R)

### Feature 2: Mark as Spam Button Not Showing

**Possible reasons:**
- You don't have mark_tickets_as_spam permission
- Ticket is already marked as spam
- You're not logged in as admin

**Solution:**
- Check your role permissions
- Ask admin to grant permission
- Verify ticket status is not already "Spam"
- Log out and log back in

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Contact your MIS administrator
3. Report bugs to the development team


