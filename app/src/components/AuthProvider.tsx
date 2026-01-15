import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { initialize, initialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!initialized) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}
