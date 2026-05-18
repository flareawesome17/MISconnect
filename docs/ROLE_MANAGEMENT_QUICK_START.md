# Role Management - Quick Start Guide

## 🚀 Getting Started

### Access Role Management
1. Login as Admin
2. Go to **Admin Portal → Roles** (or use Command Palette: Cmd+K → "Roles")

## 📋 Quick Tasks

### Create a Custom Role

**Steps:**
1. Click **"Create Role"** button
2. Enter role name (e.g., "Support Manager")
3. Enter description (optional)
4. Check permissions you want to grant
5. Click **"Save Role"**

**Example: Support Manager Role**
```
Name: Support Manager
Description: Manages support tickets and can reassign them
Permissions:
  ✓ view_tickets
  ✓ create_tickets
  ✓ edit_tickets
  ✓ accept_tickets
  ✓ reassign_tickets
  ✓ view_reports
```

### Assign Role to User

**Using System Role (Default):**
1. Go to **Users** page
2. Create or edit a user
3. Select role: "Admin", "Department Manager", or "Customer"
4. Save

**Using Custom Permissions:**
1. Go to **Users** page
2. Create or edit a user
3. Select a base role
4. Check **"Use custom permissions instead of role defaults"**
5. Select specific permissions
6. Save

### Edit a Role

1. Go to **Roles** page
2. Find the role you want to edit
3. Click **Edit** button (pencil icon)
4. Modify permissions
5. Click **"Save Role"**

### Delete a Role

1. Go to **Roles** page
2. Find the role you want to delete
3. Click **Delete** button (trash icon)
4. Confirm deletion

**Note:** System roles (Admin, Department Manager, Customer) cannot be deleted

### View Role Details

1. Go to **Roles** page
2. Click **Expand** button (chevron icon) on any role
3. See all permissions for that role

## 🔑 Permission Categories

### Tickets (6 permissions)
- View, Create, Edit, Delete tickets
- Accept and Reassign tickets

### Users (4 permissions)
- View, Create, Edit, Delete users

### Departments (4 permissions)
- View, Create, Edit, Delete departments

### Reports (2 permissions)
- View and Export reports

### Administration (3 permissions)
- Manage roles, View/Edit settings

## 💡 Common Role Templates

### Support Agent
```
Permissions:
- view_tickets
- create_tickets
- edit_tickets
- accept_tickets
- view_reports
```

### Support Manager
```
Permissions:
- view_tickets
- create_tickets
- edit_tickets
- delete_tickets
- accept_tickets
- reassign_tickets
- view_reports
- export_reports
```

### User Administrator
```
Permissions:
- view_users
- create_users
- edit_users
- delete_users
- view_departments
- create_departments
- edit_departments
- delete_departments
```

### Report Analyst
```
Permissions:
- view_tickets
- view_reports
- export_reports
```

### Full Admin
```
All permissions (same as Admin system role)
```

## 🔍 Search & Filter

- Use the search box to find roles by name or description
- Roles are filtered in real-time as you type

## ⚙️ System Roles (Cannot be Modified)

### Admin
- Full system access
- All 19 permissions

### Department Manager
- Can manage tickets
- Can view reports
- 5 permissions

### Customer
- Can create and view tickets
- 2 permissions

## 📊 Permission Matrix

| Permission | Admin | Dept Mgr | Customer | Custom |
|-----------|-------|----------|----------|--------|
| view_tickets | ✓ | ✓ | ✓ | ✓ |
| create_tickets | ✓ | ✓ | ✓ | ✓ |
| edit_tickets | ✓ | ✓ | ✗ | ✓ |
| delete_tickets | ✓ | ✗ | ✗ | ✓ |
| accept_tickets | ✓ | ✓ | ✗ | ✓ |
| reassign_tickets | ✓ | ✗ | ✗ | ✓ |
| view_users | ✓ | ✗ | ✗ | ✓ |
| create_users | ✓ | ✗ | ✗ | ✓ |
| edit_users | ✓ | ✗ | ✗ | ✓ |
| delete_users | ✓ | ✗ | ✗ | ✓ |
| view_departments | ✓ | ✗ | ✗ | ✓ |
| create_departments | ✓ | ✗ | ✗ | ✓ |
| edit_departments | ✓ | ✗ | ✗ | ✓ |
| delete_departments | ✓ | ✗ | ✗ | ✓ |
| view_reports | ✓ | ✓ | ✗ | ✓ |
| export_reports | ✓ | ✗ | ✗ | ✓ |
| manage_roles | ✓ | ✗ | ✗ | ✓ |
| view_settings | ✓ | ✗ | ✗ | ✓ |
| edit_settings | ✓ | ✗ | ✗ | ✓ |

## 🎯 Best Practices

1. **Principle of Least Privilege**
   - Only grant permissions users actually need
   - Start with minimal permissions and add as needed

2. **Use Descriptive Names**
   - Use clear role names: "Support Manager" not "SM"
   - Add descriptions explaining the role's purpose

3. **Organize by Function**
   - Create roles based on job functions
   - Example: Support Agent, Manager, Analyst

4. **Regular Review**
   - Periodically review roles and permissions
   - Remove unused roles
   - Update permissions as needs change

5. **Document Custom Roles**
   - Use descriptions to document why each role exists
   - List the team members who have each role

## ❓ FAQ

**Q: Can I modify system roles?**
A: No, system roles (Admin, Department Manager, Customer) are protected and cannot be modified or deleted.

**Q: Can a user have multiple roles?**
A: Currently, each user has one primary role. You can customize permissions for individual users.

**Q: What happens if I delete a role?**
A: Users assigned to that role will keep their current permissions but won't be able to be assigned that role again.

**Q: Can I export roles?**
A: Not yet, but this feature can be added in the future.

**Q: How many custom roles can I create?**
A: Unlimited! Create as many as you need.

## 📞 Support

For issues or questions:
1. Check the Role Management System documentation
2. Review permission definitions
3. Test with a test user first

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0

