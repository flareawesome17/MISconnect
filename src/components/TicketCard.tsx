import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Calendar, Building2, User } from "lucide-react";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed" | "urgent";
    priority: "low" | "medium" | "high";
    department: string;
    createdAt: string;
    assignedTo?: string;
  };
  isAdmin?: boolean;
  compact?: boolean;
}

const TicketCard = ({ ticket, isAdmin = false, compact = false }: TicketCardProps) => {
  const linkTo = isAdmin ? `/admin/ticket/${ticket.id}` : `/department/ticket/${ticket.id}`;
  
  return (
    <Link to={linkTo}>
      <Card className={`${compact ? 'p-4' : 'p-6'} shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-foreground line-clamp-2 ${compact ? 'text-sm' : 'text-lg'}`}>
              {ticket.title}
            </h3>
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ticket.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <StatusBadge status={ticket.priority} />
          </div>

          <div className={`flex flex-col gap-2 pt-2 border-t border-border ${compact ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className={compact ? "h-3 w-3" : "h-4 w-4"} />
              <span>{ticket.department}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className={compact ? "h-3 w-3" : "h-4 w-4"} />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>

            {ticket.assignedTo && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className={compact ? "h-3 w-3" : "h-4 w-4"} />
                <span>{ticket.assignedTo}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TicketCard;
