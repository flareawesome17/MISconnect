# Enhanced Notification System - Quick Start Guide

## 🚀 Getting Started

### For End Users (MIS Staff)

#### Step 1: Access Profile Settings
- **Admin Portal**: Click your profile icon → "Profile Settings"
- **Customer Portal**: Click your profile icon → "Profile Settings"

#### Step 2: Find Notification Preferences
Scroll down to the "Notification Preferences" section (with bell icon)

#### Step 3: Configure Your Preferences

**Toast Notifications**:
- Toggle "Toast Notifications" ON/OFF
- When ON: Popup appears in top-right corner when new tickets arrive
- Shows ticket number, title, and priority

**Audio Alerts**:
- Toggle "Audio Alerts" ON/OFF
- When ON: Sound plays when new tickets arrive
- Different sounds for different priorities

**Volume Control**:
- Drag slider to adjust volume (0 = silent, 1 = loud)
- Default: 0.5 (medium)

**Priority Levels**:
- Choose which priorities trigger notifications
- Low: 1 beep at 400Hz
- Medium: 2 beeps at 600Hz
- High: 3 beeps at 800Hz
- Urgent: 4 beeps at 1000Hz

**Test Sound**:
- Click "Test Sound" button to preview audio
- Useful for checking volume before saving

#### Step 4: Preferences Auto-Save
- All changes save automatically
- Preferences persist across sessions
- Works on desktop, tablet, and mobile

---

## 🎵 Audio Alert Sounds

### Priority Levels

| Priority | Beeps | Frequency | Duration | Use Case |
|----------|-------|-----------|----------|----------|
| Low | 1 | 400Hz | 150ms | Non-urgent requests |
| Medium | 2 | 600Hz | 300ms | Standard tickets |
| High | 3 | 800Hz | 450ms | Important issues |
| Urgent | 4 | 1000Hz | 600ms | Critical problems |

### Sound Characteristics
- **Type**: Sine wave (smooth, professional)
- **Total Duration**: 1-2 seconds (including pauses)
- **Volume**: Adjustable 0-1 scale
- **Fade**: Exponential fade-out for smooth ending

---

## 🔔 Toast Notification Examples

### Low Priority
```
┌─────────────────────────────────────┐
│ New Ticket Available                │
│ #2501200001: Password Reset Request │
│ Priority: LOW                       │
└─────────────────────────────────────┘
```

### Medium Priority
```
┌─────────────────────────────────────┐
│ New Ticket Available                │
│ #2501200002: Email Configuration    │
│ Priority: MEDIUM                    │
└─────────────────────────────────────┘
```

### High Priority
```
┌─────────────────────────────────────┐
│ New Ticket Available                │
│ #2501200003: System Down            │
│ Priority: HIGH                      │
└─────────────────────────────────────┘
```

---

## 💡 Tips & Tricks

### Tip 1: Customize by Priority
- Disable notifications for low-priority tickets
- Only get alerts for high/urgent tickets
- Reduces notification fatigue

### Tip 2: Adjust Volume
- Set lower volume for quiet environments
- Set higher volume for noisy areas
- Use test sound to find perfect level

### Tip 3: Work Hours
- Enable audio during work hours
- Disable audio during breaks
- Preferences saved automatically

### Tip 4: Multiple Devices
- Each device has separate preferences
- Customize per device based on environment
- Preferences sync across logins

### Tip 5: Browser Compatibility
- Works on Chrome, Firefox, Edge, Safari
- Graceful fallback if audio not supported
- Toast notifications always work

---

## ⚙️ Technical Details

### Browser Support
- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Edge (all versions)
- ✅ Safari (iOS 14.5+, macOS 11+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Audio API
- Uses Web Audio API (W3C standard)
- Fallback to HTML5 Audio if needed
- Graceful degradation if not supported

### Data Storage
- Preferences stored in Firestore
- Per-user storage (userId-based)
- Encrypted at rest
- Synced across devices

### Performance
- Minimal CPU usage
- No background processes
- Only triggers on new notifications
- Efficient Firestore queries

---

## 🆘 Troubleshooting

### Issue: No Sound Playing

**Solution 1: Check Audio Enabled**
- Go to Profile Settings
- Verify "Audio Alerts" toggle is ON
- Click "Test Sound" button

**Solution 2: Check Volume**
- Adjust volume slider to higher value
- Click "Test Sound" again
- Verify system volume is not muted

**Solution 3: Check Browser**
- Try different browser
- Check browser audio permissions
- Ensure audio not blocked by browser

**Solution 4: Check Priorities**
- Verify priority level is enabled
- For example, if "Low" is disabled, low-priority tickets won't alert
- Enable desired priority levels

### Issue: Toast Not Appearing

**Solution 1: Check Toast Enabled**
- Go to Profile Settings
- Verify "Toast Notifications" toggle is ON

**Solution 2: Check Ticket Type**
- Toast only shows for available tickets
- Spam tickets don't show toast
- Assigned tickets don't show toast

**Solution 3: Refresh Page**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Try again

### Issue: Preferences Not Saving

**Solution 1: Check Internet**
- Verify internet connection
- Try again after reconnecting

**Solution 2: Check Firestore**
- Verify Firebase is accessible
- Check browser console for errors
- Try in different browser

**Solution 3: Clear Cache**
- Clear browser cache
- Clear cookies
- Log out and log back in

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Try different browser
4. Contact system administrator

---

## 🎯 Best Practices

1. **Test First**: Click "Test Sound" before relying on audio
2. **Adjust Volume**: Find comfortable volume level
3. **Customize Priorities**: Disable low-priority alerts if needed
4. **Check Regularly**: Review preferences monthly
5. **Keep Updated**: Ensure browser is up to date

---

## 📊 Feature Comparison

| Feature | Toast | Audio | Preference |
|---------|-------|-------|-----------|
| Visual Alert | ✅ | ❌ | ✅ |
| Audio Alert | ❌ | ✅ | ✅ |
| Customizable | ✅ | ✅ | ✅ |
| Works Offline | ❌ | ❌ | ✅ |
| Mobile Support | ✅ | ✅ | ✅ |
| Persistent | ✅ | ✅ | ✅ |

---

## 🎉 You're All Set!

Your notification system is ready to use. Start receiving alerts for new tickets and never miss an important request again!

**Happy ticket accepting!** 🚀


