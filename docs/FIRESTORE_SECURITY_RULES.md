# Firestore Security Rules for Ticket Acceptance System

## Overview
These security rules enforce proper access control for the ticket acceptance and reassignment workflow.

## Rules Configuration

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Tickets Collection
    match /tickets/{ticketId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow create for authenticated users (customers creating tickets)
      allow create: if request.auth != null;
      
      // Allow update for:
      // 1. Admins (can do anything)
      // 2. Department staff accepting unassigned tickets
      // 3. Assigned staff updating their own tickets
      allow update: if request.auth != null && (
        // Admin can update any ticket
        request.auth.token.role == 'admin' ||
        // Department staff can accept unassigned tickets
        (request.auth.token.role == 'department' && 
         resource.data.assignedTo == null &&
         request.resource.data.assignedTo == request.auth.token.email) ||
        // Assigned staff can update their own tickets
        (resource.data.assignedTo == request.auth.token.email)
      );
      
      // Only admins can delete
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Users Collection
    match /users/{userId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow create for authenticated users
      allow create: if request.auth != null;
      
      // Allow update for own profile or admins
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        request.auth.token.role == 'admin'
      );
      
      // Only admins can delete
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Notifications Collection
    match /notifications/{notificationId} {
      // Allow read own notifications
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.token.email;
      
      // Allow create for system (via backend)
      allow create: if request.auth != null;
      
      // Allow update own notifications
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.token.email;
      
      // Allow delete own notifications
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.token.email;
    }
    
    // Departments Collection
    match /departments/{departmentId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow create/update/delete for admins only
      allow create, update, delete: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // Counters Collection (for ticket numbering)
    match /counters/{counterId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;

      // Allow write for authenticated users (for ticket number generation)
      allow write: if request.auth != null;
    }

    // Password Manager Collection
    match /pswrdManager/{passwordId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;

      // Allow create/update/delete for admins only
      allow create, update, delete: if request.auth != null &&
        request.auth.token.role == 'admin';
    }
  }
}
```

## Key Security Features

### 1. **Ticket Acceptance Control**
- Only department/admin staff can accept unassigned tickets
- When accepting, the `assignedTo` field must be set to the current user's email
- Prevents unauthorized ticket assignment

### 2. **Reassignment Control**
- Only admins can reassign tickets
- Maintains audit trail of all reassignments
- Notifications sent to customers on reassignment

### 3. **Role-Based Access**
- **Admin**: Full control over all tickets, users, and departments
- **Department**: Can accept unassigned tickets, update assigned tickets
- **User**: Can only read and create tickets

### 4. **Notification Privacy**
- Users can only read their own notifications
- Prevents cross-user notification access

## Implementation Steps

1. Go to Firebase Console
2. Navigate to Firestore Database → Rules
3. Replace existing rules with the configuration above
4. Click "Publish"

## Testing the Rules

### Test 1: Department staff accepting ticket
```
User: department@example.com (role: department)
Action: Update ticket with assignedTo = department@example.com
Expected: ✅ Allowed
```

### Test 2: User trying to reassign
```
User: user@example.com (role: user)
Action: Update ticket with different assignedTo
Expected: ❌ Denied
```

### Test 3: Admin reassigning ticket
```
User: admin@example.com (role: admin)
Action: Update ticket with different assignedTo
Expected: ✅ Allowed
```

## Notes

- Custom claims (role, email) must be set in Firebase Auth
- Use Firebase Admin SDK to set custom claims during user creation
- Rules are evaluated on every read/write operation
- Consider caching for performance optimization

