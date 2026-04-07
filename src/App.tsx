import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import PremiumPlans from "./pages/PremiumPlans";
import ErrorBoundary from "./components/ErrorBoundary";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();

// Smart redirect: sends each logged-in role to the correct destination
const DashboardRedirect = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    // Incomplete onboarding → resume register flow
    if (user.onboardingComplete === false) {
        return <Navigate to="/register" replace state={{ step: user.onboardingStep ?? 2 }} />;
    }
    if (user.role === 'subscribed') return <Navigate to="/premium-dashboard" replace />;
    return <Navigate to="/dashboard/user" replace />;
};

// Guard: redirect unauthenticated users to login, keep the return path
const App = () => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            {/* ── Public ── */}
                            <Route path="/" element={<Index />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/education" element={<Education />} />
                            <Route path="/universities" element={<Universities />} />
                            <Route path="/universities/:id" element={<UniversityDetail />} />
                            <Route path="/enquiry" element={<Enquiry />} />
                            <Route path="/premium-plans" element={<PremiumPlans />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />

                            {/* ── Auth ── */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                            {/* ── Registration / Onboarding (accessible while logged in or not) ── */}
                            <Route path="/register" element={<RegisterPage />} />

                            {/* ── Smart dashboard redirect ── */}
                            <Route
                                path="/dashboard"
                                element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>}
                            />

                            {/* ── User Dashboard ── */}
                            <Route
                                path="/dashboard/user"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['user', 'subscribed', 'admin']}>
                                            <UserDashboard />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            {/* ── Premium Dashboard ── */}
                            <Route
                                path="/premium-dashboard"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['subscribed', 'admin']}>
                                            <PremiumDashboard />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            {/* ── Admin ── */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/analytics"
                                element={
                                    <ProtectedRoute>
                                        <RoleRoute allowedRoles={['admin']}>
                                            <AdminAnalytics />
                                        </RoleRoute>
                                    </ProtectedRoute>
                                }
                            />

                            {/* ── 404 ── */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default App;
