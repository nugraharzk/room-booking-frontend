import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import RoomsPage from "@/pages/RoomsPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import AdminUsersPage from "@/pages/admin/UsersPage";
import AdminRoomsPage from "@/pages/admin/RoomsPage";
import AdminBookingsPage from "@/pages/admin/BookingsPage";

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to dashboard if authorized but wrong role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomsPage />} />

            {/* User Routes */}
            <Route path="my-bookings" element={
              <ProtectedRoute requiredRole="User">
                <MyBookingsPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="admin/users" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminUsersPage />
              </ProtectedRoute>
            } />
            <Route path="admin/rooms" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminRoomsPage />
              </ProtectedRoute>
            } />
            <Route path="admin/bookings" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminBookingsPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
