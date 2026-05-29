import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { forgotPassword } from '@/api/api';
import { toast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) { setError('Please enter your email'); return; }

        setLoading(true);
        try {
            await forgotPassword({ email });
            toast('Reset link sent to your email', 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth">
            <div className="auth__card">
                <Logo />
                <h1 className="auth__heading">Forgot Password</h1>
                <p className="auth__sub">Enter your email to receive a reset link.</p>

                {error && (
                    <p style={{ color: 'var(--critical)', fontSize: '13px', marginBottom: '8px', textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                <form className="auth__form" onSubmit={submit}>
                    <div className="auth__field">
                        <input className="auth__input" type="email" placeholder="Email address"
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <Button type="submit" loading={loading} loadingText="Sending..."
                        className="auth__submit">
                        Send Reset Link
                    </Button>
                </form>

                <Link to="/login" className="auth__back" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--primary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Sign In
                </Link>
            </div>
        </main>
    );
}
