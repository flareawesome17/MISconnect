# Real-Time Implementation Quick Reference

## How to Use the New Hooks

### Basic Usage - Get All Tickets
```typescript
import { useTickets } from "@/hooks/useTickets";

const { tickets, loading, error } = useTickets({ filter: "all" });
```

### Get User's Tickets Only
```typescript
const { tickets, loading, error } = useTickets({ filter: "user" });
// Shows only tickets where submittedBy === currentUser.email
```

### Get Department Tickets
```typescript
const { tickets, loading, error } = useTickets({ filter: "department" });
// Shows only tickets from user's department
```

### Get Tickets Grouped by Status (Kanban)
```typescript
import { useTicketsByStatus } from "@/hooks/useTickets";

const { groupedTickets, loading, error, totalTickets } = useTicketsByStatus({ 
  filter: "all" 
});

// groupedTickets structure:
// {
//   pending: Ticket[],
//   "in-progress": Ticket[],
//   urgent: Ticket[],
//   completed: Ticket[]
// }
```

### With Status Filter
```typescript
const { tickets, loading, error } = useTickets({ 
  filter: "all",
  status: "pending"
});
```

### With Department Filter
```typescript
const { tickets, loading, error } = useTickets({ 
  filter: "all",
  department: "Engineering"
});
```

## Component Implementation Examples

### Customer Dashboard Pattern
```typescript
const DepartmentDashboard = () => {
  const { tickets, loading, error } = useTickets({ filter: "user" });

  return (
    <div>
      {error && <ErrorAlert message={error} />}
      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### Admin Board Pattern
```typescript
const TicketBoard = () => {
  const { groupedTickets, loading, error } = useTicketsByStatus({ 
    filter: "all" 
  });

  return (
    <div>
      {error && <ErrorAlert message={error} />}
      {loading ? (
        <LoadingKanban />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(groupedTickets).map(([status, tickets]) => (
            <Column key={status} status={status} tickets={tickets} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## Real-Time Listener Details

### How It Works
1. Component mounts
2. `useTickets` hook sets up Firestore real-time listener
3. Initial data loads and component renders
4. Any changes to Firestore automatically trigger updates
5. Component unmounts → listener unsubscribes

### Automatic Cleanup
```typescript
useEffect(() => {
  // ... setup listener
  return () => unsubscribe(); // Cleanup on unmount
}, [dependencies]);
```

## Responsive Breakpoints

| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| xs | 375px | Mobile phones |
| sm | 640px | Small tablets |
| md | 768px | Medium tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Extra large screens |

## Common Responsive Patterns Used

### Grid Layouts
```typescript
// 1 column on mobile, 2 on tablet, 3 on desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// 1 column on mobile, 2 on small, 4 on desktop
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
```

### Spacing
```typescript
// Responsive padding
className="px-2 sm:px-4 lg:px-6"

// Responsive gaps
className="gap-3 sm:gap-4 lg:gap-6"
```

### Text Sizes
```typescript
// Responsive text
className="text-xs sm:text-sm lg:text-lg"
```

## Ticket Interface

```typescript
interface Ticket {
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

## Troubleshooting

### Tickets Not Updating in Real-Time
- Check Firebase connection
- Verify Firestore rules allow read access
- Check browser console for errors
- Ensure user is authenticated

### Empty Tickets List
- Verify user has `submittedBy` field matching their email
- Check Firestore database for actual tickets
- Verify department filter matches user's department

### Loading State Never Ends
- Check Firebase connection
- Look for errors in browser console
- Verify Firestore collection exists
- Check network tab for failed requests

### Responsive Layout Breaking
- Use Tailwind breakpoints: xs, sm, md, lg, xl, 2xl
- Test on actual devices or browser dev tools
- Check for hardcoded widths (use responsive classes instead)
- Verify container padding: `px-2 sm:px-4`

## Performance Tips

1. **Use filter: "user"** on customer dashboard to reduce data
2. **Unsubscribe properly** - hooks handle this automatically
3. **Avoid unnecessary re-renders** - hooks are optimized
4. **Use loading states** - improves perceived performance
5. **Test on slow networks** - use Chrome DevTools throttling

## Files to Reference

- `src/hooks/useTickets.ts` - Hook implementation
- `src/services/ticketService.ts` - Firebase service
- `src/pages/department/Dashboard.tsx` - Customer example
- `src/pages/admin/TicketBoard.tsx` - Admin example

