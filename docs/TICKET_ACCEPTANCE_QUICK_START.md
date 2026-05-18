# Ticket Acceptance System - Quick Start Guide

## 🚀 Getting Started

### For Customers
1. **Create a Ticket**
   - Go to `/customer` dashboard
   - Click "New Ticket" button
   - Fill in title, description, category, priority
   - Submit

2. **Track Your Ticket**
   - View ticket in your dashboard
   - Check status and assignment
   - Receive notifications when accepted/reassigned

### For IT Staff (Department Role)
1. **View Available Tickets**
   - Go to `/admin/board`
   - Look at "Available" column (green)
   - Shows all unassigned pending tickets

2. **Accept a Ticket**
   - Click "Accept" button on ticket card
   - Ticket automatically assigned to you
   - Status changes to "in-progress"
   - Customer receives notification

3. **Work on Ticket**
   - Click ticket to view details
   - Add internal notes
   - Update status as needed
   - Mark as completed when done

### For Admins
1. **Full Ticket Management**
   - Go to `/admin/board` to see all tickets
   - Accept tickets like staff
   - Manually assign/reassign tickets
   - View complete audit trail

2. **Reassign Tickets**
   - Open ticket detail page
   - Scroll to "Actions" section
   - Use "Reassign To" dropdown
   - Click "Reassign" button
   - Customer notified automatically

3. **View Audit Trail**
   - Open ticket detail page
   - Scroll to "Activity & Audit Trail"
   - See all reassignments with timestamps
   - See acceptance information

## 📊 Kanban Board Columns

| Column | Color | Purpose | Who Can Accept |
|--------|-------|---------|-----------------|
| Available | Green | Unassigned tickets | Department/Admin |
| My Tickets | Blue | Your assigned tickets | Current user |
| Pending | Gray | All pending tickets | View only |
| In Progress | Blue | Being worked on | View only |
| Completed | Green | Finished tickets | View only |
| Urgent | Red | High priority | View only |

## 🔔 Notifications

### When You Receive Notifications
- **Ticket Accepted**: "Your ticket #2501200001 has been accepted by John Doe"
- **Ticket Reassigned**: "Your ticket #2501200001 has been reassigned to Jane Smith"

### Where to See Notifications
- Notification center (bell icon)
- Email (if configured)
- In-app toast messages

## 💡 Tips & Tricks

### Accept Tickets Faster
- Use Kanban board instead of detail page
- Accept button is right on the card
- No need to open full ticket details

### Track Changes
- Check "Activity & Audit Trail" section
- See who accepted and when
- See all reassignments with timestamps

### Manage Workload
- Check "My Tickets" column
- See all your assigned tickets
- Prioritize by status and priority

## ⚙️ Configuration

### User Roles
- **Admin**: Full control, can reassign
- **Department**: Can accept tickets
- **User**: Can create and view tickets

### Ticket Statuses
- **Pending**: New, unassigned
- **In Progress**: Accepted, being worked on
- **Completed**: Finished
- **Urgent**: High priority

### Ticket Priorities
- **Low**: Non-urgent issues
- **Medium**: Standard issues
- **High**: Important issues

## 🐛 Troubleshooting

### Ticket Not Appearing in Available Column
- Check if ticket is already assigned
- Check if status is "pending"
- Refresh the page

### Accept Button Not Showing
- Check your user role (must be department/admin)
- Check if ticket is already assigned
- Check if you're logged in

### Notification Not Received
- Check notification settings
- Check if notifications are enabled
- Refresh the page

### Reassign Button Not Showing
- Check if you're an admin
- Check if ticket is assigned
- Scroll down in Actions section

## 📱 Mobile Usage

### Responsive Design
- Kanban board works on mobile
- Columns stack on small screens
- Touch-friendly buttons
- Swipe to navigate

### Best Practices
- Use landscape mode for better view
- Tap "Accept" button to accept tickets
- Use detail page for reassignment

## 🔐 Security Notes

- Only admins can reassign tickets
- Only department staff can accept tickets
- Customers can only see their own tickets
- All changes are logged in audit trail

## 📞 Support

For issues or questions:
1. Check the audit trail for history
2. Review ticket details and notes
3. Contact system administrator
4. Check TICKET_ACCEPTANCE_IMPLEMENTATION.md for details

## 🎯 Common Workflows

### Workflow 1: Accept and Complete
1. View Kanban board
2. Click "Accept" on available ticket
3. Ticket moves to "My Tickets"
4. Work on ticket
5. Mark as completed

### Workflow 2: Reassign Ticket
1. Open ticket detail
2. Scroll to Actions
3. Select new assignee
4. Click "Reassign"
5. Customer notified

### Workflow 3: Track Ticket Status
1. Go to customer dashboard
2. Click on ticket
3. View status and assignment
4. Check activity timeline
5. See all changes

## ✨ Features Summary

✅ One-click ticket acceptance
✅ Automatic assignment
✅ Real-time Kanban board
✅ Reassignment with audit trail
✅ Customer notifications
✅ Mobile responsive
✅ Role-based access
✅ Complete activity history

