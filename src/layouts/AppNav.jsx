
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';

export default function AppNav() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const initials = user?.firstname
        ? (user.firstname[0] + (user.lastname?.[0] || '')).toUpperCase()
        : '??';

    const fullName = user ? `${user.firstname} ${user.lastname || ''}`.trim() : 'User';

    return (
        <header className="nav">
            <div className="nav__inner">

                <Logo />

                <nav className="nav__links">
                    <NavLink
                        to="/trips"
                        className={({ isActive }) =>
                            'nav__link' + (isActive ? ' nav__link--active' : '')
                        }
                    >
                        Мої подорожі
                    </NavLink>
                    <NavLink
                        to="/statistics"
                        className={({ isActive }) =>
                            'nav__link' + (isActive ? ' nav__link--active' : '')
                        }
                    >
                        Статистика
                    </NavLink>
                </nav>

                <div className="nav__search">
                    <span className="nav__search-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        className="nav__search-input"
                        type="search"
                        placeholder="Пошук подорожей..."
                    />
                </div>

                <button
                    className="btn btn--buy-cta btn--pill btn--sm"
                    onClick={() => navigate('/trips/new')}
                >
                    + Нова подорож
                </button>

                <Link to="/profile" title={fullName} className="nav__avatar" style={{ textDecoration: 'none' }}>
                    {initials}
                </Link>

            </div>
        </header>
    );
}
