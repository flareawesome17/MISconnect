import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LayoutDashboard, KanbanSquare, Home } from "lucide-react";

const AdminNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Shield className="h-6 w-6" />
            <span className="font-semibold text-lg">Admin Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button 
                variant={isActive("/admin") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/admin/board">
              <Button 
                variant={isActive("/admin/board") ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <KanbanSquare className="h-4 w-4" />
                Board
              </Button>
            </Link>

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

export default AdminNav;
