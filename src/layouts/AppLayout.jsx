import { Outlet, Navigate } from 'react-router-dom';
import AppNav from './AppNav';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#40B3E0', fontSize: 18 }}>
                Завантаження…
            </div>
        );
    }

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
