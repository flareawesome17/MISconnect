import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            SupportConnect
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            Streamline your support requests and IT operations with our intuitive two-sided platform
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Link to="/department" className="group">
              <div className="bg-card hover:shadow-card-hover transition-all duration-300 rounded-xl p-8 h-full border border-border/50 hover:border-primary/50 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-card-foreground">Department Portal</h2>
                  <p className="text-muted-foreground">
                    Submit support requests, track tickets, and view request history
                  </p>
                  <Button className="mt-4">Access Portal</Button>
                </div>
              </div>
            </Link>

            <Link to="/admin" className="group">
              <div className="bg-card hover:shadow-card-hover transition-all duration-300 rounded-xl p-8 h-full border border-border/50 hover:border-primary/50 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-card-foreground">Admin Portal</h2>
                  <p className="text-muted-foreground">
                    Manage tickets, assign tasks, and track team performance
                  </p>
                  <Button className="mt-4">Admin Login</Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
