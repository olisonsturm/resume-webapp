import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabase';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    // If Supabase is not configured, allow access (local development mode)
    if (!isSupabaseConfigured()) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner" />
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login, but save the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
