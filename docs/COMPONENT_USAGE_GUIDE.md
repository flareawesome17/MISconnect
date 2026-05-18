# Component Usage Guide

Quick reference for using the new UI components.

## 🎨 Enhanced Components

### Button with Gradient
```tsx
import { Button } from "@/components/ui/button";

<Button variant="gradient">Click Me</Button>
```

### Status Badge with Icon
```tsx
import StatusBadge from "@/components/StatusBadge";

<StatusBadge status="pending" />
<StatusBadge status="in-progress" />
<StatusBadge status="completed" />
<StatusBadge status="urgent" />
```

### Card with Glassmorphism
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## 🆕 New Components

### Animated Counter
```tsx
import { AnimatedCounter } from "@/components/AnimatedCounter";

<AnimatedCounter 
  value={127} 
  duration={1000}
  prefix="Total: "
  suffix=" tickets"
/>
```

### Progress Indicator
```tsx
import { ProgressIndicator } from "@/components/ProgressIndicator";

<ProgressIndicator 
  value={75} 
  label="Project Completion"
  variant="success"
/>
```

### Stats Card
```tsx
import { StatsCard } from "@/components/StatsCard";
import { Ticket } from "lucide-react";

<StatsCard
  title="Total Tickets"
  value="127"
  icon={<Ticket className="h-8 w-8" />}
  trend={{ value: 12, direction: "up" }}
  description="From last month"
  variant="default"
/>
```

### Floating Action Button
```tsx
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Plus } from "lucide-react";

<FloatingActionButton
  icon={<Plus className="h-6 w-6" />}
  label="Add New"
  onClick={() => console.log("clicked")}
  variant="primary"
/>
```

### Card Skeleton
```tsx
import { CardSkeleton, StatCardSkeleton, TableSkeleton } from "@/components/CardSkeleton";

// For loading card grids
<CardSkeleton count={3} />

// For loading stat cards
<StatCardSkeleton count={6} />

// For loading tables
<TableSkeleton rows={5} />
```

### Page Transition
```tsx
import { PageTransition, PageContainer } from "@/components/PageTransition";

<PageTransition delay={100}>
  <div>Content with fade-in</div>
</PageTransition>

<PageContainer>
  <div>Content with slide-up</div>
</PageContainer>
```

### Command Palette
```tsx
import { CommandPalette } from "@/components/CommandPalette";

// Already integrated in AdminLayout header
// Press Cmd+K or Ctrl+K to open
<CommandPalette />
```

### Notification Center
```tsx
import { NotificationCenter } from "@/components/NotificationCenter";

// Already integrated in AdminLayout header
<NotificationCenter />
```

### Enhanced Chart
```tsx
import { EnhancedChart, ChartContainer } from "@/components/EnhancedChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<EnhancedChart title="Sales Trend" description="Monthly sales data">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#3b82f6" />
    </LineChart>
  </ResponsiveContainer>
</EnhancedChart>
```

### Enhanced Modal
```tsx
import { EnhancedModal } from "@/components/EnhancedModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MyModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <EnhancedModal
        open={open}
        onOpenChange={setOpen}
        title="Modal Title"
        description="Optional description"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button>Save</Button>
          </>
        }
      >
        <div>Modal content goes here</div>
      </EnhancedModal>
    </>
  );
}
```

## 🎯 Utility Classes

### Animations
```tsx
// Slide up with fade-in
<div className="animate-slideInUp">Content</div>

// Slide down with fade-in
<div className="animate-slideInDown">Content</div>

// Fade in
<div className="animate-fadeIn">Content</div>

// Scale and fade-in
<div className="animate-scaleIn">Content</div>

// Shimmer effect
<div className="animate-shimmer">Content</div>

// Pulse glow
<div className="animate-pulse-glow">Content</div>
```

### Glassmorphism
```tsx
// Full glassmorphism
<div className="glass">Content</div>

// Smaller glassmorphism
<div className="glass-sm">Content</div>
```

### Card Effects
```tsx
// Hover animation
<div className="card-hover">Content</div>

// Gradient background
<div className="card-gradient">Content</div>
```

### Button Effects
```tsx
// Gradient button
<div className="btn-gradient">Content</div>

// Secondary gradient
<div className="btn-gradient-secondary">Content</div>
```

## 🎨 Variants

### Progress Indicator Variants
- `default` - Blue gradient
- `success` - Green gradient
- `warning` - Yellow/Orange gradient
- `error` - Red gradient

### Stats Card Variants
- `default` - Primary gradient
- `success` - Green gradient
- `warning` - Yellow gradient
- `error` - Red gradient

### Floating Action Button Variants
- `primary` - Primary gradient
- `secondary` - Secondary color
- `accent` - Accent color

## ⌨️ Keyboard Shortcuts

### Command Palette
- **Mac**: `Cmd + K`
- **Windows/Linux**: `Ctrl + K`

## 🎯 Animation Delays

For staggered animations, use inline styles:
```tsx
<div 
  className="animate-slideInUp" 
  style={{ animationDelay: "100ms" }}
>
  Content
</div>
```

## 📱 Responsive Behavior

All components are fully responsive:
- Mobile: Single column layouts
- Tablet: 2-column layouts
- Desktop: 3-4 column layouts

## 🌙 Dark Mode

All components automatically support dark mode:
```tsx
// Dark mode is automatically applied based on system preference
// or can be controlled via next-themes
```

## 💡 Best Practices

1. **Use Skeleton Loaders**: Show skeletons while loading data
2. **Animate Transitions**: Use PageTransition for page changes
3. **Provide Feedback**: Use notifications for user actions
4. **Group Related Items**: Use Cards for grouping content
5. **Show Progress**: Use ProgressIndicator for long tasks
6. **Highlight Metrics**: Use StatsCard for important numbers

## 🔗 Component Dependencies

- All components use Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Recharts for charts

## 📚 Examples

See `src/components/UIShowcase.tsx` for a complete showcase of all components.

## 🆘 Troubleshooting

### Animations not showing
- Check if Tailwind CSS is properly configured
- Verify animation classes are imported from index.css

### Glassmorphism not visible
- Ensure backdrop-filter is supported in your browser
- Check if glass class is applied to parent element

### Command Palette not opening
- Verify CommandPalette is imported in AdminLayout
- Check browser console for errors

## 📖 Additional Resources

- `UI_UX_ENHANCEMENTS.md` - Detailed implementation guide
- `IMPLEMENTATION_COMPLETE.md` - Project completion summary
- Component source files - Inline documentation

