import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import {
    getTrips, deleteTrip, /*restoreTrip  */ } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AllTripsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [trash, setTrash] = useState([]);

    const { data, loading, error, refetch } = useApi(() => getTrips({ status: filter }), [filter]);

    const tripsArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);

    const trips = tripsArray.filter(t =>
        !search ||
        (t.name || t.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.location || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = useCallback(async (e, trip) => {
        e.stopPropagation();
        try {
            await deleteTrip(trip.id);
            setTrash(t => [trip, ...t]);
            refetch();
        } catch (err) {
            toast(err.message, 'error');
        }
    }, [refetch]);

    const handleRestore = useCallback(async (trip) => {
        try {
            await restoreTrip(trip.id);
            setTrash(t => t.filter(x => x.id !== trip.id));
            refetch();
        } catch (err) {
            toast(err.message, 'error');
        }
    }, [refetch]);

    return (
        <div className="container page">
            <div className="trips-header">
                <div>
                    <h1 className="trips-title">Мої подорожі</h1>
                    <p className="trips-sub">Всі ваші пригоди в одному місці</p>
                </div>
                <div className="trips-actions">
                    <div className="search-box">
                        <svg className="search-box__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="search" placeholder="Пошук подорожей..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Button variant="buy-cta" rounded="full" onClick={() => navigate('/trips/new')}>
                        + Нова подорож
                    </Button>
                </div>
            </div>

            <div className="filter-bar">
                {['all', 'active', 'completed', 'waiting'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'filter-chip--active' : ''}`}>
                        {f === 'all' ? 'Всі' : f === 'active' ? 'Активні' : f === 'completed' ? 'Завершені' : 'Очікують'}
                    </button>
                ))}
            </div>

            {loading && <div className="loading-state">Завантаження...</div>}
            {error && <div className="error-state">Помилка при завантаженні подорожей</div>}

            {!loading && !error && (
                <div className="trips-grid">
                    {trips.map(trip => {
                        const progress = Math.round((trip.tasks_done / trip.tasks_total) * 100) || 0;
                        const budget = trip.start_money || trip.budget || 0;
                        const spent = trip.fact_money || trip.spent || 0;
                        const budgetPercent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
                        const cover = trip.cover || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1223&auto=format&fit=crop';

                        return (
                            <div key={trip.id} className="trip-card" onClick={() => navigate(`/trips/${trip.id}/overview`)}>
                                <div className="trip-card__cover">
                                    <img src={cover} alt={trip.name || trip.title} />
                                    <div className="trip-card__badge">
                                        <StatusBadge status={trip.status} />
                                    </div>
                                    <button onClick={e => handleDelete(e, trip)} className="trip-card__delete">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="trip-card__content">
                                    <h3 className="trip-card__title">{trip.name || trip.title}</h3>
                                    <p className="trip-card__location">{trip.location || 'Місто не вказано'}</p>

                                    <div className="trip-card__stats">
                                        <div className="tc-stat-block">
                                            <div className="tc-stat-header">
                                                <span className="tc-stat-label">Виконані завдання</span>
                                                <span className="tc-stat-value">
                                                    <span className="tc-val-primary">{trip.tasks_done}</span>
                                                    <span className="tc-val-sep"> / </span>
                                                    <span className="tc-val-secondary">{trip.tasks_total}</span>
                                                </span>
                                            </div>
                                            <ProgressBar value={progress} />
                                        </div>

                                        <div className="tc-stat-block">
                                            <div className="tc-stat-header">
                                                <span className="tc-stat-label">Використаний бюджет</span>
                                                <span className="tc-stat-value">
                                                    <span className="tc-val-primary">${spent.toLocaleString()}</span>
                                                    <span className="tc-val-sep"> / </span>
                                                    <span className="tc-val-secondary">${budget.toLocaleString()}</span>
                                                </span>
                                            </div>
                                            <ProgressBar value={budgetPercent} variant="success" />
                                        </div>
                                    </div>

                                    <div className="trip-card__footer">
                                        <span className="trip-card__date">
                                            {trip.start_at ? trip.start_at.slice(0, 10) : '—'}
                                            <span className="trip-card__date-sep"> → </span>
                                            {trip.end_at ? trip.end_at.slice(0, 10) : '—'}
                                        </span>
                                        <span className="tc-progress-pct">{progress}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Add new trip card ── */}
                    <div className="add-card" onClick={() => navigate('/trips/new')}>
                        <div className="add-card__cover">
                            <div className="add-card__plus">+</div>
                        </div>
                        <div className="add-card__body">
                            <div className="add-card__text">Додати нову подорож</div>
                            <div className="add-card__hint">Почніть планувати свою наступну чудову подорож вже сьогодні</div>
                        </div>
                    </div>

                    {trips.length === 0 && !loading && (
                        <div className="empty-wrapper">
                            <EmptyState icon="✈️" title="Подорожей не знайдено" subtitle="Додайте свою першу подорож прямо зараз!" />
                        </div>
                    )}
                </div>
            )}

            {trash.length > 0 && (
                <div className="trips-trash">
                    <p className="trips-trash__title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                        Нещодавно видалені ({trash.length})
                    </p>
                    <div className="trips-trash__list">
                        {trash.map(trip => (
                            <div key={trip.id} className="trips-trash__item">
                                <img src={trip.cover || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400'} alt={trip.name} className="trips-trash__thumb" />
                                <span className="trips-trash__name">{trip.name || trip.title}</span>
                                <button onClick={() => handleRestore(trip)} className="trips-trash__restore">
                                    ↩ Відновити
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .trips-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--sp-8);
                    gap: var(--sp-4);
                    flex-wrap: wrap;
                }
                .trips-title {
                    font-size: 28px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .trips-sub {
                    font-size: 14px;
                    color: var(--slate);
                    margin-top: 4px;
                }
                .trips-actions {
                    display: flex;
                    gap: var(--sp-3);
                    align-items: center;
                }
                .search-box {
                    position: relative;
                    width: 260px;
                }
                .search-box__icon {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--slate);
                    pointer-events: none;
                    flex-shrink: 0;
                }
                .search-box input {
                    width: 100%;
                    padding: 10px 14px 10px 38px;
                    border-radius: var(--radius-full);
                    border: 1.5px solid var(--hairline);
                    font-family: var(--font);
                    font-size: 14px;
                    outline: none;
                    background: var(--canvas);
                    transition: all var(--t-fast);
                    box-sizing: border-box;
                }
                .search-box input:focus {
                    border-color: #40B3E0;
                    box-shadow: 0 0 0 3px rgba(64,179,224,0.15);
                }
                .search-box:focus-within .search-box__icon {
                    color: #40B3E0;
                }

                .filter-bar {
                    display: flex;
                    gap: 8px;
                    margin-bottom: var(--sp-8);
                    overflow-x: auto;
                    padding-bottom: 4px;
                }
                .filter-chip {
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    border: 1px solid var(--hairline-soft);
                    background: var(--canvas);
                    color: var(--charcoal);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all var(--t-fast);
                }
                .filter-chip:hover { background: var(--surface-soft); }
                .filter-chip--active {
                    background: #40B3E0;
                    color: #fff;
                    border-color: #40B3E0;
                    box-shadow: 0 2px 8px rgba(64,179,224,0.35);
                }
                .filter-chip--active:hover {
                    background: #2ea8d8;
                    border-color: #2ea8d8;
                }

                .trips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--sp-6);
                    align-items: start;
                }

                /* ── Trip card ── */
                .trip-card {
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all var(--t-base);
                }
                .trip-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                }
                .trip-card__cover {
                    position: relative;
                    height: 200px;
                }
                .trip-card__cover img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }
                .trip-card__badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                }
                .trip-card__delete {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--slate);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity var(--t-fast);
                }
                .trip-card:hover .trip-card__delete { opacity: 1; }
                .trip-card__delete:hover { color: var(--critical); }

                .trip-card__content { padding: var(--sp-5); }
                .trip-card__title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--ink-deep);
                    margin-bottom: 4px;
                }
                .trip-card__location {
                    font-size: 13px;
                    color: var(--slate);
                    margin-bottom: var(--sp-4);
                }
                .trip-card__stats {
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-3);
                    margin-bottom: var(--sp-4);
                }
                .tc-stat-block { display: flex; flex-direction: column; gap: 6px; }
                .tc-stat-header { display: flex; justify-content: space-between; align-items: center; }
                .tc-stat-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--slate);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .tc-stat-value {
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                }
                .tc-val-primary   { color: var(--ink-deep); font-weight: 700; }
                .tc-val-sep       { color: var(--slate); font-weight: 500; margin: 0 1px; }
                .tc-val-secondary { color: var(--slate); font-weight: 500; }
                .trip-card__footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid var(--hairline-soft);
                    padding-top: var(--sp-4);
                    font-size: 12px;
                    color: var(--slate);
                }
                .trip-card__date-sep { color: var(--hairline); margin: 0 2px; }
                .tc-progress-pct { font-size: 12px; font-weight: 700; color: var(--primary); }

                /* ── Add card ── */
                .add-card {
                    background: var(--canvas);
                    border: 2px dashed #cbd5e1;
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all var(--t-base);
                    display: flex;
                    flex-direction: column;
                }
                .add-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                    border-color: #40B3E0;
                }
                .add-card__cover {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    border-bottom: 1px dashed #cbd5e1;
                    transition: background var(--t-base);
                }
                .add-card:hover .add-card__cover {
                    background: #f0f9ff;
                    border-color: #40B3E0;
                }
                .add-card__plus {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    font-weight: 300;
                    color: #94a3b8;
                    transition: all var(--t-base);
                }
                .add-card:hover .add-card__plus {
                    border-color: #40B3E0;
                    color: #40B3E0;
                    transform: scale(1.1);
                }
                .add-card__body {
                    padding: var(--sp-5);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    text-align: center;
                    flex: 1;
                }
                .add-card__text {
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--ink-deep);
                    transition: color var(--t-base);
                }
                .add-card:hover .add-card__text { color: #40B3E0; }
                .add-card__hint {
                    font-size: 13px;
                    color: var(--slate);
                    opacity: 0.65;
                    line-height: 1.4;
                }

                .loading-state, .error-state {
                    text-align: center;
                    padding: 100px 0;
                    color: var(--slate);
                }
                .empty-wrapper { grid-column: 1 / -1; }

                /* ── Trash ── */
                .trips-trash {
                    margin-top: var(--sp-8);
                    padding: var(--sp-5);
                    background: var(--surface-soft);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                }
                .trips-trash__title {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--slate);
                    margin-bottom: var(--sp-4);
                }
                .trips-trash__list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-2);
                }
                .trips-trash__item {
                    display: flex;
                    align-items: center;
                    gap: var(--sp-3);
                    padding: var(--sp-3) var(--sp-4);
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-lg);
                }
                .trips-trash__thumb {
                    width: 48px;
                    height: 36px;
                    object-fit: cover;
                    border-radius: var(--radius-md);
                    flex-shrink: 0;
                }
                .trips-trash__name {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .trips-trash__restore {
                    padding: 6px 14px;
                    border-radius: var(--radius-full);
                    border: 1.5px solid var(--primary);
                    background: transparent;
                    color: var(--primary);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--t-fast);
                    white-space: nowrap;
                }
                .trips-trash__restore:hover {
                    background: var(--primary);
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
