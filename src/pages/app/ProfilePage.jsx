import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUser, changePassword } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
    const { user, logout } = useAuth();

 
    const [profileForm, setProfileForm] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        description: user?.description || '',
    });
    const [profileLoading, setProfileLoading] = useState(false);

    const [pwdForm, setPwdForm] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [pwdLoading, setPwdLoading] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await updateUser(profileForm);
            toast('Профіль успішно оновлено!', 'success');
        } catch (err) {
            toast(err.message, 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePwdSubmit = async (e) => {
        e.preventDefault();
        if (pwdForm.new !== pwdForm.confirm) {
            toast('Паролі не збігаються!', 'error');
            return;
        }
        setPwdLoading(true);
        try {
            await changePassword({
                old_password: pwdForm.current,
                new_password: pwdForm.new,
            });
            toast('Пароль успішно змінено!', 'success');
            setPwdForm({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast(err.message, 'error');
        } finally {
            setPwdLoading(false);
        }
    };

    return (
        <div className="container page">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: 'var(--sp-10)', textAlign: 'center' }}>
                    <div className="nav__avatar" style={{
                        width: '80px',
                        height: '80px',
                        fontSize: '28px',
                        margin: '0 auto var(--sp-4)',
                        background: 'var(--primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        borderRadius: '50%'
                    }}>
                        {user?.firstname?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                        {user?.firstname} {user?.lastname}
                    </h1>
                    <p style={{ color: 'var(--slate)' }}>Керуйте своїм профілем та налаштуваннями.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--sp-8)' }}>
               
                    <section className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div className="card__body" style={{ padding: 'var(--sp-8)' }}>
                            <h3 className="card__title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--sp-6)', color: 'var(--ink-deep)' }}>
                                Особиста інформація
                            </h3>
                            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                                    <div className="auth__field">
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Ім'я</label>
                                        <input
                                            className="auth__input"
                                            type="text"
                                            value={profileForm.firstname}
                                            onChange={e => setProfileForm({ ...profileForm, firstname: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="auth__field">
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Прізвище</label>
                                        <input
                                            className="auth__input"
                                            type="text"
                                            value={profileForm.lastname}
                                            onChange={e => setProfileForm({ ...profileForm, lastname: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="auth__field">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Про себе</label>
                                    <textarea
                                        className="auth__input"
                                        style={{ minHeight: '100px', paddingTop: '12px' }}
                                        value={profileForm.description}
                                        onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
                                    />
                                </div>
                                <div style={{ marginTop: 'var(--sp-2)' }}>
                                    <Button type="submit" variant="buy-cta" rounded="full" loading={profileLoading} loadingText="Збереження...">
                                        Зберегти зміни
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div className="card__body" style={{ padding: 'var(--sp-8)' }}>
                            <h3 className="card__title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--sp-6)', color: 'var(--ink-deep)' }}>
                                Безпека
                            </h3>
                            <form onSubmit={handlePwdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                                <div className="auth__field">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Поточний пароль</label>
                                    <input
                                        className="auth__input"
                                        type="password"
                                        value={pwdForm.current}
                                        onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                                    <div className="auth__field">
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Новий пароль</label>
                                        <input
                                            className="auth__input"
                                            type="password"
                                            value={pwdForm.new}
                                            onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="auth__field">
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-deep)', marginBottom: '6px', display: 'block' }}>Підтвердіть новий пароль</label>
                                        <input
                                            className="auth__input"
                                            type="password"
                                            value={pwdForm.confirm}
                                            onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: 'var(--sp-2)' }}>
                                    <Button type="submit" variant="secondary" rounded="full" loading={pwdLoading} loadingText="Зміна...">
                                        Змінити пароль
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>

                 
                    <section className="card" style={{ borderColor: 'var(--critical)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div className="card__body" style={{ padding: 'var(--sp-8)' }}>
                            <h3 className="card__title" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--critical)', marginBottom: 'var(--sp-2)' }}>
                                Небезпечна зона
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: 'var(--sp-6)' }}>
                                Вихід з облікового запису видалить сесію на цьому пристрої. Дані залишаться в безпеці.
                            </p>
                            <Button variant="ghost" rounded="full" style={{ color: 'var(--critical)', borderColor: 'var(--critical)' }} onClick={logout}>
                                Вийти з системи
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
