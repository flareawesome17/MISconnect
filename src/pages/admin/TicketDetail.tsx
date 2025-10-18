import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, User, Building2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock data - will be replaced with real data later
const mockTicket = {
  id: "1",
  title: "Network Connection Issue",
  description: "Unable to connect to shared network drive. The connection drops every few minutes and prevents access to critical project files.",
  status: "in-progress" as const,
  priority: "high" as const,
  department: "Engineering",
  createdAt: "2025-01-15T10:30:00Z",
  assignedTo: "John Doe",
  submittedBy: "Alice Johnson",
  category: "Network",
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleStatusChange = (newStatus: string) => {
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleAssign = (assignee: string) => {
    toast.success(`Ticket assigned to ${assignee}`);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {mockTicket.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={mockTicket.status} />
                  <StatusBadge status={mockTicket.priority} />
                  <span className="text-sm text-muted-foreground">
                    Ticket #{mockTicket.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-foreground/80">{mockTicket.description}</p>
            </div>
          </Card>

          {/* Activity/Comments Section */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Activity</h3>
            
            <div className="space-y-4 mb-6">
              <div className="border-l-2 border-primary pl-4 py-2">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">John Doe</span> assigned this ticket to themselves
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
              
              <div className="border-l-2 border-muted pl-4 py-2">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Alice Johnson</span> created this ticket
                </p>
                <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Add Comment
              </label>
              <Textarea
                placeholder="Leave a comment or update..."
                className="mb-2"
              />
              <Button>Post Comment</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Submitted by</p>
                  <p className="font-medium text-foreground">{mockTicket.submittedBy}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{mockTicket.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(mockTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{mockTicket.category}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select onValueChange={handleStatusChange} defaultValue={mockTicket.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Assign To
                </label>
                <Select onValueChange={handleAssign} defaultValue={mockTicket.assignedTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
