import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";

const DepartmentNav = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Building2 className="h-6 w-6" />
            <span className="font-semibold text-lg">SupportConnect</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNav;
