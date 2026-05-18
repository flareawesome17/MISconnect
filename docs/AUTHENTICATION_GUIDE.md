# Authentication System - Complete Guide

## ✅ What's Been Implemented

### 1. Login Page (`src/pages/Login.tsx`)
- Email and password input fields
- Error handling for Firebase auth errors
- Loading state during login
- Link to signup page
- Beautiful UI with gradient background
- Redirects to department dashboard on success

### 2. Signup Page (`src/pages/Signup.tsx`)
- Full name input
- Email input
- Department selection
- Password with confirmation
- Password strength validation (min 6 characters)
- Automatic user profile creation in Firestore
- Link to login page
- Beautiful UI with gradient background

### 3. Protected Routes (`src/components/ProtectedRoute.tsx`)
- Checks authentication state
- Shows loading spinner while checking
- Redirects to login if not authenticated
- Ready for role-based access control

### 4. Updated Navigation
- **DepartmentNav.tsx** - Shows user info and logout button
- **AdminNav.tsx** - Shows user info and logout button
- Both have logout functionality with confirmation

### 5. Updated Routes (`src/App.tsx`)
- `/login` - Login page
- `/signup` - Signup page
- `/department` - Protected department dashboard
- `/admin` - Protected admin dashboard
- `/admin/board` - Protected ticket board
- `/admin/ticket/:id` - Protected ticket detail

### 6. Updated Landing Page (`src/pages/Index.tsx`)
- Both portals now link to login page
- Users must authenticate before accessing portals

---

## 🚀 How to Use

### User Registration Flow
1. User visits home page
2. Clicks "Access Portal" or "Admin Login"
3. Redirected to login page
4. Clicks "Sign up here" link
5. Fills in signup form:
   - Full Name
   - Email
   - Department
   - Password (min 6 chars)
   - Confirm Password
6. Clicks "Create Account"
7. User profile created in Firestore
8. Redirected to department dashboard

### User Login Flow
1. User visits login page
2. Enters email and password
3. Clicks "Sign In"
4. Authenticated with Firebase
5. Redirected to department dashboard

### User Logout Flow
1. User clicks "Logout" button in navigation
2. Logged out from Firebase
3. Redirected to home page

---

## 📊 Authentication Flow Diagram

```
Home Page
    ↓
[Access Portal] or [Admin Login]
    ↓
Login Page
    ↓
[Sign up here] ← → [Sign In]
    ↓                  ↓
Signup Page      Firebase Auth
    ↓                  ↓
Create Profile   Check Credentials
    ↓                  ↓
Department Dashboard / Admin Dashboard
```

---

## 🔐 Security Features

### Password Validation
- Minimum 6 characters required
- Confirmation password check
- Firebase handles password hashing

### Error Handling
- User not found
- Wrong password
- Invalid email
- Weak password
- Email already in use
- Account disabled

### Protected Routes
- Automatic redirect to login if not authenticated
- Loading state while checking auth
- Session persistence across page refreshes

---

## 📝 Code Examples

### Accessing Current User
```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.displayName}</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Protected Route
```typescript
<Route
  path="/department"
  element={
    <ProtectedRoute>
      <DepartmentDashboard />
    </ProtectedRoute>
  }
/>
```

### Manual Authentication
```typescript
import { signUp, signIn, logout } from "@/services/authService";

// Sign up
const user = await signUp("user@example.com", "password123", "John Doe");

// Sign in
const user = await signIn("user@example.com", "password123");

// Logout
await logout();
```

---

## 🧪 Testing the Authentication

### Test Signup
1. Go to http://localhost:5173
2. Click "Access Portal"
3. Click "Sign up here"
4. Fill in form with:
   - Name: Test User
   - Email: test@example.com
   - Department: Engineering
   - Password: password123
   - Confirm: password123
5. Click "Create Account"
6. Should redirect to department dashboard

### Test Login
1. Go to http://localhost:5173/login
2. Enter credentials from signup
3. Click "Sign In"
4. Should redirect to department dashboard

### Test Logout
1. Click "Logout" button in navigation
2. Should redirect to home page
3. Try accessing /department directly
4. Should redirect to login page

### Test Protected Routes
1. Try accessing http://localhost:5173/department without logging in
2. Should redirect to login page
3. Login and try again
4. Should show department dashboard

---

## 🔧 Firebase Configuration

### Required Firestore Collections
The system automatically creates:
- `users/` - User profiles
- `tickets/` - Support tickets

### Firestore Security Rules
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

## 📋 Checklist

- [x] Login page created
- [x] Signup page created
- [x] Protected routes implemented
- [x] Navigation updated with logout
- [x] User info displayed in nav
- [x] Error handling implemented
- [x] Password validation
- [x] User profile creation
- [x] Session persistence
- [x] Build successful

---

## ⏳ Next Steps

1. **Configure Firebase Security Rules** - Set up proper Firestore rules
2. **Test Complete Flow** - Sign up, login, create tickets, logout
3. **Add Password Reset** - Implement forgot password functionality
4. **Add Email Verification** - Verify user emails
5. **Add Role-Based Access** - Implement admin vs department roles
6. **Add User Profile Page** - Allow users to edit their profile

---

## 🆘 Troubleshooting

### "Email already in use"
- Use a different email address
- Or reset the user in Firebase Console

### "Wrong password"
- Check caps lock
- Verify password is correct
- Use password reset if needed

### "User not found"
- Sign up first before logging in
- Check email spelling

### Stuck on loading screen
- Check browser console for errors
- Verify Firebase configuration
- Check internet connection

### Can't access protected routes
- Make sure you're logged in
- Check browser console for auth errors
- Try logging out and back in

---

## 📞 Support

For Firebase authentication docs:
https://firebase.google.com/docs/auth

For React Router protected routes:
https://reactrouter.com/en/main/start/overview

