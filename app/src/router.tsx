import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import App from './App';
import { LetterApp } from './pages/LetterApp';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/cv/:id',
        element: <App />,
    },
    {
        path: '/letter/:id',
        element: <LetterApp />,
    },
]);
