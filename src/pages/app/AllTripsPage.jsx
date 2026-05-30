import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getTrips, deleteTrip, restoreTrip } from '@/api/api';
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

    const STATUS_ORDER = ['active', 'waiting', 'completed'];
    const STATUS_LABELS = {
        active: 'Активні',
        waiting: 'В очікуванні',
        completed: 'Завершені'
    };

    const { data, loading, error, refetch } = useApi(() => getTrips({ status: filter }), [filter]);

    const tripsArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);

    // ── ЄДИНА логіка сортування подорожей (та сама на «Усі подорожі» і в статистиці) ──
    const _ts = (v) => { if (!v) return null; const d = new Date(v); return isNaN(d) ? null : d.getTime(); };
    const compareTrips = (a, b) => {
        const W = { active: 1, completed: 2, waiting: 3 };
        const wDiff = (W[a.status] || 99) - (W[b.status] || 99);
        if (wDiff !== 0) return wDiff;
        if (a.status === 'completed') {
            const ea = _ts(a.end_at) ?? _ts(a.start_at);
            const eb = _ts(b.end_at) ?? _ts(b.start_at);
            if (ea === null && eb === null) return 0;
            if (ea === null) return 1; if (eb === null) return -1;
            return eb - ea; // нещодавно завершені спершу
        }
        const sa = _ts(a.start_at), sb = _ts(b.start_at);
        if (sa === null && sb === null) return 0;
        if (sa === null) return 1; if (sb === null) return -1;
        return sa - sb; // найближчі/ранні спершу
    };


    const trips = tripsArray
        .filter(t =>
            !search ||
            (t.name || t.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (t.location || '').toLowerCase().includes(search.toLowerCase())
        )
        .sort(compareTrips);

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
                        {f === 'all' ? 'Всі' : f === 'active' ? 'Активні' : f === 'completed' ? 'Завершені' : 'В очікуванні'}
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

                        return (
                            <div key={trip.id} className="trip-card" onClick={() => navigate(`/trips/${trip.id}/overview`)}>
                                <div className="trip-card__header">
                                    <StatusBadge status={trip.status} />
                                    <button onClick={e => handleDelete(e, trip)} className="trip-card__delete" title="Видалити">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="trip-card__content">
                                    <h3 className="trip-card__title">{trip.name || trip.title}</h3>
                                    <p className="trip-card__location">
                                        <span className="tc-loc-icon">📍</span>
                                        {trip.location || 'Місто не вказано'}
                                    </p>

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


                    <div className="add-card" onClick={() => navigate('/trips/new')}>
                        <div className="add-card__body">
                            <div className="add-card__plus">+</div>
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
                                <div className="trips-trash__icon">✈️</div>
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
                    font-weight: 700;
                    color: var(--ink-deep);
                    letter-spacing: -0.02em;
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
                    box-shadow: 0 4px 12px rgba(64,179,224,0.3);
                }

                .trips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--sp-6);
                    align-items: stretch;
                }

                /* ── Trip card ── */
                .trip-card {
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.2, 1, 0.3, 1);
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .trip-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                    border-color: rgba(64,179,224,0.3);
                }

                .trip-card__header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px 0;
                }

                .trip-card__delete {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--slate);
                    background: var(--surface-soft);
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    opacity: 0.6;
                }
                .trip-card__delete:hover {
                    background: #fee2e2;
                    color: var(--critical);
                    opacity: 1;
                    transform: scale(1.1);
                }

                .trip-card__content {
                    padding: 20px 24px 24px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .trip-card__title {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--ink-deep);
                    margin-bottom: 6px;
                    line-height: 1.2;
                }

                .trip-card__location {
                    font-size: 14px;
                    color: var(--slate);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .tc-loc-icon { font-size: 14px; opacity: 0.8; }

                .trip-card__stats {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 24px;
                    flex: 1;
                }

                .tc-stat-block { display: flex; flex-direction: column; gap: 8px; }
                .tc-stat-header { display: flex; justify-content: space-between; align-items: center; }
                .tc-stat-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--slate);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tc-stat-value { font-size: 13px; font-weight: 700; }
                .tc-val-primary { color: var(--ink-deep); }
                .tc-val-sep { color: var(--hairline); margin: 0 2px; }
                .tc-val-secondary { color: var(--slate); font-weight: 500; }

                .trip-card__footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid var(--hairline-soft);
                    font-size: 12px;
                    color: var(--slate);
                    font-weight: 500;
                }
                .trip-card__date-sep { color: var(--hairline); margin: 0 4px; }
                .tc-progress-pct {
                    font-weight: 700;
                    color: #40B3E0;
                    background: rgba(64,179,224,0.1);
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                }

                /* ── Add card ── */
                .add-card {
                    background: var(--canvas);
                    border: 2px dashed var(--hairline);
                    border-radius: 24px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    min-height: 280px;
                }
                .add-card:hover {
                    border-color: #40B3E0;
                    background: rgba(64,179,224,0.02);
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.05);
                }
                .add-card__body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 12px;
                }
                .add-card__plus {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--surface-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    color: var(--slate);
                    transition: all 0.3s ease;
                    margin-bottom: 8px;
                }
                .add-card:hover .add-card__plus {
                    background: #40B3E0;
                    color: #fff;
                    transform: rotate(90deg) scale(1.1);
                }
                .add-card__text {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--ink-deep);
                }
                .add-card__hint {
                    font-size: 13px;
                    color: var(--slate);
                    max-width: 200px;
                    line-height: 1.5;
                }

                /* ── Trash ── */
                .trips-trash {
                    margin-top: 48px;
                    padding: 24px;
                    background: var(--surface-soft);
                    border-radius: 24px;
                    border: 1px solid var(--hairline-soft);
                }
                .trips-trash__title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--slate);
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .trips-trash__list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 12px;
                }
                .trips-trash__item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: 16px;
                }
                .trips-trash__icon {
                    width: 32px;
                    height: 32px;
                    background: var(--surface-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    font-size: 14px;
                }
                .trips-trash__name {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .trips-trash__restore {
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                    border: 1.5px solid #40B3E0;
                    background: transparent;
                    color: #40B3E0;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .trips-trash__restore:hover {
                    background: #40B3E0;
                    color: #fff;
                }

                @media (max-width: 600px) {
                    .trips-header { margin-bottom: 24px; }
                    .trips-title { font-size: 24px; }
                    .trips-actions { width: 100%; }
                    .search-box { width: 100%; }
                    .trips-grid { grid-template-columns: 1fr; }
                    .add-card { min-height: 200px; }
                }
            `}</style>
        </div>
    );
}
