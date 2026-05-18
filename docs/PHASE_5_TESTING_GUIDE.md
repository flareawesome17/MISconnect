# Phase 5: Testing Guide - Enhanced Ticket Board & KPM Reports

## 🎯 Overview

This guide covers testing for the new features implemented in Phase 5:
1. **Permission System** - New KPM and Notification permissions
2. **Notification System** - Real-time notifications with accept button
3. **KPM Reports Page** - Analytics and performance monitoring
4. **Enhanced TicketBoard** - Tab-based mobile view, virtual scrolling, pagination, collapsible columns

---

## 🔐 Phase 1: Permission System Testing

### Test Setup
1. Start dev server: `npm run dev`
2. Login as admin: `admin@example.com` / `password123`
3. Navigate to `/admin/roles`

### Test Cases

#### 1.1 New Permissions Exist
- [ ] Go to Role Management page
- [ ] Click "Create Role" or edit existing role
- [ ] Verify these permissions exist in the list:
  - `view_kpm_reports` (in Reports category)
  - `export_kpm_reports` (in Reports category)
  - `view_notifications` (in Notifications category)

#### 1.2 Admin Role Has New Permissions
- [ ] Edit "admin" system role
- [ ] Verify all three new permissions are checked
- [ ] Cannot uncheck system role permissions (should be disabled)

#### 1.3 Department Role Has Correct Permissions
- [ ] Edit "department" system role
- [ ] Verify `view_kpm_reports` is checked
- [ ] Verify `view_notifications` is checked
- [ ] Verify `export_kpm_reports` is NOT checked

#### 1.4 User Role Has No New Permissions
- [ ] Edit "user" system role
- [ ] Verify none of the new permissions are checked

#### 1.5 Custom Role Permissions
- [ ] Create new custom role "Support Manager"
- [ ] Assign `view_kpm_reports` and `view_notifications`
- [ ] Save and verify permissions are saved
- [ ] Edit role again and verify permissions persist

---

## 🔔 Phase 2: Notification System Testing

### Test Setup
1. Have 2 browser windows open
2. Window 1: Logged in as admin
3. Window 2: Logged in as department staff member

### Test Cases

#### 2.1 Notification Center Displays Real Data
- [ ] Click notification bell icon in header
- [ ] Verify notification center opens
- [ ] Should show existing notifications from Firebase
- [ ] Notifications should have: title, message, timestamp, type badge

#### 2.2 New Available Ticket Notification
- [ ] In Window 1 (admin), create a new ticket
- [ ] Set status to "pending" and leave "assignedTo" empty
- [ ] In Window 2 (staff), check notification center
- [ ] Should see new notification: "New Available Ticket"
- [ ] Notification should include ticket number and department

#### 2.3 Accept Button Functionality
- [ ] In notification center, find available ticket notification
- [ ] Click "Accept" button
- [ ] Button should show loading state: "Accepting..."
- [ ] After success, notification should disappear
- [ ] Toast message: "Ticket #XXXXX accepted successfully!"

#### 2.4 Auto-Assignment After Accept
- [ ] After accepting ticket, go to Ticket Board
- [ ] Ticket should appear in "My Tickets" column
- [ ] Ticket should be assigned to current user's email
- [ ] Ticket status should be "in-progress"

#### 2.5 Multiple Staff Notifications
- [ ] Create 3 new available tickets
- [ ] Have 2 staff members logged in
- [ ] Both should receive notifications for all 3 tickets
- [ ] Each can accept independently

#### 2.6 Notification Persistence
- [ ] Accept a ticket notification
- [ ] Refresh the page
- [ ] Notification should not reappear (marked as read)
- [ ] Ticket should still be in "My Tickets"

---

## 📊 Phase 3: KPM Reports Page Testing

### Test Setup
1. Login as admin
2. Navigate to `/admin/kpm-reports` or use sidebar "KPM Reports"
3. Ensure there are multiple tickets with different dates

### Test Cases

#### 3.1 Page Loads Correctly
- [ ] Page title: "KPM Reports"
- [ ] Subtitle: "Key Performance Monitoring - Track ticket metrics and performance"
- [ ] Date range picker visible
- [ ] Export CSV button visible
- [ ] Summary metrics cards visible

#### 3.2 Summary Metrics Display
- [ ] Total Tickets card shows correct count
- [ ] Accepted card shows count of accepted tickets
- [ ] Completed card shows count of completed tickets
- [ ] Avg Resolution card shows average in hours

#### 3.3 Date Range Filtering
- [ ] Leave dates empty - should show all tickets
- [ ] Set start date only - should show tickets from that date onwards
- [ ] Set end date only - should show tickets up to that date
- [ ] Set both dates - should show tickets in range
- [ ] Metrics update when dates change

#### 3.4 Daily Metrics Table
- [ ] Table shows columns: Date, Total, Accepted, Completed, Avg Resolution
- [ ] Each row represents one day
- [ ] Rows sorted by date (oldest first)
- [ ] Numbers match summary metrics when no filter applied

#### 3.5 Export CSV Functionality
- [ ] Click "Export CSV" button
- [ ] File downloads as `kpm-report-YYYY-MM-DD.csv`
- [ ] CSV contains headers: Date, Total Tickets, Accepted, Completed, Avg Resolution Time (hrs)
- [ ] CSV data matches table data
- [ ] Numbers formatted correctly (2 decimal places for resolution time)

