import { Outlet, useParams, NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getTrip, updateTrip, getTasks } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import StatusBadge from '@/components/ui/StatusBadge';

const TABS = [
    { label: 'Огляд', path: 'overview' },
    { label: 'Завдання', path: 'todo' },
    { label: 'Місця', path: 'places' },
    { label: 'Бронювання', path: 'booking' },
    { label: 'Нотатки', path: 'notes' },

];

const ICONS = {
    progress: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    budget: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 10 22 10" /><line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
    spent: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H4v12h16v-4" /><rect x="14" y="12" width="8" height="4" rx="1" /><path d="M4 8l8-4 8 4" />
        </svg>
    ),
    remaining: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><line x1="12" y1="6" x2="12" y2="18" />
        </svg>
    ),
};

export default function TripLayout() {
    const { tripId } = useParams();
    const location = useLocation();
    const [trip, setTrip] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTripDetails = useCallback(() => {
        if (!tripId) return;
        Promise.all([
            getTrip(tripId),
            getTasks(tripId).catch(() => [])
        ]).then(([tripData, tasksData]) => {
            setTrip(tripData);
            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [tripId]);

    useEffect(() => {
        fetchTripDetails();
    }, [fetchTripDetails, location.pathname]);

    const coverSrc = trip?.cover || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1223&q=85';

    const tasksDone = tasks.filter(t => t.check || t.done).length;
    const tasksTotal = tasks.length;

    const progressDone = tasksTotal > 0 ? tasksDone : (trip?.tasks_done ?? 0);
    const progressTotal = tasksTotal > 0 ? tasksTotal : (trip?.tasks_total ?? 0);
    const progress = progressTotal > 0 ? Math.round((progressDone / progressTotal) * 100) : 0;

    const startMoney = Number(trip?.start_money ?? trip?.budget ?? 0);
    const factMoney = Number(trip?.fact_money ?? trip?.spent ?? 0);
    const remaining = Math.max(startMoney - factMoney, 0);

    const handleRate = async (rateValue) => {
        try {
            await updateTrip(tripId, { rate: rateValue });
            setTrip(prev => ({ ...prev, rate: rateValue }));
            toast('Оцінка оновлена!', 'success');
        } catch (err) {
            toast(err.message, 'error');
        }
    };

    const isOverview = location.pathname.endsWith('/overview') || location.pathname.endsWith(tripId);

    return (
        <div className="container--trip">
            <Link to="/trips" className="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Назад до списку
            </Link>

            <div className="hero-banner">
                <img className="hero-banner__img" src={coverSrc} alt={trip?.name || trip?.title} />
                <div className="hero-banner__content">
                    <StatusBadge status={trip?.status} className="hero-banner__status" />
                    <h1 className="hero-banner__title">{trip?.name || trip?.title || 'Завантаження...'}</h1>
                    <p className="hero-banner__location">{trip?.location || ''}</p>
                </div>
            </div>

            <section className="stats">
                <div className="stats__grid">
                    {[
                        { label: 'ПРОГРЕС ПІДГОТОВКИ', value: `${progress}%`, icon: ICONS.progress, color: 'var(--primary)' },
                        { label: 'ЗАГАЛЬНИЙ БЮДЖЕТ', value: startMoney > 0 ? `$${startMoney.toLocaleString()}` : '—', icon: ICONS.budget, color: 'var(--primary)' },
                        { label: 'ВИТРАЧЕНО', value: `$${factMoney.toLocaleString()}`, icon: ICONS.spent, color: 'var(--primary)' },
                        { label: 'ЗАЛИШОК', value: startMoney > 0 ? `$${remaining.toLocaleString()}` : '—', icon: ICONS.remaining, color: remaining > 0 ? '#22c55e' : 'var(--primary)' },
                    ].map(({ label, value, icon, color }) => (
                        <div className="stats__card" key={label}>
                            <div className="stats__icon" style={{ color }}>{icon}</div>
                            <div>
                                <div className="stats__label">{label}</div>
                                <div className="stats__value" style={{ color: label === 'ЗАЛИШОК' && remaining > 0 ? '#22c55e' : undefined }}>{value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {isOverview && (
                <div className="rating-card">
                    <div className="rating-card__title">ОЦІНІТЬ ПОДОРОЖ</div>
                    <div className="rating-card__stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`rating-card__star ${star <= (trip?.rate || 0) ? 'rating-card__star--active' : ''}`}
                                onClick={() => handleRate(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <nav className="tab-bar">
                {TABS.map(({ label, path }) => (
                    <NavLink
                        key={path}
                        to={`/trips/${tripId}/${path}`}
                        className={({ isActive }) => 'tab-bar__tab' + (isActive ? ' tab-bar__tab--active' : '')}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="page-content" style={{ marginTop: 'var(--sp-6)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate)' }}>Завантаження...</div>
                ) : (
                    <Outlet context={{ tripId, trip, refetchTrip: fetchTripDetails }} />
                )}
            </div>

            <style>{`
                .container--trip { max-width: var(--container-trip); margin: 0 auto; padding: var(--sp-6) var(--sp-4) var(--sp-16); }
                .back-link { display: inline-flex; align-items: center; gap: var(--sp-1); font-size: 14px; font-weight: 600; color: var(--slate); text-decoration: none; margin-bottom: var(--sp-4); }
                .hero-banner {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 5;
                    border-radius: var(--radius-xxl);
                    overflow: hidden;
                    margin-bottom: var(--sp-6);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
                    display: block;
                }
                .hero-banner__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 40%;
                    display: block;
                    transition: transform 6s ease;
                }
                .hero-banner:hover .hero-banner__img {
                    transform: scale(1.04);
                }
                .hero-banner__content {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    padding: var(--sp-6) var(--sp-6) var(--sp-5);
                    background: linear-gradient(
                        to top,
                        rgba(0,0,0,0.78) 0%,
                        rgba(0,0,0,0.35) 55%,
                        transparent 100%
                    );
                    color: #fff;
                }
                .hero-banner__title {
                    font-size: 30px;
                    font-weight: 700;
                    margin-bottom: var(--sp-1);
                    letter-spacing: -0.02em;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.35);
                    line-height: 1.15;
                }
                @media (max-width: 768px) {
                    .hero-banner {
                        aspect-ratio: 16 / 7;
                        border-radius: var(--radius-xl);
                    }
                    .hero-banner__title { font-size: 22px; }
                }
                .stats__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-4); margin-bottom: var(--sp-6); }
                .stats__card { background: var(--canvas); border: 1px solid var(--hairline-soft); border-radius: var(--radius-xl); padding: var(--sp-4); display: flex; align-items: center; gap: var(--sp-3); }
                .stats__icon { width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--primary-soft); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .stats__label { font-size: 11px; color: var(--slate); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
                .stats__value { font-size: 18px; font-weight: 600; color: var(--ink-deep); }
                .rating-card { background: var(--canvas); border: 1px solid var(--hairline-soft); border-radius: var(--radius-xl); padding: var(--sp-4); margin-bottom: var(--sp-6); display: flex; align-items: center; justify-content: space-between; }
                .rating-card__stars { display: flex; gap: var(--sp-1); font-size: 24px; cursor: pointer; }
                .rating-card__star--active { color: #FFBA00; }
                .tab-bar { display: flex; background: var(--canvas); padding: 4px; gap: 8px; overflow-x: auto; }
                .tab-bar__tab { flex: 1; text-align: center; font-size: 13.5px; font-weight: 600; color: var(--slate); padding: 10px 20px; border-radius: var(--radius-full); border: 1px solid var(--hairline-soft); text-decoration: none; white-space: nowrap; transition: all var(--t-fast); }
                .tab-bar__tab--active { background: var(--primary) !important; color: #FFFFFF !important; border-color: var(--primary) !important; }
                @media (max-width: 768px) { .stats__grid { grid-template-columns: repeat(2, 1fr); } }

            `}</style>
        </div>
    );
}
