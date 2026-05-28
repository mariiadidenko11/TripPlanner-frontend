import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.firstname || !form.lastname || !form.email || !form.password) {
            setError('Будь ласка, заповніть всі поля');
            return;
        }

        setLoading(true);
        try {
            const result = await register(form);

            
            if (result && typeof result.email === 'boolean') {
                const fieldErrors = [];
                if (!result.firstName) fieldErrors.push("Ім'я");
                if (!result.lastName) fieldErrors.push('Прізвище');
                if (!result.email) fieldErrors.push('Email (невірний формат або вже зайнятий)');
                if (!result.password) fieldErrors.push('Пароль (занадто короткий)');
                if (fieldErrors.length > 0) {
                    setError('Помилка: ' + fieldErrors.join(', '));
                    return;
                }
            }

            
            if (result?.status === false) {
                setError(result.message || 'Помилка реєстрації');
                return;
            }

            toast('Акаунт створено!', 'success');
            navigate('/trips');
        } catch (err) {
            setError(err.message || 'Помилка реєстрації');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth">
            <div className="auth__card">
                <Logo />
                <h1 className="auth__heading">Реєстрація</h1>
                <p className="auth__sub">Приєднуйтесь до BezMezh та почніть планувати.</p>

                {error && (
                    <p style={{ color: 'var(--critical)', fontSize: '13px', marginBottom: '8px', textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                <form className="auth__form" onSubmit={submit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div className="auth__field" style={{ marginBottom: 0 }}>
                            <input className="auth__input" type="text" placeholder="Ім'я"
                                value={form.firstname} onChange={handle('firstname')} required />
                        </div>
                        <div className="auth__field" style={{ marginBottom: 0 }}>
                            <input className="auth__input" type="text" placeholder="Прізвище"
                                value={form.lastname} onChange={handle('lastname')} required />
                        </div>
                    </div>
                    <div className="auth__field">
                        <input className="auth__input" type="email" placeholder="Email адреса"
                            value={form.email} onChange={handle('email')} required />
                    </div>
                    <div className="auth__field">
                        <input className="auth__input" type="password" placeholder="Пароль"
                            value={form.password} onChange={handle('password')} required />
                    </div>

                    <Button type="submit" loading={loading} loadingText="Створення..."
                        className="auth__submit">
                        Зареєструватися
                    </Button>
                </form>

                <p className="auth__footer-text">
                    Вже маєте акаунт? <Link to="/login">Увійти</Link>
                </p>
            </div>
        </main>
    );
}
