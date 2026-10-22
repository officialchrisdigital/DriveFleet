import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('customer' | 'staff' | 'admin')[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // 1. If not authenticated
  if (!isAuthenticated) {
    if (allowedRoles?.includes('staff') || allowedRoles?.includes('admin')) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    const redirectUrl = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // 2. If authenticated, check allowed role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

export function CustomerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function StaffRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['staff', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}
