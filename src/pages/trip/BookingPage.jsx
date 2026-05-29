import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getBookings, createBooking, updateBooking, deleteBooking, restoreBooking } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';

const CATS = [
    { id: 1, key: 'accommodation', label: 'Проживання', icon: '🏨', color: '#8B5CF6' },
    { id: 2, key: 'transport', label: 'Транспорт', icon: '✈️', color: '#0EA5E9' },
    { id: 3, key: 'food', label: 'Харчування', icon: '🍽️', color: '#F97316' },
    { id: 4, key: 'leisure', label: 'Дозвілля', icon: '🎭', color: '#EC4899' },
    { id: 5, key: 'shopping', label: 'Шопінг', icon: '🛍️', color: '#EF4444' },
    { id: 6, key: 'other', label: 'Інше', icon: '📌', color: '#9CA3AF' },
];

export default function BookingPage() {
    const { tripId } = useOutletContext();
    const [catFilter, setCatFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selTypeId, setSelTypeId] = useState(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [cost, setCost] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [note, setNote] = useState('');
    const [trash, setTrash] = useState([]);

    const { data, loading, refetch } = useApi(
        () => getBookings(tripId, { type_id: catFilter }),
        [tripId, catFilter]
    );
    const bookings = data?.data ?? data ?? [];

    const submit = async () => {
        // Обов'язкові лише категорія та час початку
        if (!selTypeId || !startAt) {
            toast('Заповніть обов\'язкові поля: категорія та початок', 'warning');
            return;
        }
        try {
            // Визначаємо назву: пріоритет у імені, потім адреса, потім назва категорії
            const catLabel = CATS.find(c => c.key === selTypeId)?.label || 'Бронювання';
            const finalName = name.trim() || address.trim() || catLabel;

            await createBooking(tripId, {
                name: finalName,
                type_id: selTypeId,
                address: address.trim() || '',
                cost: parseFloat(cost) || 0,
                start_at: startAt,
                end_at: endAt || null, 
                note: note || null,
                trips_id: tripId
            });
            setName(''); setAddress(''); setCost(''); setNote(''); setSelTypeId(null);
            setStartAt(''); setEndAt(''); setShowForm(false);
            toast('Бронювання збережено', 'success');
            refetch();
        } catch (err) { toast(err.message, 'error'); }
    };

    const remove = async (b) => {
        try { await deleteBooking(tripId, b.id); setTrash(t => [b, ...t]); refetch(); }
        catch (err) { toast(err.message, 'error'); }
    };

    const restore = async (b) => {
        try { await restoreBooking(tripId, b.id); setTrash(t => t.filter(x => x.id !== b.id)); refetch(); }
        catch (err) { toast(err.message, 'error'); }
    };

    return (
        <div className="booking-container">
            <div className="booking-header">
                <div>
                    <h2 className="booking-title">Бронювання</h2>
                    <p className="booking-sub">Готелі, квитки, ресторани та активності</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="btn btn--buy-cta btn--pill">
                    {showForm ? '✕ Скасувати' : '+ Додати'}
                </button>
            </div>

            {/* Category filter */}
            <div className="booking-filters">
                <span
                    onClick={() => setCatFilter('')}
                    className={`booking-chip ${catFilter === '' ? 'booking-chip--active-all' : ''}`}
                >
                    🗂️ Всі
                </span>
                {CATS.map(c => (
                    <span
                        key={c.id}
                        onClick={() => setCatFilter(catFilter === c.key ? '' : c.key)}
                        className={`booking-chip ${catFilter === c.key ? 'booking-chip--active' : ''}`}
                        style={catFilter === c.key ? { backgroundColor: c.color, borderColor: c.color } : {}}
                    >
                        {c.icon} {c.label}
                    </span>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="booking-form">
                    <p className="booking-form-label">Тип бронювання</p>
                    <div className="booking-form-cats">
                        {CATS.map(c => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelTypeId(c.key)}
                                className={`booking-form-cat-btn ${selTypeId === c.key ? 'booking-form-cat-btn--active' : ''}`}
                                style={selTypeId === c.key ? { borderColor: c.color, backgroundColor: `${c.color}15` } : {}}
                            >
                                <span className="cat-icon">{c.icon}</span>
                                <span className="cat-label" style={selTypeId === c.key ? { color: c.color } : {}}>{c.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="booking-form-fields">
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва (напр. Hilton Kyiv)" className="booking-input" />
                        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Адреса" className="booking-input" />

                        <div className="booking-form-row">
                            <div className="booking-form-group">
                                <label className="booking-field-label">Початок *</label>
                                <input type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} className="booking-input" />
                            </div>
                            <div className="booking-form-group">
                                <label className="booking-field-label">Кінець</label>
                                <input type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} className="booking-input" />
                            </div>
                        </div>

                        <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Вартість" className="booking-input" />
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Нотатки..." rows={2} className="booking-input booking-textarea" />
                        <button onClick={submit} className="btn btn--buy-cta btn--pill save-booking-btn">
                            Зберегти бронювання
                        </button>
                    </div>
                </div>
            )}

            {loading && <p className="booking-loading">Завантаження...</p>}

            {bookings.length === 0 && !loading ? (
                <EmptyState icon="📋" title="Бронювань ще немає" subtitle="Додайте перше бронювання для цієї подорожі" />
            ) : (
                <div className="booking-list">
                    {bookings.map(b => {
                        const cat = CATS.find(c => c.key === b.type_id) || CATS[5];
                        const dateStart = b.start_at ? new Date(b.start_at).toLocaleString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

                        return (
                            <div key={b.id} className="booking-item">
                                <span className="booking-item-icon">{cat.icon}</span>
                                <div className="booking-item-content">
                                    <div className="booking-item-top">
                                        <span className="booking-item-badge" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
                                            {cat.label}
                                        </span>
                                        <span className="booking-item-date">{dateStart}</span>
                                    </div>
                                    <span className="booking-item-title">{b.name || b.address}</span>
                                    {b.note && (
                                        <div className="booking-item-note">
                                            {b.note}
                                        </div>
                                    )}
                                </div>
                                {b.cost > 0 && <span className="booking-item-price">${b.cost}</span>}
                                <button onClick={() => remove(b)} className="booking-delete-btn" title="Видалити">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {trash.length > 0 && (
                <div className="booking-trash">
                    <p className="booking-trash-title">Нещодавно видалені ({trash.length})</p>
                    <div className="booking-trash-list">
                        {trash.map(b => (
                            <div key={b.id} className="booking-trash-item">
                                <span className="booking-trash-text">{b.address}</span>
                                <button onClick={() => restore(b)} className="btn btn--secondary btn--pill btn--sm restore-btn">
                                    Відновити
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .booking-container {
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    padding: var(--sp-6);
                    margin-top: var(--sp-5);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
                }
                .booking-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--sp-5);
                    flex-wrap: wrap;
                    gap: var(--sp-3);
                }
                .booking-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .booking-sub {
                    font-size: 13px;
                    color: var(--slate);
                    margin-top: 2px;
                }
                .booking-filters {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    margin-bottom: var(--sp-5);
                }
                .booking-chip {
                    font-family: var(--font);
                    font-size: 12px;
                    font-weight: 600;
                    padding: 6px 14px;
                    border-radius: var(--radius-full);
                    cursor: pointer;
                    background: var(--surface-soft);
                    color: var(--charcoal);
                    border: 1.5px solid var(--hairline-soft);
                    transition: all var(--t-fast);
                }
                .booking-chip--active-all {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                }
                .booking-chip--active {
                    color: #fff;
                }
                .booking-form {
                    background: var(--surface-soft);
                    border: 1.5px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    padding: var(--sp-5);
                    margin-bottom: var(--sp-5);
                }
                .booking-form-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: .8px;
                    color: var(--slate);
                    margin-bottom: var(--sp-3);
                }
                .booking-form-cats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
                    gap: 8px;
                    margin-bottom: var(--sp-4);
                }
                .booking-form-cat-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: var(--sp-3) var(--sp-2);
                    border: 1.5px solid var(--hairline);
                    border-radius: var(--radius-lg);
                    background: var(--canvas);
                    cursor: pointer;
                    transition: all var(--t-fast);
                    font-family: var(--font);
                }
                .booking-form-cat-btn .cat-icon {
                    font-size: 20px;
                }
                .booking-form-cat-btn .cat-label {
                    font-size: 11.5px;
                    font-weight: 600;
                    color: var(--charcoal);
                }
                .booking-form-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .booking-form-row {
                    display: flex;
                    gap: 12px;
                }
                .booking-form-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .booking-field-label {
                    font-size: 10px;
                    font-weight: 700;
                    color: var(--slate);
                    text-transform: uppercase;
                }
                .booking-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1.5px solid var(--hairline);
                    border-radius: var(--radius-lg);
                    font-family: var(--font);
                    font-size: 14px;
                    outline: none;
                    background: var(--canvas);
                    color: var(--ink-deep);
                    transition: border-color var(--t-fast);
                }
                .booking-input:focus {
                    border-color: var(--primary);
                }
                .booking-textarea {
                    resize: vertical;
                }
                .save-booking-btn {
                    padding: 12px;
                    font-weight: 600;
                    margin-top: 4px;
                }
                .booking-loading {
                    color: var(--slate);
                    text-align: center;
                    padding: var(--sp-5);
                }
                .booking-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .booking-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px var(--sp-4);
                    background: var(--canvas);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--hairline-soft);
                    transition: all var(--t-base);
                }
                .booking-item-icon {
                    font-size: 20px;
                }
                .booking-item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .booking-item-top {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .booking-item-badge {
                    font-size: 9px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                    text-transform: uppercase;
                }
                .booking-item-date {
                    font-size: 11px;
                    color: var(--slate);
                }
                .booking-item-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .booking-item-note {
                    font-size: 12px;
                    color: var(--slate);
                    margin-top: 4px;
                    line-height: 1.4;
                    font-style: italic;
                }
                .booking-item-price {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--primary-deep);
                }
                .booking-delete-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--slate);
                    display: flex;
                    align-items: center;
                    padding: var(--sp-1);
                    border-radius: var(--radius-sm);
                    transition: color var(--t-fast), background var(--t-fast);
                }
                .booking-delete-btn:hover {
                    color: #EF4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                .booking-trash {
                    margin-top: var(--sp-6);
                    padding-top: var(--sp-4);
                    border-top: 1px solid var(--hairline-soft);
                }
                .booking-trash-title {
                    font-size: 13px;
                    color: var(--slate);
                    font-weight: 600;
                    margin-bottom: var(--sp-2);
                }
                .booking-trash-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .booking-trash-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--surface-soft);
                    padding: var(--sp-2) var(--sp-3);
                    border-radius: var(--radius-lg);
                    opacity: 0.8;
                }
                .booking-trash-text {
                    font-size: 13px;
                    color: var(--charcoal);
                    text-decoration: line-through;
                }
                .restore-btn {
                    font-size: 11px;
                    padding: 4px 10px;
                }
            `}</style>
        </div>
    );
}
