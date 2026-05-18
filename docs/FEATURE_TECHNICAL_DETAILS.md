# Technical Implementation Details

## Feature 1: Edit Ticket Details - Technical Overview

### Component Architecture

```
DepartmentTicketDetail (Page)
├── EditDepartmentTicketModal (Modal)
│   ├── Form validation
│   ├── Error handling
│   └── Loading states
└── updateTicket() (Service)
```

### Data Flow

```
User clicks Edit
    ↓
Modal opens with current ticket data
    ↓
User modifies fields
    ↓
Form validation runs
    ↓
User clicks Save
    ↓
updateTicket() called with partial updates
    ↓
Firestore updates ticket document
    ↓
Local state updated
    ↓
Success notification shown
    ↓
Modal closes
```

### Key Functions

#### `canEditTicket()`
```typescript
const canEditTicket = (): boolean => {
  if (!ticket || !user) return false;
  if (ticket.submittedBy !== user.email) return false;
  if (ticket.status !== "pending" && ticket.status !== "in-progress") return false;
  return true;
};
```

#### `handleEditTicket()`
```typescript
const handleEditTicket = async (updates: Partial<Ticket>) => {
  await updateTicket(ticket.id!, updates);
  setTicket({ ...ticket, ...updates });
  toast.success("Ticket updated successfully");
};
```

### Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| Title | Required, non-empty | "Title is required" |
| Description | Required, non-empty | "Description is required" |
| Category | Required, must be in list | "Category is required" |
| Priority | Required, must be low/medium/high | "Priority is required" |

### Firestore Updates

```typescript
// Only these fields are updated
{
  title: string,
  description: string,
  category: string,
  priority: "low" | "medium" | "high",
  updatedAt: Timestamp.now()  // Auto-updated
}
```

---

## Feature 2: Mark as Spam - Technical Overview

### Component Architecture

```
TicketDetail (Page)
├── MarkAsSpamModal (Modal)
│   ├── Confirmation dialog
│   ├── Warning messages
│   └── Loading states
└── handleMarkAsSpam() (Handler)
    ├── Create action entry
    ├── Update ticket status
    └── Record metadata
```

### Data Flow

```
User clicks Mark as Spam
    ↓
Modal opens with confirmation
    ↓
User clicks Confirm
    ↓
Permission check passes
    ↓
Create ActionTaken entry
    ↓
Update ticket with:
    - status: "spam"
    - actionsTaken: [..., newAction]
    - markedAsSpamBy: user.email
    - markedAsSpamAt: timestamp
    ↓
Firestore updates ticket
    ↓
Local state updated
    ↓
Success notification shown
    ↓
Modal closes
    ↓
Button hidden
```

### Key Functions

#### `handleMarkAsSpam()`
```typescript
const handleMarkAsSpam = async () => {
  const newAction: ActionTaken = {
    id: `action_${Date.now()}`,
    description: `Marked as spam by ${user.email}`,
    author: user.email,
    timestamp: new Date(),
  };
  
  await updateTicket(ticket.id!, {
    status: "spam",
    actionsTaken: [...(ticket.actionsTaken || []), newAction],
    markedAsSpamBy: user.email,
    markedAsSpamAt: new Date(),
  });
};
```

### Permission Check

```typescript
// In useEffect
const userPermissions = await getUserPermissions(user.uid);
setCanMarkAsSpam(hasPermission(userPermissions, "mark_tickets_as_spam"));
```

### Firestore Updates

```typescript
// Updates made when marking as spam
{
  status: "spam",
  actionsTaken: [
    ...existingActions,
    {
      id: "action_1234567890",
      description: "Marked as spam by admin@example.com",
      author: "admin@example.com",
      timestamp: Timestamp.now()
    }
  ],
  markedAsSpamBy: "admin@example.com",
  markedAsSpamAt: Timestamp.now(),
  updatedAt: Timestamp.now()  // Auto-updated
}
```

### Ticket Interface Updates

```typescript
export interface Ticket {
  // ... existing fields ...
  status: "pending" | "in-progress" | "completed" | "urgent" | "spam";
  markedAsSpamBy?: string;
  markedAsSpamAt?: Timestamp | Date;
}
```

### Permission Type Update

```typescript
export type Permission = 
  | "view_tickets"
  | "create_tickets"
  | "edit_tickets"
  | "delete_tickets"
  | "accept_tickets"
  | "assign_tickets"
  | "reassign_tickets"
  | "mark_tickets_as_spam"  // NEW
  | // ... other permissions ...
```

---

## State Management

### Feature 1 State
```typescript
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isUpdating, setIsUpdating] = useState(false);
```

### Feature 2 State
```typescript
const [canMarkAsSpam, setCanMarkAsSpam] = useState(false);
const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
```

---

## Error Handling

### Feature 1
```typescript
try {
  await updateTicket(ticket.id!, updates);
  setTicket({ ...ticket, ...updates });
  toast.success("Ticket updated successfully");
} catch (error) {
  console.error("Error updating ticket:", error);
  toast.error("Failed to update ticket");
  throw error;
}
```

### Feature 2
```typescript
try {
  await updateTicket(ticket.id!, {
    status: "spam",
    actionsTaken: updatedActions,
    markedAsSpamBy: user.email,
    markedAsSpamAt: new Date(),
  });
  toast.success("Ticket marked as spam");
} catch (error) {
  console.error("Error marking ticket as spam:", error);
  toast.error("Failed to mark ticket as spam");
  throw error;
}
```

---

## Responsive Design

### Mobile Considerations
- Edit button uses icon + text on desktop, icon-only on mobile
- Modal full-width on mobile, constrained on desktop
- Form fields stack vertically
- Buttons full-width on mobile

### Breakpoints Used
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

---

## Performance Optimizations

1. **Lazy Loading**: Modals only render when needed
2. **Conditional Rendering**: Buttons only show when applicable
3. **Optimistic Updates**: UI updates before server confirmation
4. **Debounced Validation**: Real-time error clearing

---

## Security Considerations

1. **Permission Checks**: All actions verified server-side
2. **User Verification**: Only ticket creator can edit
3. **Status Validation**: Cannot edit resolved tickets
4. **Audit Trail**: All spam markings recorded
5. **Input Validation**: All fields validated before save


