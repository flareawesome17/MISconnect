import { cn } from "@/lib/utils";

type Status = "pending" | "in-progress" | "completed" | "urgent" | "low" | "medium" | "high";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-status-pending/10 text-status-pending border-status-pending/20",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
  },
  completed: {
    label: "Completed",
    className: "bg-status-completed/10 text-status-completed border-status-completed/20",
  },
  urgent: {
    label: "Urgent",
    className: "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  },
  low: {
    label: "Low Priority",
    className: "bg-status-pending/10 text-status-pending border-status-pending/20",
  },
  medium: {
    label: "Medium Priority",
    className: "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
  },
  high: {
    label: "High Priority",
    className: "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
