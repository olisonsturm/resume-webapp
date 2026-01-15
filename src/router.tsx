import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import App from './App';
import { LetterApp } from './pages/LetterApp';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/cv/:id',
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
    },
    {
        path: '/letter/:id',
        element: (
            <ProtectedRoute>
                <LetterApp />
            </ProtectedRoute>
        ),
    },
]);

