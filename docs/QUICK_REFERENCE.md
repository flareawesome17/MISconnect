# Firebase Integration - Quick Reference

## 📁 New Files Created

```
src/
├── config/
│   └── firebase.ts                    # Firebase initialization
├── services/
│   ├── authService.ts                 # Authentication functions
│   ├── ticketService.ts               # Ticket CRUD operations
│   └── userService.ts                 # User profile management
└── context/
    └── AuthContext.tsx                # Global auth state
```

## 🔧 Files Modified

```
src/
├── App.tsx                            # Added AuthProvider wrapper
├── components/
│   └── RequestForm.tsx                # Updated to save to Firebase
└── pages/
    ├── department/
    │   └── Dashboard.tsx              # Fetch real tickets
    └── admin/
        └── Dashboard.tsx              # Real-time statistics
```

## 📚 Documentation Files

```
├── FIREBASE_INTEGRATION.md            # Detailed integration guide
├── FIREBASE_SETUP_GUIDE.md            # Quick start with examples
├── IMPLEMENTATION_SUMMARY.md          # What was implemented
├── COMPLETION_CHECKLIST.md            # Progress tracking
└── QUICK_REFERENCE.md                 # This file
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (already done)
npm install firebase

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 💻 Key Code Snippets

### Using Auth Hook
```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Welcome, {user.displayName}</div>;
}
```

### Creating a Ticket
```typescript
import { createTicket } from "@/services/ticketService";

const ticketId = await createTicket({
  title: "Issue title",
  description: "Issue description",
  category: "network",
  priority: "high",
  status: "pending",
  department: "Engineering",
  submittedBy: "user@example.com"
});
```

### Fetching Tickets
```typescript
import { getAllTickets, getTicketsByDepartment } from "@/services/ticketService";

const allTickets = await getAllTickets();
const deptTickets = await getTicketsByDepartment("Engineering");
```

### User Authentication
```typescript
import { signUp, signIn, logout } from "@/services/authService";

// Sign up
await signUp("user@example.com", "password123", "John Doe");

// Sign in
await signIn("user@example.com", "password123");

// Logout
await logout();
```

---

## 📊 Database Schema

### Tickets Collection
```
tickets/
├── id: string (auto)
├── title: string
├── description: string
├── status: "pending" | "in-progress" | "completed" | "urgent"
├── priority: "low" | "medium" | "high"
├── department: string
├── category: string
├── submittedBy: string
├── assignedTo?: string
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── attachments?: string[]
```

### Users Collection
```
users/
├── id: string (auto)
├── uid: string (Firebase Auth UID)
├── email: string
├── displayName: string
├── role: "admin" | "department" | "user"
├── department?: string
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

## ✅ What's Working Now

- ✅ Firebase authentication ready
- ✅ Ticket creation and storage
- ✅ Real-time ticket fetching
- ✅ User profile management
- ✅ Department filtering
- ✅ Admin statistics
- ✅ Form submission to database
- ✅ Auth state management

---

## ⏳ What's Next

1. Create Login page (`src/pages/Login.tsx`)
2. Create Signup page (`src/pages/Signup.tsx`)
3. Create ProtectedRoute component
4. Update App.tsx routes
5. Configure Firebase security rules
6. Test complete authentication flow

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Firebase Integration](https://firebase.google.com/docs/web/setup#web-apps)

---

## 🆘 Common Issues & Solutions

### Issue: "useAuth must be used within an AuthProvider"
**Solution**: Make sure your component is inside the AuthProvider wrapper in App.tsx

### Issue: Tickets not saving
**Solution**: 
1. Check Firebase Console for errors
2. Verify Firestore security rules allow writes
3. Check browser console for error messages

### Issue: Build errors
**Solution**: 
1. Run `npm install` to ensure all dependencies
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run lint`

### Issue: Auth state not persisting
**Solution**: Firebase Auth automatically persists state. Check browser localStorage is enabled.

---

## 📞 Support Resources

- Firebase Console: https://console.firebase.google.com
- Firebase Emulator: For local testing
- Firebase CLI: For deployment
- React Firebase Hooks: For easier integration

---

## 🎯 Success Criteria

✅ Build successful with no errors
✅ All services properly typed
✅ Components updated with real data
✅ Firebase connected and working
✅ Ready for authentication UI

**Status**: ✅ **COMPLETE** - Ready for next phase!

