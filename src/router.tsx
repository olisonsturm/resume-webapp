import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import App from './App';
import { LetterApp } from './pages/LetterApp';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
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
