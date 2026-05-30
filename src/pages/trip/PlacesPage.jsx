import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getPlaces, createPlace, deletePlace, restorePlace, updatePlace } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';

const CATS = ['Всі', 'Краєвиди', 'Архітектура', 'Їжа', 'Пляж', 'Інше'];

export default function PlacesPage() {
    const { tripId } = useOutletContext();
    const [newName, setNewName] = useState('');
    const [cat, setCat] = useState(CATS[0]);
    const [trash, setTrash] = useState([]);

    const { data, loading, refetch } = useApi(() => getPlaces(tripId), [tripId]);
    const places = data ?? [];

    const add = async () => {
        if (!newName.trim()) return;
        try {
            await createPlace(tripId, {
                name: newName.trim(),
                category: cat !== 'Всі' ? cat : 'Інше',
                visited: false, check: false
            });
            setNewName('');
            refetch();
            toast('Місце додано!', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    const toggle = async (place) => {
        const isVisited = !(place.visited || place.check);
        try {
            await updatePlace(tripId, place.id, { visited: isVisited, check: isVisited });
            refetch();
        } catch (err) { toast(err.message, 'error'); }
    };

    const remove = async (place) => {
        try {
            await deletePlace(tripId, place.id);
            setTrash(t => [place, ...t]);
            refetch();
            toast('Місце видалено', 'info');
        } catch (err) { toast(err.message, 'error'); }
    };

    const restore = async (place) => {
        try {
            await restorePlace(tripId, place.id);
            setTrash(t => t.filter(x => x.id !== place.id));
            refetch();
            toast('Місце відновлено!', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <div className="places-container">
            <div className="places-header">
                <div>
                    <h2 className="places-title">Місця для відвідування</h2>
                    <p className="places-sub">Плануйте та відмічайте відвідані місця</p>
                </div>
                <div className="places-add-form">
                    <input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && add()}
                        placeholder="Назва місця..."
                        className="form-input"
                    />
                    <select value={cat} onChange={e => setCat(e.target.value)} className="form-select">
                        {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={add} className="btn btn--buy-cta btn--pill">Додати</button>
                </div>
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Завантаження...</p>}

            {places.length === 0 && !loading ? (
                <EmptyState icon="📍" title="Місць немає" subtitle="Додайте перше цікаве місце" />
            ) : (
                <div className="places-grid">
                    {places.map(p => (
                        <div key={p.id} className={`place-card ${(p.visited || p.check) ? 'place-card--visited' : ''}`}>
                            <div className="place-card__main">
                                <div onClick={() => toggle(p)} className={`custom-checkbox ${(p.visited || p.check) ? 'custom-checkbox--checked' : ''}`}>
                                    {(p.visited || p.check) && '✓'}
                                </div>
                                <div className="place-info">
                                    <h4 className="place-name">{p.name}</h4>
                                    <span className="place-cat-tag">{p.category || 'Інше'}</span>
                                    {p.time_start && <span className="place-time">{p.time_start} - {p.time_end}</span>}
                                </div>
                                <div className="place-actions">
                                    <button onClick={() => remove(p)} className="del-btn" title="Видалити">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {p.note && <p className="place-note">{p.note}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/*  Нещодавно видалені  */}
            {trash.length > 0 && (
                <div className="places-trash">
                    <p className="places-trash__title">Нещодавно видалені ({trash.length})</p>
                    <div className="places-trash__list">
                        {trash.map(p => (
                            <div key={p.id} className="places-trash__item">
                                <span className="places-trash__icon">📍</span>
                                <span className="places-trash__text">{p.name}</span>
                                <button onClick={() => restore(p)} className="places-trash__restore">Відновити</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .places-container { background: var(--canvas); border: 1px solid var(--hairline-soft); border-radius: var(--radius-xl); padding: var(--sp-6); }
                .places-header { margin-bottom: var(--sp-6); }
                .places-title { font-size: 18px; font-weight: 600; color: var(--ink-deep); }
                .places-sub { font-size: 13px; color: var(--slate); margin-top: 2px; }
                .places-add-form { display: flex; gap: var(--sp-2); margin-top: var(--sp-4); flex-wrap: wrap; }
                .form-input { flex: 1; min-width: 160px; padding: 10px 14px; border: 1px solid var(--hairline); border-radius: var(--radius-lg); outline: none; font-family: var(--font); font-size: 14px; background: var(--canvas); color: var(--ink-deep); transition: border-color 0.15s; }
                .form-input:focus { border-color: #40B3E0; }
                .form-select { padding: 0 10px; border-radius: var(--radius-lg); border: 1px solid var(--hairline); font-family: var(--font); font-size: 13px; background: var(--canvas); color: var(--ink-deep); outline: none; cursor: pointer; }
                .places-grid { display: flex; flex-direction: column; gap: var(--sp-3); }
                .place-card { background: var(--canvas); border: 1px solid var(--hairline-soft); border-radius: var(--radius-lg); padding: var(--sp-4); transition: opacity 0.2s ease; }
                .place-card--visited { opacity: 0.55; background: var(--surface-soft); }
                .place-card--visited .place-name { text-decoration: line-through; text-decoration-thickness: 1px; color: var(--slate); font-weight: 500; }
                .place-card__main { display: flex; align-items: center; gap: var(--sp-3); }
                .custom-checkbox { width: 18px; height: 18px; border: 2px solid var(--hairline); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: var(--success); flex-shrink: 0; }
                .custom-checkbox--checked { background: var(--success-soft); border-color: var(--success); }
                .place-info { flex: 1; }
                .place-name { font-size: 15px; font-weight: 600; margin: 0; }
                .place-cat-tag { font-size: 11px; color: var(--slate); background: var(--surface-soft); padding: 2px 6px; border-radius: 4px; margin-right: 8px; }
                .place-time { font-size: 11px; color: var(--primary); }
                .place-actions { display: flex; gap: 8px; align-items: center; }
                .del-btn { background: none; border: none; cursor: pointer; color: var(--slate); display: flex; align-items: center; padding: 4px; border-radius: var(--radius-sm); transition: color 0.15s, background 0.15s; }
                .del-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
                .place-note { font-size: 12px; color: var(--slate); margin-top: 8px; border-top: 1px solid var(--hairline-soft); padding-top: 4px; margin-bottom: 0; }

                /* ── Trash ── */
                .places-trash { margin-top: var(--sp-6); padding-top: var(--sp-4); border-top: 1px solid var(--hairline-soft); }
                .places-trash__title { font-size: 13px; color: var(--slate); font-weight: 600; margin-bottom: var(--sp-2); }
                .places-trash__list { display: flex; flex-direction: column; gap: 6px; }
                .places-trash__item { display: flex; align-items: center; gap: 8px; background: var(--surface-soft); padding: var(--sp-2) var(--sp-3); border-radius: var(--radius-lg); opacity: 0.8; }
                .places-trash__icon { font-size: 14px; flex-shrink: 0; }
                .places-trash__text { font-size: 13px; color: var(--charcoal); text-decoration: line-through; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .places-trash__restore { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: var(--radius-full); border: 1.5px solid var(--hairline); background: var(--canvas); color: var(--primary); cursor: pointer; white-space: nowrap; font-family: var(--font); transition: all 0.15s ease; flex-shrink: 0; }
                .places-trash__restore:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
            `}</style>
        </div>
    );
}
