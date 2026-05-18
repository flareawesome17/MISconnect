# 📧 Email Verification Testing Guide

## Quick Start

### Test Scenario 1: Admin Login with Unverified Email

**Steps:**
1. Go to `/admin-login`
2. Enter credentials for a staff account with unverified email
3. Click "Sign In"

**Expected Result:**
- ❌ Login blocked
- ✅ Message: "Email not verified. Please check your inbox for a verification link."
- ✅ Shows "Email Verification Required" screen
- ✅ "Resend Verification Email" button visible
- ✅ "Back to Login" button visible

---

### Test Scenario 2: Resend Verification Email

**Steps:**
1. From unverified email screen (Scenario 1)
2. Click "Resend Verification Email"
3. Check email inbox

**Expected Result:**
- ✅ Toast message: "Verification email sent! Please check your inbox."
- ✅ New verification email received
- ✅ Button shows "Sending..." during request
- ✅ Button re-enables after completion

---

### Test Scenario 3: Customer Signup

**Steps:**
1. Go to `/customer-signup`
2. Fill in all fields (name, email, department, password)
3. Click "Create Account"

**Expected Result:**
- ✅ Account created successfully
- ✅ Toast message: "Account created successfully! Please check your email to verify your account."
- ✅ Redirects to `/customer-login` (NOT dashboard)
- ✅ Verification email sent to signup email address

---

### Test Scenario 4: Customer Login with Unverified Email

**Steps:**
1. Go to `/customer-login`
2. Enter credentials from newly created account (Scenario 3)
3. Click "Sign In"

**Expected Result:**
- ❌ Login blocked
- ✅ Message: "Email not verified. Please check your inbox for a verification link."
- ✅ Shows "Email Verification Required" screen
- ✅ Can resend verification email

---

### Test Scenario 5: Verify Email and Login

**Steps:**
1. Check email inbox for verification link
2. Click verification link in email
3. Return to `/customer-login`
4. Enter credentials
5. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Toast message: "Login successful!"
- ✅ Redirects to `/customer` dashboard
- ✅ User can access all customer features

---

### Test Scenario 6: Admin Creating Staff Account

**Steps:**
1. Log in as admin to `/admin-login`
2. Go to `/admin/users`
3. Click "Create User"
4. Fill in staff details (email, password, role, department)
5. Click "Create"

**Expected Result:**
- ✅ User created successfully
- ✅ Admin stays logged in
- ✅ Verification email sent to new staff email
- ✅ New staff receives verification email

---

### Test Scenario 7: New Staff Verifies and Logs In

**Steps:**
1. Check email for verification link (from Scenario 6)
2. Click verification link
3. Go to `/admin-login`
4. Enter new staff credentials
5. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirects to `/admin` dashboard
- ✅ Staff can access admin features

---

## 🔍 Verification Checklist

### Email Verification:
- [ ] Verification emails are sent to correct addresses
- [ ] Verification links work correctly
- [ ] Clicking link marks email as verified in Firebase
- [ ] Verification link expires after reasonable time

### UI/UX:
- [ ] Error messages are clear and helpful
- [ ] Loading states show during email send
- [ ] Buttons are properly disabled during requests
- [ ] Mobile responsive design works
- [ ] All colors and styling consistent

### Security:
- [ ] Unverified users cannot access dashboards
- [ ] Verified users can access dashboards
- [ ] Email verification required for all portals
- [ ] No way to bypass verification

### Error Handling:
- [ ] Network errors handled gracefully
- [ ] Firebase errors display user-friendly messages
- [ ] Resend button works multiple times
- [ ] Back button returns to login form

---

## 🐛 Troubleshooting

### Issue: Verification email not received
**Solution:**
1. Check spam/junk folder
2. Click "Resend Verification Email" button
3. Wait a few minutes
4. Check Firebase Console for email logs

### Issue: Verification link doesn't work
**Solution:**
1. Copy link and paste in new browser tab
2. Check if link is expired (usually 24 hours)
3. Request new verification email
4. Check Firebase Console for errors

### Issue: Can't log in after verifying email
**Solution:**
1. Refresh page
2. Clear browser cache
3. Try incognito/private window
4. Check Firebase Console for auth errors

### Issue: Admin stays logged out after creating user
**Solution:**
1. This is expected behavior - admin should stay logged in
2. If admin logged out, check browser console for errors
3. Verify Firebase session persistence is enabled

---

## 📊 Firebase Console Checks

1. **Authentication → Users**
   - Verify user email verified status
   - Check email verification timestamp

2. **Firestore → users collection**
   - Verify user profile created
   - Check role and department assigned

3. **Logs**
   - Check for email sending errors
   - Monitor authentication events

---

## ✅ Sign-Off Checklist

- [ ] All test scenarios pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build successful
- [ ] Mobile responsive
- [ ] Email verification working
- [ ] All redirects correct
- [ ] Error messages helpful
- [ ] Performance acceptable
- [ ] Ready for production

