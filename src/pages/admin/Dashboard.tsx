import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCard from "@/components/TicketCard";
import { Ticket, Users, Clock, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockStats = {
  total: 127,
  pending: 23,
  inProgress: 45,
  completed: 59,
  urgent: 8,
  avgResponseTime: "2.5 hrs",
};

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Overview of all support requests</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/board">View Board</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-status-pending" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-status-in-progress" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-status-completed" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completed}</div>
            <p className="text-xs text-muted-foreground">Resolved this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-status-urgent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.urgent}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Tickets</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} isAdmin />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
