import { Outlet, Navigate } from 'react-router-dom';
import AppNav from './AppNav';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <AppNav />
            <main className="page">
                <Outlet />
            </main>
            <ToastContainer />
        </>
    );
}