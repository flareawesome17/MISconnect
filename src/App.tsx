import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartmentDashboard from "./pages/department/Dashboard";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import TicketBoard from "./pages/admin/TicketBoard";
import TicketDetail from "./pages/admin/TicketDetail";
import Users from "./pages/admin/Users";
import Departments from "./pages/admin/Departments";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/department" element={<DepartmentDashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="board" element={<TicketBoard />} />
            <Route path="ticket/:id" element={<TicketDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="departments" element={<Departments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
