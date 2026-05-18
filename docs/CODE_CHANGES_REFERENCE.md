# Code Changes Reference

## Files Modified Summary

### 1. NEW FILE: `src/hooks/useTickets.ts`
**Purpose**: Real-time ticket fetching hook with filtering

**Key Functions**:
- `useTickets(options)` - Main hook for fetching tickets
- `useTicketsByStatus(options)` - Helper for Kanban grouping

**Features**:
- Real-time Firestore listeners
- Filtering: all, user, department
- Loading and error states
- Automatic cleanup

---

### 2. UPDATED: `src/services/ticketService.ts`
**Changes**: Added real-time listener function

**New Function**:
```typescript
export const onSnapshotTickets = (
  constraints: Array<{ field: string; operator: string; value: any }> = [],
  callback: (tickets: Ticket[]) => void
): (() => void) => {
  // Real-time listener implementation
  // Returns unsubscribe function
}
```

**Imports Added**:
- `onSnapshot` from firebase/firestore
- `QueryConstraint` from firebase/firestore

---

### 3. UPDATED: `src/pages/department/Dashboard.tsx`
**Changes**: Replaced mock data with real Firebase data

**Before**:
```typescript
const mockTickets = [
  { id: "1", title: "...", ... },
  { id: "2", title: "...", ... },
];
```

**After**:
```typescript
const { tickets, loading, error } = useTickets({ filter: "user" });
```

**Added**:
- Import `useTickets` hook
- Import `CardSkeleton` component
- Loading state with skeleton
- Error display
- Empty state message
- Responsive button: `w-full sm:w-auto`

**Layout**: Responsive grid (1 col → 2 cols → 3 cols)

---

### 4. UPDATED: `src/pages/admin/TicketBoard.tsx`
**Changes**: Replaced mock data with real Firebase data

**Before**:
```typescript
const mockTicketsByStatus = {
  pending: [...],
  "in-progress": [...],
  urgent: [...],
  completed: [...]
};
```

**After**:
```typescript
const { groupedTickets, loading, error } = useTicketsByStatus({ 
  filter: "all" 
});
```

**Added**:
- Import `useTicketsByStatus` hook
- Loading state with Kanban skeleton
- Error display
- Real-time status grouping

**Layout**: Responsive Kanban (1 col → 2 cols → 4 cols)

---

## Key Implementation Details

### Real-Time Data Flow
```
Component Mount
    ↓
useTickets Hook
    ↓
onSnapshotTickets (Firestore Listener)
    ↓
Initial Data Load
    ↓
Component Renders
    ↓
Firestore Changes
    ↓
Callback Triggered
    ↓
State Updated
    ↓
Component Re-renders
    ↓
Component Unmount
    ↓
Unsubscribe (Cleanup)
```

### Filtering Logic
```typescript
// User filter: Show only user's tickets
filter === "user" → submittedBy === user.email

// Department filter: Show only department tickets
filter === "department" → department === user.department

// All filter: Show all tickets
filter === "all" → no client-side filtering
```

### Responsive Classes Used

**Grid Layouts**:
- `grid-cols-1` - Mobile (1 column)
- `md:grid-cols-2` - Tablet (2 columns)
- `lg:grid-cols-3` - Desktop (3 columns)
- `lg:grid-cols-4` - Desktop (4 columns for Kanban)

**Spacing**:
- `px-2 sm:px-0` - Responsive padding
- `gap-3 sm:gap-4 lg:gap-6` - Responsive gaps
- `space-y-4 sm:space-y-6` - Responsive vertical spacing

**Text**:
- `text-xs sm:text-sm lg:text-lg` - Responsive text sizes
- `text-2xl sm:text-3xl lg:text-4xl` - Responsive headings

**Flex**:
- `flex-col sm:flex-row` - Responsive direction
- `w-full sm:w-auto` - Responsive width

---

## Error Handling Implementation

### Error Display
```typescript
{error && (
  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
    <p>{error}</p>
  </div>
)}
```

### Empty State
```typescript
{tickets.length === 0 && (
  <div className="text-center py-16">
    <p className="text-muted-foreground text-lg mb-4">No requests yet</p>
    <Button onClick={() => setIsFormOpen(true)} className="gap-2">
      <Plus className="h-5 w-5" />
      Create Your First Request
    </Button>
  </div>
)}
```

### Loading State
```typescript
{loading ? (
  <CardSkeleton count={3} />
) : (
  // Content
)}
```

---

## Type Definitions

### Ticket Interface (from ticketService.ts)
```typescript
export interface Ticket {
  id?: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "urgent";
  priority: "low" | "medium" | "high";
  department: string;
  category: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  assignedTo?: string;
  submittedBy: string;
  attachments?: string[];
}
```

### Hook Options
```typescript
interface UseTicketsOptions {
  filter?: "all" | "user" | "department";
  status?: string;
  department?: string;
}
```

---

## Performance Optimizations

1. **Efficient Queries**: Only fetch necessary fields
2. **Proper Cleanup**: Unsubscribe on unmount
3. **Memoization**: Hooks prevent unnecessary re-renders
4. **Lazy Loading**: Skeleton states improve UX
5. **Error Boundaries**: Graceful error handling

---

## Testing Recommendations

### Unit Tests
- Test hook with different filters
- Test error handling
- Test loading states

### Integration Tests
- Test real-time updates
- Test Firebase connection
- Test data consistency

### E2E Tests
- Test user workflow
- Test responsiveness
- Test error scenarios

---

## Deployment Checklist

- [x] Build succeeds
- [x] No TypeScript errors
- [x] No console errors
- [x] All imports resolve
- [ ] Manual testing complete
- [ ] Performance verified
- [ ] Error handling tested
- [ ] Responsive design tested

---

## Rollback Plan

If issues occur:
1. Revert `src/hooks/useTickets.ts` deletion
2. Revert `src/services/ticketService.ts` changes
3. Revert `src/pages/department/Dashboard.tsx` to use mock data
4. Revert `src/pages/admin/TicketBoard.tsx` to use mock data

All changes are isolated and can be reverted independently.

