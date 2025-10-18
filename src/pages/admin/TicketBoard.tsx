import TicketCard from "@/components/TicketCard";
import { Card } from "@/components/ui/card";

// Mock data - will be replaced with real data later
const mockTicketsByStatus = {
  pending: [
    {
      id: "2",
      title: "Software Installation Request",
      description: "Need Adobe Creative Suite installed on workstation",
      status: "pending" as const,
      priority: "medium" as const,
      department: "Marketing",
      createdAt: "2025-01-14T14:20:00Z",
    },
  ],
  "in-progress": [
    {
      id: "1",
      title: "Network Connection Issue",
      description: "Unable to connect to shared network drive",
      status: "in-progress" as const,
      priority: "high" as const,
      department: "Engineering",
      createdAt: "2025-01-15T10:30:00Z",
      assignedTo: "John Doe",
    },
  ],
  urgent: [
    {
      id: "3",
      title: "Printer Malfunction",
      description: "Office printer not responding to print commands",
      status: "urgent" as const,
      priority: "high" as const,
      department: "HR",
      createdAt: "2025-01-15T09:15:00Z",
    },
  ],
  completed: [
    {
      id: "4",
      title: "Email Configuration",
      description: "Setup new email account for employee",
      status: "completed" as const,
      priority: "low" as const,
      department: "HR",
      createdAt: "2025-01-13T11:00:00Z",
      assignedTo: "Jane Smith",
    },
  ],
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  urgent: "Urgent",
  completed: "Completed",
};

const TicketBoard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Ticket Board</h2>
        <p className="text-muted-foreground">Kanban view of all support tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(mockTicketsByStatus).map(([status, tickets]) => (
          <div key={status} className="flex flex-col">
            <Card className="p-4 mb-4 bg-secondary">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full bg-status-${status}`} />
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-auto text-muted-foreground text-sm">
                  {tickets.length}
                </span>
              </h3>
            </Card>
            
            <div className="space-y-4 flex-1">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isAdmin compact />
              ))}
              
              {tickets.length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No tickets</p>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketBoard;
