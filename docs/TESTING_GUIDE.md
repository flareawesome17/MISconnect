# 🧪 Testing Guide - SupportConnect Dashboard

## Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`

---

## 🔐 Authentication Testing

### Login
1. Use your admin Firebase credentials
2. Email: `admin@example.com`
3. Password: `password123`

### Expected Behavior:
- ✅ Login page shows "Contact your administrator" instead of signup link
- ✅ Redirects to dashboard after successful login
- ✅ User info appears in sidebar

---

## 📊 Dashboard Testing

### General Dashboard (`/dashboard`)
1. **Metric Cards**: Should display 5 cards with ticket counts
   - Total Tickets
   - Open Tickets
   - In Progress
   - Completed
   - Urgent

2. **Charts**: Should show 3 visualizations
   - Pie chart: Status distribution
   - Line chart: Weekly trends
   - Bar chart: Department performance

3. **Recent Activity**: Shows latest tickets

4. **Animations**: Cards should slide in with stagger effect

---

## 👥 User Management Testing

### Access User Management
1. Click "Users" in sidebar (admin only)
2. Should navigate to `/users`

### Create User
1. Click "Add User" button
2. Fill form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Department: Select from dropdown
   - Role: Select (User/Department Manager/Admin)
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create User"
4. ✅ Toast notification: "User created successfully"
5. User appears in table

### Edit User
1. Click edit icon on user row
2. Update fields (email is read-only)
3. Click "Update User"
4. ✅ Changes reflected in table

### Delete User
1. Click delete icon on user row
2. Confirm deletion
3. ✅ User removed from table

---

## 🏢 Department Management Testing

### Access Department Management
1. Click "Departments" in sidebar (admin only)
2. Should navigate to `/departments`

### Create Department
1. Click "Add Department" button
2. Fill form:
   - Department Name: `Engineering`
   - Description: `Software development team`
   - Manager: `John Smith`
3. Click "Create Department"
4. ✅ Toast notification: "Department created successfully"
5. Department appears in table

### Edit Department
1. Click edit icon on department row
2. Update fields including status
3. Click "Update Department"
4. ✅ Changes reflected in table

### Delete Department
1. Click delete icon on department row
2. Confirm deletion
3. ✅ Department removed from table

---

## 🎫 Tickets Testing

### Access Tickets
1. Click "Tickets" in sidebar
2. Should navigate to `/tickets`

### View Tickets
1. ✅ Tickets display in grid layout
2. ✅ Search functionality works
3. ✅ Status filter works

### Create Ticket
1. Click "Create Ticket" button
2. Fill form and submit
3. ✅ Ticket appears in list

---

## 🎨 UI/UX Testing

### Sidebar
- [ ] Sidebar collapses/expands smoothly
- [ ] Mobile hamburger menu works
- [ ] Navigation items highlight on active route
- [ ] User profile section shows at bottom
- [ ] Logout button works

### Animations
- [ ] Dashboard cards slide in with stagger
- [ ] Ticket cards have hover lift effect
- [ ] Sidebar slides in on mobile
- [ ] Smooth transitions between pages

### Responsive Design
- [ ] Desktop: Full sidebar visible
- [ ] Tablet: Sidebar collapses to icons
- [ ] Mobile: Hamburger menu appears
- [ ] All tables scroll horizontally on small screens

### Dark Mode
- [ ] Toggle dark mode (if implemented)
- [ ] Colors adjust properly
- [ ] Text remains readable

---

## 🔍 Search & Filter Testing

### User Management Search
1. Type in search box
2. ✅ Filters by name, email, or department

### Department Management Search
1. Type in search box
2. ✅ Filters by name or description

### Tickets Search
1. Type in search box
2. ✅ Filters by title or description

---

## ⚠️ Error Handling Testing

### Invalid Form Submission
1. Try submitting empty forms
2. ✅ Validation errors appear

### Duplicate Email
1. Try creating user with existing email
2. ✅ Error toast: "Email already in use"

### Network Errors
1. Disconnect internet
2. ✅ Error toast appears
3. ✅ App handles gracefully

---

## 📱 Mobile Testing

### Sidebar on Mobile
- [ ] Hamburger menu visible
- [ ] Sidebar slides in from left
- [ ] Overlay closes sidebar when clicked
- [ ] Navigation works on mobile

### Tables on Mobile
- [ ] Tables scroll horizontally
- [ ] Action buttons visible
- [ ] Search works on mobile

### Forms on Mobile
- [ ] All fields visible
- [ ] Keyboard doesn't hide submit button
- [ ] Modals are full-width

---

## ✅ Checklist

- [ ] Build completes without errors
- [ ] Dev server starts successfully
- [ ] Login page works
- [ ] Dashboard displays correctly
- [ ] User management CRUD works
- [ ] Department management CRUD works
- [ ] Sidebar navigation works
- [ ] Animations are smooth
- [ ] Responsive design works
- [ ] Dark mode works (if enabled)
- [ ] Search/filter works
- [ ] Error handling works
- [ ] Mobile layout works

---

## 🐛 Common Issues & Solutions

### Issue: Build fails
**Solution**: Run `npm install` and `npm run build`

### Issue: Sidebar not showing
**Solution**: Check MainLayout is wrapping routes in App.tsx

### Issue: Modals not opening
**Solution**: Verify Dialog component is imported from shadcn-ui

### Issue: Animations not working
**Solution**: Check index.css has animation definitions

### Issue: Dark mode not working
**Solution**: Verify next-themes provider is in App.tsx

---

**Status**: Ready for comprehensive testing! 🚀

