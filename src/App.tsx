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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import UserDashboard from "./pages/dashboard/UserDashboard";
import PremiumDashboard from "./pages/dashboard/PremiumDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PremiumPlans from "./pages/PremiumPlans";
import ErrorBoundary from "./components/ErrorBoundary";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import { Navigate } from 'react-router-dom';

const queryClient = new QueryClient();

// Smart redirect component: sends each logged-in role to their correct dashboard
const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'subscribed') return <Navigate to="/premium-dashboard" replace />;
  return <Navigate to="/dashboard/user" replace />;
};

const App = () => (
  <ErrorBoundary>
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
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Smart redirect at /dashboard based on role */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

              {/* Actual per-role dashboards */}
              <Route path="/dashboard/user" element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
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
  </ErrorBoundary>
);

export default App;