#### 3.6 Role-Based Access
- [ ] Admin can see all tickets in KPM reports
- [ ] Department staff can only see their assigned tickets
- [ ] Customer users cannot access KPM reports (should redirect)

#### 3.7 Empty State
- [ ] Set date range with no tickets
- [ ] Should show: "No data available for the selected date range"
- [ ] Summary metrics should show 0

---

## 📱 Phase 4: Enhanced TicketBoard Testing

### Test Cases

#### 4.1 Mobile Tab-Based View (< 1024px)
- [ ] Resize browser to mobile width (< 1024px)
- [ ] Tabs should appear: Available, My Tickets, Pending, In Progress, Completed
- [ ] Grid view should be hidden
- [ ] Clicking tabs switches between columns
- [ ] Active tab is highlighted

#### 4.2 Desktop Grid View (>= 1024px)
- [ ] Resize browser to desktop width (>= 1024px)
- [ ] Tab view should be hidden
- [ ] Grid with 5 columns should display
- [ ] All columns visible: Available, My Tickets, Pending, In Progress, Completed

#### 4.3 Virtual Scrolling & Pagination
- [ ] Create 50+ tickets in one status
- [ ] Column should show max 10 tickets per page
- [ ] "Previous" and "Next" buttons appear
- [ ] Pagination controls show: "Page X of Y"
- [ ] Clicking "Next" loads next 10 tickets
- [ ] Clicking "Previous" goes back
- [ ] First page: "Previous" disabled
- [ ] Last page: "Next" disabled

#### 4.4 Collapsible Columns
- [ ] Each column header has collapse/expand button (chevron)
- [ ] Clicking chevron collapses column (hides tickets)
- [ ] Column header still visible when collapsed
- [ ] Clicking again expands column
- [ ] Collapse state persists during session

#### 4.5 Column Header Information
- [ ] Each column shows:
  - Status indicator dot (colored, animated)
  - Column title
  - Ticket count badge
  - Collapse/expand button
- [ ] Colors correct: Green (Available), Blue (My Tickets), Purple (In Progress), Orange (Urgent), Green (Completed)

#### 4.6 Responsive Behavior
- [ ] Mobile (< 640px): Single column, full width
- [ ] Tablet (640px - 1024px): Tab view
- [ ] Desktop (> 1024px): 5-column grid
- [ ] All text readable at each breakpoint
- [ ] No horizontal scrolling needed

#### 4.7 Accept Button in Mobile View
- [ ] In mobile tab view, go to "Available" tab
- [ ] Each ticket should have "Accept" button
- [ ] Click accept button
- [ ] Button shows loading state
- [ ] After success, ticket disappears from Available
- [ ] Appears in "My Tickets" tab

#### 4.8 Performance with Large Datasets
- [ ] Create 100+ tickets
- [ ] Board should load without lag
- [ ] Scrolling should be smooth
- [ ] Pagination should work smoothly
- [ ] No console errors

---

## ✅ Comprehensive Checklist

### Permission System
- [ ] New permissions exist in system
- [ ] Admin role has all new permissions
- [ ] Department role has correct permissions
- [ ] User role has no new permissions
- [ ] Custom roles can be created with new permissions
- [ ] Permissions persist after save

### Notification System
- [ ] Notification center shows real Firebase data
- [ ] New available tickets trigger notifications
- [ ] Accept button works and auto-assigns tickets
- [ ] Notifications disappear after accept
- [ ] Multiple staff can accept different tickets
- [ ] Notifications marked as read after accept

### KPM Reports
- [ ] Page loads and displays correctly
- [ ] Summary metrics calculate correctly
- [ ] Date range filtering works
- [ ] Daily metrics table displays correctly
- [ ] CSV export works with correct format
- [ ] Role-based access control works
- [ ] Empty state displays correctly

### Enhanced TicketBoard
- [ ] Mobile tab view works on small screens
- [ ] Desktop grid view works on large screens
- [ ] Virtual scrolling/pagination works
- [ ] Collapsible columns work
- [ ] Column headers display correctly
- [ ] Responsive design works at all breakpoints
- [ ] Accept button works in mobile view
- [ ] Performance is good with large datasets

---

## 🐛 Common Issues & Solutions

### Issue: Notifications not appearing
**Solution**: 
- Check Firebase Firestore has notifications collection
- Verify user is logged in
- Check browser console for errors
- Refresh page

### Issue: KPM Reports showing no data
**Solution**:
- Verify tickets exist in Firestore
- Check date range is correct
- Verify user has `view_kpm_reports` permission
- Check ticket has `createdAt` field

### Issue: Mobile view not showing tabs
**Solution**:
- Check browser width is < 1024px
- Clear browser cache
- Check CSS is loaded correctly
- Verify Tailwind breakpoints

### Issue: Pagination not working
**Solution**:
- Verify tickets exist in column
- Check page count calculation
- Verify Next/Previous buttons are clickable
- Check console for JavaScript errors

---

## 📝 Notes

- All tests should be performed in both Chrome and Firefox
- Test on actual mobile devices if possible
- Check console for any warnings or errors
- Verify no performance issues with large datasets
- Test with different user roles and permissions

---

## 🎉 Success Criteria

All tests pass when:
- ✅ All permission tests pass
- ✅ All notification tests pass
- ✅ All KPM reports tests pass
- ✅ All enhanced ticket board tests pass
- ✅ No console errors
- ✅ No performance issues
- ✅ Responsive design works at all breakpoints

