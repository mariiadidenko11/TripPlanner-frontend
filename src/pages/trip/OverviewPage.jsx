import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getTasks, getPlaces, updateTrip } from '@/api/api';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusBadge from '@/components/ui/StatusBadge';

function fmt(iso) {
    if (!iso) return 'Не вказано';
    return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
}
function getDays(start, end) {
    if (!start || !end) return 0;
    return Math.ceil(Math.abs(new Date(end) - new Date(start)) / 86400000) + 1;
}
function fmtDays(n) {
    if (!n) return '—';
    return `${n} ${n === 1 ? 'день' : n < 5 ? 'дні' : 'днів'}`;
}

const STATUS_OPTIONS = ['active', 'waiting', 'completed'];

function IconEdit() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function IconX() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export default function OverviewPage() {
    const { trip, tripId, setTrip } = useOutletContext();

    const { data: tasksData } = useApi(() => getTasks(tripId), [tripId]);
    const { data: placesData } = useApi(() => getPlaces(tripId), [tripId]);

    const tasks = tasksData ?? [];
    const places = placesData ?? [];

    const tasksDone = tasks.filter(t => t.check || t.done).length;
    const tasksTotal = tasks.length;
    const placesVisited = places.filter(p => p.check || p.visited).length;
    const placesTotal = places.length;

    const tasksDoneDisplay = tasksTotal > 0 ? tasksDone : (trip?.tasks_done ?? 0);
    const tasksTotalDisplay = tasksTotal > 0 ? tasksTotal : (trip?.tasks_total ?? 0);
    const tasksProgress = tasksTotalDisplay > 0 ? Math.round((tasksDoneDisplay / tasksTotalDisplay) * 100) : 0;
    const placesProgress = placesTotal > 0 ? Math.round((placesVisited / placesTotal) * 100) : 0;

    const budget = Number(trip?.start_money ?? trip?.budget ?? 0);
    const days = getDays(trip?.start_at, trip?.end_at);

    const tripSpent = Number(trip?.fact_money ?? trip?.spent ?? 0);
    const budgetPct = budget > 0 ? Math.min(Math.round((tripSpent / budget) * 100), 100) : 0;
    const isOver = budget > 0 && tripSpent > budget;


    const [editing, setEditing] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [draft, setDraft] = useState({});

    const startEdit = () => {
        setDraft({
            location: trip?.location || '',
            start_at: trip?.start_at ? trip.start_at.slice(0, 10) : '',
            end_at: trip?.end_at ? trip.end_at.slice(0, 10) : '',
            status: trip?.status || 'active',
            start_money: trip?.start_money ?? trip?.budget ?? '',
        });
        setEditing(true);
    };

    const cancelEdit = () => setEditing(false);

    const saveEdit = async () => {
        setEditSaving(true);
        try {
            const updated = await updateTrip(tripId, {
                location: draft.location,
                start_at: draft.start_at,
                end_at: draft.end_at,
                status: draft.status,
                start_money: Number(draft.start_money) || 0,
            });
            
            if (typeof setTrip === 'function') setTrip(updated);
            setEditing(false);
        } catch (e) {
            console.error(e);
        } finally {
            setEditSaving(false);
        }
    };

    const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

    const editDays = getDays(draft.start_at, draft.end_at);

    return (
        <div className="ov-grid">

           
            <div className="ov-card ov-card--details">
                <h3 className="ov-card__title">
                    <span>🗺️</span> Деталі подорожі
                </h3>

                {!editing ? (
                  
                    <>
                        <div className="ov-list">
                            {[
                                { icon: '📍', label: 'Місто', value: trip?.location || 'Не вказано' },
                                { icon: '📅', label: 'Початок', value: fmt(trip?.start_at) },
                                { icon: '🏁', label: 'Завершення', value: fmt(trip?.end_at) },
                                { icon: '🔖', label: 'Статус', value: trip ? <StatusBadge status={trip.status} variant="neutral" /> : '—' },
                            ].map(row => (
                                <div key={row.label} className="ov-row">
                                    <span className="ov-row__icon">{row.icon}</span>
                                    <span className="ov-row__label">{row.label}</span>
                                    <span className="ov-row__value">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        
                        <button className="ov-edit-btn" onClick={startEdit} title="Редагувати">
                            <IconEdit />
                        </button>
                    </>
                ) : (
                   
                    <>
                        <div className="ov-edit-list">

                            <div className="ov-edit-row">
                                <span className="ov-row__icon">📍</span>
                                <span className="ov-edit-label">Місто</span>
                                <input
                                    className="ov-edit-input"
                                    value={draft.location}
                                    onChange={e => set('location', e.target.value)}
                                    placeholder="Введіть місто"
                                />
                            </div>

                            <div className="ov-edit-row">
                                <span className="ov-row__icon">📅</span>
                                <span className="ov-edit-label">Початок</span>
                                <input
                                    className="ov-edit-input"
                                    type="date"
                                    value={draft.start_at}
                                    onChange={e => set('start_at', e.target.value)}
                                />
                            </div>

                            <div className="ov-edit-row">
                                <span className="ov-row__icon">🏁</span>
                                <span className="ov-edit-label">Завершення</span>
                                <input
                                    className="ov-edit-input"
                                    type="date"
                                    value={draft.end_at}
                                    onChange={e => set('end_at', e.target.value)}
                                />
                            </div>



                            <div className="ov-edit-row">
                                <span className="ov-row__icon">💰</span>
                                <span className="ov-edit-label">Бюджет ($)</span>
                                <input
                                    className="ov-edit-input"
                                    type="number"
                                    min="0"
                                    value={draft.start_money}
                                    onChange={e => set('start_money', e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                            {editDays > 0 && (
                                <div className="ov-edit-row ov-edit-row--info">
                                    <span className="ov-row__icon">⏱️</span>
                                    <span className="ov-edit-label">Тривалість</span>
                                    <span className="ov-edit-computed">{fmtDays(editDays)}</span>
                                </div>
                            )}
                        </div>

                        <div className="ov-edit-actions">
                            <button className="ov-edit-cancel" onClick={cancelEdit} disabled={editSaving}>
                                <IconX /> Скасувати
                            </button>
                            <button className="ov-edit-save" onClick={saveEdit} disabled={editSaving}>
                                <IconCheck /> {editSaving ? 'Збереження...' : 'Зберегти'}
                            </button>
                        </div>
                    </>
                )}
            </div>

           
            <div className="ov-card">
                <h3 className="ov-card__title">
                    <span>📊</span> Прогрес
                </h3>
                <div className="ov-prog-list">

                    <div className="ov-prog-group">
                        <div className="ov-prog-row">
                            <span className="ov-prog-label">✅ Виконані завдання</span>
                            <span className="ov-prog-count">
                                <strong>{tasksDoneDisplay}</strong>
                                <span className="ov-prog-of"> / {tasksTotalDisplay}</span>
                            </span>
                        </div>
                        <ProgressBar value={tasksProgress} />
                    </div>

                    <div className="ov-prog-group">
                        <div className="ov-prog-row">
                            <span className="ov-prog-label">📍 Відвідані місця</span>
                            <span className="ov-prog-count">
                                <strong>{placesVisited}</strong>
                                <span className="ov-prog-of"> / {placesTotal || '—'}</span>
                            </span>
                        </div>
                        {placesTotal > 0
                            ? <ProgressBar value={placesProgress} variant="warning" />
                            : <span className="ov-empty">Немає місць</span>
                        }
                    </div>

                    <div className="ov-prog-group">
                        <div className="ov-prog-row">
                            <span className="ov-prog-label">💰 Використаний бюджет</span>
                            <span className="ov-prog-count">
                                <strong style={{ color: isOver ? '#ef4444' : '#40B3E0' }}>${tripSpent.toLocaleString()}</strong>
                                <span className="ov-prog-of"> / ${budget.toLocaleString()}</span>
                            </span>
                        </div>
                        {budget > 0
                            ? <ProgressBar value={budgetPct} variant="success" />
                            : <span className="ov-empty">Бюджет не вказано</span>
                        }
                    </div>

                    <div className="ov-prog-group">
                        <div className="ov-prog-row">
                            <span className="ov-prog-label">⏱️ Тривалість подорожі</span>
                            <span className="ov-prog-count">
                                <strong>{fmtDays(days)}</strong>
                            </span>
                        </div>
                        <ProgressBar
                            value={days > 0 ? Math.min(
                                Math.round((Math.max(new Date() - new Date(trip?.start_at), 0) / (new Date(trip?.end_at) - new Date(trip?.start_at))) * 100), 100
                            ) : 0}
                        />
                    </div>

                </div>
            </div>


            <style>{`
                /* ── Grid ─────────────────────────────────────── */
                .ov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-6); align-items: stretch; }
                .ov-card--full { grid-column: 1 / -1; }

                /* ── Card ─────────────────────────────────────── */
                .ov-card {
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    padding: var(--sp-6);
                }
                .ov-card--details { position: relative; min-height: 100%; box-sizing: border-box; }
                .ov-card__title {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 12px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.05em; color: var(--ink-deep);
                    margin-bottom: var(--sp-5);
                }

                /* ── Detail rows (view) ───────────────────────── */
                .ov-list { display: flex; flex-direction: column; }
                .ov-row {
                    display: flex; align-items: center; gap: 8px;
                    padding: 11px 0;
                    border-bottom: 1px solid var(--hairline-soft);
                }
                .ov-row:last-child { border-bottom: none; }
                .ov-row__icon  { font-size: 14px; flex-shrink: 0; }
                .ov-row__label { font-size: 13px; color: var(--slate); flex: 1; }
                .ov-row__value { font-size: 13px; font-weight: 600; color: var(--ink-deep); text-align: right; }

                /* ── Edit button ──────────────────────────────── */
                .ov-edit-btn {
                    position: absolute;
                    bottom: 16px; right: 16px;
                    width: 30px; height: 30px;
                    border-radius: 50%;
                    border: 1.5px solid var(--hairline);
                    background: var(--canvas);
                    color: var(--slate);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    z-index: 1;
                }
                .ov-edit-btn:hover {
                    border-color: #40B3E0;
                    color: #40B3E0;
                    background: rgba(64,179,224,0.08);
                    transform: scale(1.1);
                    box-shadow: 0 2px 8px rgba(64,179,224,0.2);
                }

                /* ── Edit rows ────────────────────────────────── */
                .ov-edit-list { display: flex; flex-direction: column; margin-bottom: var(--sp-4); }
                .ov-edit-row {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--hairline-soft);
                }
                .ov-edit-row:last-child { border-bottom: none; }
                .ov-edit-row--info { opacity: 0.75; }
                .ov-edit-label {
                    font-size: 13px; color: var(--slate); flex: 1; min-width: 80px;
                }
                .ov-edit-input {
                    flex: 1;
                    padding: 6px 10px;
                    border: 1.5px solid var(--hairline);
                    border-radius: var(--radius-md);
                    font-size: 13px; font-weight: 600;
                    font-family: var(--font);
                    color: var(--ink-deep);
                    background: var(--canvas);
                    outline: none;
                    transition: border-color 0.15s ease;
                    text-align: right;
                }
                .ov-edit-input:focus {
                    border-color: #40B3E0;
                    box-shadow: 0 0 0 3px rgba(64,179,224,0.12);
                }
                .ov-edit-select { cursor: pointer; }
                .ov-edit-computed {
                    font-size: 13px; font-weight: 600; color: var(--ink-deep);
                    text-align: right;
                }

                /* ── Edit actions ─────────────────────────────── */
                .ov-edit-actions {
                    display: flex; gap: 8px; justify-content: flex-end;
                    padding-top: var(--sp-3);
                    border-top: 1px solid var(--hairline-soft);
                }
                .ov-edit-cancel, .ov-edit-save {
                    display: flex; align-items: center; gap: 5px;
                    padding: 7px 14px;
                    border-radius: var(--radius-md);
                    font-size: 12px; font-weight: 700;
                    font-family: var(--font);
                    cursor: pointer;
                    transition: all 0.15s ease;
                    border: none;
                }
                .ov-edit-cancel {
                    background: var(--surface-soft, #f1f5f9);
                    color: var(--slate);
                }
                .ov-edit-cancel:hover:not(:disabled) {
                    background: #e2e8f0;
                    color: var(--ink-deep);
                }
                .ov-edit-save {
                    background: #40B3E0;
                    color: #fff;
                }
                .ov-edit-save:hover:not(:disabled) {
                    background: #2ea8d8;
                    box-shadow: 0 4px 12px rgba(64,179,224,0.3);
                    transform: translateY(-1px);
                }
                .ov-edit-cancel:disabled, .ov-edit-save:disabled { opacity: 0.5; cursor: not-allowed; }

                /* ── Progress ─────────────────────────────────── */
                .ov-prog-list { display: flex; flex-direction: column; gap: var(--sp-5); }
                .ov-prog-group { display: flex; flex-direction: column; gap: 6px; }
                .ov-prog-row { display: flex; justify-content: space-between; align-items: center; }
                .ov-prog-label { font-size: 12px; font-weight: 600; color: var(--slate); }
                .ov-prog-count { font-size: 13px; }
                .ov-prog-count strong { color: var(--ink-deep); font-weight: 700; }
                .ov-prog-of { color: var(--slate); font-weight: 500; }
                .ov-empty { font-size: 12px; color: var(--slate); font-style: italic; }

                /* ── Tracker (removed) ────────────────────────── */

                @media (max-width: 700px) {
                    .ov-grid { grid-template-columns: 1fr; }
                    .ov-card--full { grid-column: 1; }
                }
            `}</style>
        </div>
    );
}
