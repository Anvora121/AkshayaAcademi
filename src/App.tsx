import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Education from "./pages/Education";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Enquiry from "./pages/Enquiry";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import UserDashboard from "./pages/dashboard/UserDashboard";
import PremiumDashboard from "./pages/dashboard/PremiumDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PremiumPlans from "./pages/PremiumPlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/education" element={<Education />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/universities/:id" element={<UniversityDetail />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/premium-plans" element={<PremiumPlans />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['user', 'subscribed', 'admin']}>
                  <UserDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />

            <Route path="/premium-dashboard" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['subscribed', 'admin']}>
                  <PremiumDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
