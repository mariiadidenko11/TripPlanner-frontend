
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes/index';

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}
