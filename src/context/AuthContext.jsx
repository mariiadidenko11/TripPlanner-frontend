import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getAuthMe } from '@/api/api';
import { CONFIG } from '@/api/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuthMe()
            .then(u => {
                if (u) {
                    setUser(u);
                    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(u));
                }
            })
            .catch(() => {
                
                const stored = localStorage.getItem(CONFIG.USER_KEY);
                if (stored) {
                    try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CONFIG.USER_KEY);
        }
    }, [user]);

    const isAuthenticated = !!user;

    const login = useCallback(async (credentials) => {
        const data = await apiLogin(credentials);
        
        if (data?.status === true) {
            try {
                const me = await getAuthMe();
                if (me) setUser(me);
            } catch { /* cookie може ще не встановитись */ }
        }
        return data;
    }, []);

    const register = useCallback(async (fields) => {
        const data = await apiRegister(fields);
        if (data?.status === true) {
            try {
                const me = await getAuthMe();
                if (me) setUser(me);
            } catch { /* ignore */ }
        }
        return data;
    }, []);

    const logout = useCallback(async () => {
        await apiLogout();
        setUser(null);
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const me = await getAuthMe();
            if (me) setUser(me);
        } catch { /* ignore */ }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
