
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/api';
import { CONFIG } from '@/api/config';

const DEMO_USER = {
    id: 'u1',
    data_id: 'd1',
    firstname: 'Андрій',
    lastname: 'Шевченко',
    email: 'example11@gmail.com',
    description: 'Завзятий мандрівник, люблю гори, море і нові культури.',
    created_at: '2024-01-01T00:00:00Z',
};
const DEMO_TOKEN = 'demo-mock-token';
function bootstrapDemo() {
    if (!localStorage.getItem(CONFIG.TOKEN_KEY)) {
        localStorage.setItem(CONFIG.TOKEN_KEY, DEMO_TOKEN);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(DEMO_USER));
    }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    bootstrapDemo();

    const stored = localStorage.getItem(CONFIG.USER_KEY);
    const [user, setUser] = useState(stored ? JSON.parse(stored) : DEMO_USER);

    const isAuthenticated = !!localStorage.getItem(CONFIG.TOKEN_KEY);

    useEffect(() => {
        if (user) {
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        }
    }, [user]);

    const login = useCallback(async (credentials) => {
        const data = await apiLogin(credentials);
        setUser(data.user);
        return data;
    }, []);

    const register = useCallback(async (fields) => {
        const data = await apiRegister(fields);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await apiLogout();
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
