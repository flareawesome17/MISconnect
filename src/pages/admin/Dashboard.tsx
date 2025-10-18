import AdminNav from "@/components/AdminNav";
import TicketCard from "@/components/TicketCard";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

// Mock data - will be replaced with real data later
const mockStats = [
  { label: "Open Tickets", value: "12", icon: Clock, color: "text-status-in-progress" },
  { label: "In Progress", value: "5", icon: TrendingUp, color: "text-status-pending" },
  { label: "Completed Today", value: "8", icon: CheckCircle2, color: "text-status-completed" },
  { label: "Urgent", value: "3", icon: AlertCircle, color: "text-status-urgent" },
];

const mockTickets = [
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
  {
    id: "2",
    title: "Software Installation Request",
    description: "Need Adobe Creative Suite installed on workstation",
    status: "pending" as const,
    priority: "medium" as const,
    department: "Marketing",
    createdAt: "2025-01-14T14:20:00Z",
  },
  {
    id: "3",
    title: "Printer Malfunction",
    description: "Office printer not responding to print commands",
    status: "urgent" as const,
    priority: "high" as const,
    department: "HR",
    createdAt: "2025-01-15T09:15:00Z",
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all support requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Tickets */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Recent Tickets</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} isAdmin />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
