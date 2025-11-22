import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Payments from "./pages/Payments";
import FraudDetection from "./pages/FraudDetection";
import CitizenPortal from "./pages/CitizenPortal";
import ProjectDetails from "./pages/ProjectDetails";
import ReportIssue from "./pages/ReportIssue";
import Reports from "./pages/Reports";
import Audit from "./pages/Audit";
import About from "./pages/About";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import UsersPage from "./pages/admin/UsersPage";
import CreateAdminPage from "./pages/admin/CreateAdminPage";
import DataEntry from "./pages/DataEntry";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Composant pour rediriger les utilisateurs connectés
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          
          {/* Routes d'authentification */}
          <Route path="/login" element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          } />
          <Route path="/register" element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          } />
          <Route path="/forgot-password" element={
            <AuthRedirect>
              <ForgotPasswordPage />
            </AuthRedirect>
          } />
          <Route path="/reset-password" element={
            <AuthRedirect>
              <ResetPasswordPage />
            </AuthRedirect>
          } />
          
          {/* Routes protégées */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/budget" element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/fraud-detection" element={
            <ProtectedRoute>
              <FraudDetection />
            </ProtectedRoute>
          } />
          <Route path="/citizen-portal" element={
            <ProtectedRoute>
              <CitizenPortal />
            </ProtectedRoute>
          } />
          <Route path="/project/:id" element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          } />
          <Route path="/report-issue/:id" element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute requiredRole="admin">
              <Audit />
            </ProtectedRoute>
          } />
          {/* Routes d'administration */}
          <Route path="/admin">
            <Route index element={
              <ProtectedRoute>
                <Navigate to="/admin/users" replace />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="create-admin" element={
              <ProtectedRoute requiredRole="admin">
                <CreateAdminPage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/data-entry" element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          } />
          
          {/* Routes d'erreur */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* 404 - Page non trouvée */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
