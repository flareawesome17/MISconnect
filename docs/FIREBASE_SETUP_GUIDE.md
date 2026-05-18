# Firebase Setup & Quick Start Guide

## ✅ What's Been Done

Your SupportConnect application is now connected to Firebase! Here's what was implemented:

### Core Services Created:
1. **Firebase Configuration** - `src/config/firebase.ts`
2. **Authentication Service** - `src/services/authService.ts`
3. **Ticket Service** - `src/services/ticketService.ts`
4. **User Service** - `src/services/userService.ts`
5. **Auth Context** - `src/context/AuthContext.tsx`

### Components Updated:
- ✅ App.tsx - Added AuthProvider wrapper
- ✅ RequestForm.tsx - Now saves tickets to Firebase
- ✅ Department Dashboard - Fetches real tickets from Firebase
- ✅ Admin Dashboard - Shows real-time statistics

### Build Status:
✅ **Build successful** - No TypeScript errors
✅ **All services integrated and working**

---

## 🚀 Next Steps

### Step 1: Create Login Page
Create `src/pages/Login.tsx`:
```typescript
import { useState } from "react";
import { signIn } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/department");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Step 2: Create Signup Page
Create `src/pages/Signup.tsx` with similar structure using `signUp()` function

### Step 3: Create Protected Route Component
Create `src/components/ProtectedRoute.tsx`:
```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
```

### Step 4: Update App.tsx Routes
```typescript
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route 
  path="/department" 
  element={
    <ProtectedRoute>
      <DepartmentDashboard />
    </ProtectedRoute>
  } 
/>
```

### Step 5: Configure Firebase Security Rules
In Firebase Console, set Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📝 Testing the Integration

### Test Creating a Ticket:
1. Login to the app
2. Go to Department Dashboard
3. Click "New Request"
4. Fill in the form and submit
5. Check Firebase Console → Firestore → tickets collection
6. You should see your ticket there!

### Test Fetching Tickets:
1. Go to Admin Dashboard
2. You should see real tickets and statistics
3. Statistics should update as you add more tickets

---

## 🔧 Available Functions

### Authentication
```typescript
import { signUp, signIn, logout, getCurrentUser, onAuthChange } from "@/services/authService";

// Sign up
await signUp("user@example.com", "password123", "John Doe");

// Sign in
await signIn("user@example.com", "password123");

// Get current user
const user = getCurrentUser();

// Listen to auth changes
const unsubscribe = onAuthChange((user) => {
  console.log("Auth state changed:", user);
});
```

### Tickets
```typescript
import { 
  createTicket, 
  getAllTickets, 
  getTicketsByDepartment,
  updateTicket,
  deleteTicket 
} from "@/services/ticketService";

// Create ticket
const ticketId = await createTicket({
  title: "Issue title",
  description: "Issue description",
  category: "network",
  priority: "high",
  status: "pending",
  department: "Engineering",
  submittedBy: "user@example.com"
});

// Get all tickets
const tickets = await getAllTickets();

// Get tickets by department
const deptTickets = await getTicketsByDepartment("Engineering");

// Update ticket
await updateTicket(ticketId, { status: "in-progress" });

// Delete ticket
await deleteTicket(ticketId);
```

### Users
```typescript
import { 
  createUserProfile, 
  getUserProfileByUid,
  updateUserProfile,
  isUserAdmin 
} from "@/services/userService";

// Create user profile
await createUserProfile({
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "John Doe",
  role: "department",
  department: "Engineering"
});

// Check if admin
const isAdmin = await isUserAdmin("firebase-uid");
```

### Using Auth Hook
```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.displayName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 📚 File Structure

```
src/
├── config/
│   └── firebase.ts              # Firebase initialization
├── services/
│   ├── authService.ts           # Authentication functions
│   ├── ticketService.ts         # Ticket CRUD operations
│   └── userService.ts           # User profile management
├── context/
│   └── AuthContext.tsx          # Global auth state
├── pages/
│   ├── Login.tsx                # (To be created)
│   ├── Signup.tsx               # (To be created)
│   ├── department/
│   │   └── Dashboard.tsx        # ✅ Updated with real data
│   └── admin/
│       └── Dashboard.tsx        # ✅ Updated with real data
└── components/
    ├── RequestForm.tsx          # ✅ Updated to save to Firebase
    └── ProtectedRoute.tsx       # (To be created)
```

---

## ⚠️ Important Notes

1. **Never commit Firebase config** - Add to `.gitignore` if needed
2. **Security Rules** - Configure properly before production
3. **Error Handling** - Add try-catch blocks in production
4. **Rate Limiting** - Consider implementing to prevent abuse
5. **Offline Support** - Firebase has offline persistence options

---

## 🆘 Troubleshooting

### "useAuth must be used within an AuthProvider"
- Make sure your component is wrapped with `<AuthProvider>` in App.tsx

### Tickets not saving
- Check Firebase Console for errors
- Verify Firestore security rules allow writes
- Check browser console for error messages

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed

---

## 📞 Support

For Firebase documentation, visit: https://firebase.google.com/docs
For React integration: https://firebase.google.com/docs/web/setup

