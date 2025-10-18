import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface RequestFormProps {
  onSuccess?: () => void;
}

const RequestForm = ({ onSuccess }: RequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Request submitted successfully!");
    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Request Title *</Label>
        <Input
          id="title"
          placeholder="Brief description of your issue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="network">Network Issues</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="software">Software Installation</SelectItem>
            <SelectItem value="access">System Access</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority *</Label>
        <Select required defaultValue="medium">
          <SelectTrigger id="priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department *</Label>
        <Select required>
          <SelectTrigger id="department">
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Please provide detailed information about your request..."
          className="min-h-32"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">Attachments (optional)</Label>
        <Input
          id="attachment"
          type="file"
          multiple
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          You can attach screenshots or relevant documents
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};

export default RequestForm;
