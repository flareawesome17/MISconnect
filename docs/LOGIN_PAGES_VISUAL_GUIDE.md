# 📐 Login Pages - Visual Layout Guide

## Desktop Layout (1024px+)

### Staff Portal (AdminLogin)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   Plant Image        │  │   Staff Portal Form      │   │
│  │   with Gradient      │  │                          │   │
│  │   Overlay            │  │   [Lock Icon]            │   │
│  │                      │  │   Staff Portal           │   │
│  │   "Welcome Back"     │  │   Sign in to access...   │   │
│  │   "Access your       │  │                          │   │
│  │    staff dashboard"  │  │   [Email Input]          │   │
│  │                      │  │   [Password Input]       │   │
│  │                      │  │   [Sign In Button]       │   │
│  │                      │  │                          │   │
│  │                      │  │   [Footer Links]         │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Colors: Dark Blue/Slate Theme
- Background: Gradient from slate-900 to slate-800
- Form: slate-800 with slate-700 borders
- Accent: Blue (from-blue-600 to-blue-700)
- Text: White on dark background
```

### Customer Login (CustomerLogin)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   Plant Image        │  │   Customer Login Form    │   │
│  │   with Gradient      │  │                          │   │
│  │   Overlay            │  │   [LogIn Icon]           │   │
│  │                      │  │   Welcome Back           │   │
│  │   "Welcome Back"     │  │   Sign in to your...     │   │
│  │   "Sign in to track  │  │                          │   │
│  │    your support      │  │   [Email Input]          │   │
│  │    tickets"          │  │   [Password Input]       │   │
│  │                      │  │   [Sign In Button]       │   │
│  │                      │  │                          │   │
│  │                      │  │   [Sign Up Link]         │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Colors: Light Emerald/Teal Theme
- Background: Gradient from emerald-50 to teal-100
- Form: White with light borders
- Accent: Emerald/Teal (from-emerald-600 to-teal-600)
- Text: Dark on light background
```

### Customer Signup (CustomerSignup)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   Plant Image        │  │   Signup Form            │   │
│  │   with Gradient      │  │                          │   │
│  │   Overlay            │  │   [UserPlus Icon]        │   │
│  │                      │  │   Create Account         │   │
│  │   "Get Started"      │  │   Join us to submit...   │   │
│  │   "Create an account │  │                          │   │
│  │    to submit and     │  │   [Full Name Input]      │   │
│  │    track your        │  │   [Email Input]          │   │
│  │    support tickets"  │  │   [Department Select]    │   │
│  │                      │  │   [Password Input]       │   │
│  │                      │  │   [Confirm Password]     │   │
│  │                      │  │   [Create Account Btn]   │   │
│  │                      │  │   [Sign In Link]         │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Colors: Light Teal/Cyan Theme
- Background: Gradient from teal-50 to cyan-100
- Form: White with light borders
- Accent: Teal/Cyan (from-teal-600 to-cyan-600)
- Text: Dark on light background
```

---

## Mobile Layout (< 768px)

### All Pages (Stacked)
```
┌──────────────────────┐
│                      │
│   [Icon]             │
│   Portal Title       │
│   Subtitle           │
│                      │
│   [Email Input]      │
│   [Password Input]   │
│   [Additional Fields]│
│   [Submit Button]    │
│                      │
│   [Footer Links]     │
│                      │
└──────────────────────┘

- Single column layout
- Full width form
- Image hidden
- Optimized for touch
- Proper spacing
```

---

## Tablet Layout (768px - 1024px)

### All Pages (Stacked)
```
┌────────────────────────────────┐
│                                │
│   [Icon]                       │
│   Portal Title                 │
│   Subtitle                     │
│                                │
│   [Email Input]                │
│   [Password Input]             │
│   [Additional Fields]          │
│   [Submit Button]              │
│                                │
│   [Footer Links]               │
│                                │
└────────────────────────────────┘

- Single column layout
- Full width form
- Image hidden
- Increased spacing
- Larger touch targets
```

---

## Color Palette

### Staff Portal (AdminLogin)
```
Primary:     #1e293b (slate-900)
Secondary:   #1e293b (slate-800)
Accent:      #2563eb (blue-600)
Text:        #ffffff (white)
Muted:       #94a3b8 (slate-400)
```

### Customer Login (CustomerLogin)
```
Primary:     #f0fdf4 (emerald-50)
Secondary:   #d1fae5 (emerald-100)
Accent:      #059669 (emerald-600)
Text:        #1f2937 (gray-900)
Muted:       #6b7280 (gray-500)
```

### Customer Signup (CustomerSignup)
```
Primary:     #f0fdfa (teal-50)
Secondary:   #ccfbf1 (cyan-100)
Accent:      #0d9488 (teal-600)
Text:        #1f2937 (gray-900)
Muted:       #6b7280 (gray-500)
```

---

## Image Specifications

### Plant Image (cccplant.png)
- **Location:** `/public/cccplant.png`
- **Display:** `object-cover`
- **Height:** `h-96` (384px)
- **Border Radius:** `rounded-2xl`
- **Shadow:** `shadow-2xl`
- **Overlay:** Gradient from transparent to dark
- **Responsive:** Hidden on mobile/tablet

---

## Typography

### Headings
- **Size:** `text-3xl`
- **Weight:** `font-bold`
- **Alignment:** `text-center`
- **Color:** Theme-specific

### Subheadings
- **Size:** `text-sm`
- **Color:** Muted
- **Alignment:** `text-center`
- **Margin:** `mb-8`

### Labels
- **Size:** `text-sm`
- **Weight:** `font-semibold`
- **Color:** Theme-specific

### Helper Text
- **Size:** `text-xs`
- **Color:** Muted
- **Margin:** `mt-1`

---

## Spacing

### Container
- **Padding:** `p-8`
- **Gap:** `gap-8` (between columns)

### Form Elements
- **Spacing:** `space-y-4` to `space-y-6`
- **Input Height:** `h-10`
- **Button Height:** `h-10`

### Mobile
- **Padding:** `px-4 py-8`
- **Spacing:** `space-y-4`

---

## Responsive Breakpoints

```
Mobile:  < 768px   (Single column, image hidden)
Tablet:  768-1024px (Single column, image hidden)
Desktop: ≥ 1024px  (Two columns, image visible)
```

---

## Accessibility

- ✅ Proper contrast ratios
- ✅ Clear labels for inputs
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Focus indicators
- ✅ Error messages
- ✅ Loading states

---

## Performance

- ✅ Optimized image loading
- ✅ Efficient CSS grid
- ✅ Minimal JavaScript
- ✅ Fast rendering
- ✅ Mobile optimized

**Status:** Production Ready ✅

