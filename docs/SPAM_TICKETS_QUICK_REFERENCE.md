# Spam Tickets KPM Reports - Quick Reference Guide

## 🚀 Quick Start

### Access Spam Tickets Section
1. Go to `/admin/reports` (KPM Reports page)
2. Scroll down to "Spam Tickets Review" section
3. View all spam tickets in the table

**Note**: Only visible if you have "mark_tickets_as_spam" permission

---

## 📊 Spam Tickets Metrics Card

Located at the top of the spam section:
- **Total Spam Tickets**: Count of all spam tickets
- **Red/Warning Colors**: Indicates spam status
- **AlertTriangle Icon**: Visual indicator
- **Respects Date Filters**: Updates based on date range

---

## 📋 Spam Tickets Table Columns

| Column | Description | Format |
|--------|-------------|--------|
| **Ticket #** | Unique ticket identifier | yymmddnumber (e.g., 2501200001) |
| **Title** | Ticket subject | Text (truncated if long) |
| **Department** | Submitting department | Department name |
| **Priority** | Ticket priority level | HIGH (red), MEDIUM (yellow), LOW (blue) |
| **Created** | When ticket was created | Date + Time (HH:MM) |
| **Marked as Spam** | When marked as spam | Date + Time (HH:MM) |
| **Marked By** | Staff member who marked it | Email address |

---

## 🔍 Filtering & Sorting

### Date Range Filtering
- Use "Start Date" and "End Date" fields at top of page
- Filters spam tickets by **creation date**
- Leave blank to see all spam tickets
- Applies to both metrics and table

### Sorting
- **Automatic**: Sorted by "Marked as Spam" date (newest first)
- **Manual**: Click column headers to sort (if implemented)

---

## 🎨 Color Coding

### Priority Colors
- 🔴 **RED**: High priority tickets
- 🟡 **YELLOW**: Medium priority tickets
- 🔵 **BLUE**: Low priority tickets

### Section Colors
- 🔴 **Red/Warning**: Spam section (indicates caution)
- Consistent with spam status throughout app

---

## 📱 Responsive Design

### Desktop (1024px+)
- All columns visible
- Full table width
- Hover effects on rows

### Tablet (768px - 1023px)
- Horizontal scroll for overflow
- Optimized spacing
- Touch-friendly

### Mobile (< 768px)
- Horizontal scroll for table
- Truncated text with ellipsis
- Optimized for small screens

---

## 🔐 Permission Requirements

### Who Can See Spam Section?
- ✅ Users with "mark_tickets_as_spam" permission
- ✅ Admin users (by default)
- ✅ Custom roles with permission enabled

### Who Cannot See?
- ❌ Users without permission
- ❌ Department staff (unless custom role assigned)
- ❌ Customers

---

## 📈 Use Cases

### Case 1: Review Spam Tickets
1. Go to KPM Reports
2. Scroll to Spam Tickets section
3. Review all spam tickets
4. Check who marked them as spam

### Case 2: Analyze Spam Patterns
1. Set date range (e.g., last 30 days)
2. View spam metrics
3. Identify departments with most spam
4. Identify staff who marked most tickets

### Case 3: Audit Trail
1. Find specific spam ticket
2. Check "Marked By" column
3. Check "Marked as Spam" date
4. Verify action was appropriate

### Case 4: Export Report
1. Set desired date range
2. Click "Export CSV" button
3. Download metrics report
4. Share with management

---

## 🆘 Troubleshooting

### Spam Section Not Visible?

**Check 1: Permissions**
- Go to `/admin/roles`
- Verify your role has "mark_tickets_as_spam" permission
- If not, ask admin to enable it

**Check 2: Browser Cache**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cookies if needed

**Check 3: Login Status**
- Verify you're logged in as admin
- Try logging out and back in

### Spam Tickets Not Showing?

**Check 1: Tickets Exist**
- Go to Ticket Board
- Check if any tickets are marked as spam
- If none exist, create a test ticket and mark it

**Check 2: Date Range**
- Verify date range includes spam tickets
- Try clearing date filters
- Check ticket creation dates

**Check 3: Permissions**
- Verify you have "mark_tickets_as_spam" permission
- Check user role in `/admin/roles`

### Table Not Displaying Correctly?

**Check 1: Browser**
- Try different browser (Chrome, Firefox, Edge)
- Update browser to latest version

**Check 2: Screen Size**
- Resize browser window
- Check responsive design
- Try on different device

**Check 3: Data**
- Verify spam tickets have all required fields
- Check Firestore for data integrity

---

## 📞 Support

### For Permission Issues
- Contact system administrator
- Request "mark_tickets_as_spam" permission
- Verify role assignment

### For Data Issues
- Check Firestore database
- Verify ticket data integrity
- Contact technical support

### For UI Issues
- Clear browser cache
- Try different browser
- Check browser console for errors

---

## 🎯 Best Practices

1. **Regular Review**: Check spam tickets weekly
2. **Identify Patterns**: Look for spam trends
3. **Audit Trail**: Verify who marked tickets as spam
4. **Date Ranges**: Use filters to analyze specific periods
5. **Export Reports**: Keep records for compliance

---

## 📊 Metrics Explained

### Total Spam Tickets
- Count of all tickets with status "spam"
- Respects date range filters
- Updated in real-time

### Spam by Department
- Breakdown of spam tickets by department
- Helps identify problematic departments
- Useful for training/education

### Spam by Staff
- Count of spam tickets marked by each staff member
- Shows who's most active in spam management
- Useful for performance tracking

---

## 🔄 Workflow

```
1. Ticket Created
   ↓
2. Marked as Spam (by staff with permission)
   ↓
3. Appears in Spam Tickets Table
   ↓
4. Visible in KPM Reports
   ↓
5. Can be reviewed and analyzed
   ↓
6. Audit trail maintained
```

---

## 💡 Tips & Tricks

- **Tip 1**: Use date filters to analyze specific time periods
- **Tip 2**: Export CSV for external analysis
- **Tip 3**: Check "Marked By" to identify patterns
- **Tip 4**: Review regularly to catch spam trends
- **Tip 5**: Use metrics for staff performance reviews

---

## 📝 Notes

- Spam tickets are permanent (cannot be unmarked)
- Audit trail shows who marked as spam
- Date/time stamps are in local timezone
- Table is read-only (no editing from KPM page)
- To unmark spam, contact system administrator


