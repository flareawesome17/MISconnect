import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DepartmentNav from "@/components/DepartmentNav";
import RequestForm from "@/components/RequestForm";
import TicketCard from "@/components/TicketCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data - will be replaced with real data later
const mockTickets = [
  {
    id: "1",
    title: "Network Connection Issue",
    description: "Unable to connect to shared network drive",
    status: "in-progress" as const,
    priority: "high" as const,
    department: "Engineering",
    createdAt: "2025-01-15T10:30:00Z",
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
];

const DepartmentDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DepartmentNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Requests</h1>
            <p className="text-muted-foreground">View and manage your support tickets</p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit New Request</DialogTitle>
              </DialogHeader>
              <RequestForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>

        {mockTickets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No requests yet</p>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Request
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DepartmentDashboard;
