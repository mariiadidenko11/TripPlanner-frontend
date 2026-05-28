import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');

    const handle = (field) => (e) =>
        setForm(f => ({ ...f, [field]: field === 'remember' ? e.target.checked : e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Please fill in all fields'); return; }

        setLoading(true);
        try {
            const result = await login({ email: form.email, password: form.password, remember_me: form.remember });
            // Real backend: { status: false, message } on wrong credentials
            if (result?.status === false) {
                setError(result.message || 'Невірний email або пароль');
                return;
            }
            toast('Welcome back!', 'success');
            navigate('/trips');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth" role="main">
            <div className="auth__card">
                <Logo />
                <h1 className="auth__heading">Welcome back!</h1>
                <p className="auth__sub">Your next adventure is waiting.</p>

                {error && (
                    <p style={{ color: 'var(--critical)', fontSize: '13px', marginBottom: '8px', textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                <form className="auth__form" onSubmit={submit} noValidate>
                    <div className="auth__field">
                        <input className="auth__input" type="email" placeholder="Email address"
                            autoComplete="email" value={form.email} onChange={handle('email')} required />
                    </div>

                    <div className="auth__field">
                        <input className={`auth__input auth__input--password`}
                            type={showPwd ? 'text' : 'password'}
                            placeholder="Password"
                            autoComplete="current-password"
                            value={form.password} onChange={handle('password')} required />
                        <button type="button" className="auth__eye"
                            onClick={() => setShowPwd(v => !v)}
                            aria-label={showPwd ? 'Hide password' : 'Show password'}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {showPwd ? (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>

                    <div className="auth__row">
                        <label className="auth__remember">
                            <input className="auth__remember-checkbox" type="checkbox"
                                checked={form.remember} onChange={handle('remember')} />
                            <span className="auth__remember-label">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="auth__forgot">Forgot password?</Link>
                    </div>

                    <Button type="submit" loading={loading} loadingText="Signing in..."
                        className="auth__submit">
                        Sign In
                    </Button>
                </form>

                <p className="auth__footer-text">
                    New user? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </main>
    );
}
