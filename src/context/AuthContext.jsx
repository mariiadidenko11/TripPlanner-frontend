import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getAuthMe } from '@/api/api';
import { CONFIG } from '@/api/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            // Clear local state first so the UI updates immediately.
            localStorage.removeItem(CONFIG.USER_KEY);
            setUser(null);
            // Tell the backend to drop the auth cookie.
            await apiLogout();
        } catch {
            // Local state is already cleared even if the call fails.
        }
    }, []);

    // On mount, ask the backend who we are. Auth is carried by the HttpOnly
    // cookie, so we always try — a 401 simply means "not logged in".
    useEffect(() => {
        getAuthMe()
            .then(u => {
                if (u) {
                    setUser(u);
                    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(u));
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    // Not authenticated — clear any stale cached profile.
                    localStorage.removeItem(CONFIG.USER_KEY);
                    setUser(null);
                } else {
                    // Network/server error: fall back to cached profile if present.
                    const stored = localStorage.getItem(CONFIG.USER_KEY);
                    if (stored) {
                        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
                    }
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
        // Backend returns { status, message } and sets the auth cookie.
        if (data?.status === true) {
            try {
                const me = await getAuthMe();
                if (me) setUser(me);
            } catch { /* cookie not yet usable */ }
        }
        return data;
    }, []);

    const register = useCallback(async (fields) => {
        const data = await apiRegister(fields);
        // The backend does NOT set an auth cookie on register, so we log in
        // right after a successful registration to establish the session.
        if (data?.status === true && fields?.email && fields?.password) {
            try {
                const loginRes = await apiLogin({ email: fields.email, password: fields.password });
                if (loginRes?.status === true) {
                    const me = await getAuthMe();
                    if (me) setUser(me);
                }
            } catch { /* leave user to log in manually */ }
        }
        return data;
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const me = await getAuthMe();
            if (me) setUser(me);
        } catch (err) {
            if (err.status === 401) logout();
        }
    }, [logout]);

    const value = { user, isAuthenticated, loading, login, register, logout, refreshUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        return {
            isAuthenticated: false,
            user: null,
            loading: false,
            login: async () => ({}),
            register: async () => ({}),
            logout: async () => {},
            refreshUser: async () => {},
        };
    }
    return context;
}
