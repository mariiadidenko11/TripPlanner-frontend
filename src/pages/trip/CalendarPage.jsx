import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getBookings } from '@/api/api';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const MONTHS = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

// Оформлення категорій бронювань (лише для вигляду: іконка / колір / підпис).
// Кольори / іконки / підписи категорій бронювань.
// Базові ключі повністю збігаються з CATS на сторінці BookingPage,
// тож календар показує ТІ САМІ кольори та категорії. Додано кілька
// поширених синонімів (hotel, restaurant, activity...) — лише для вигляду.
// Сам type бронювання НЕ змінюється — береться оригінальний з даних.
const BOOKING_CATS = {
    // ── базові (як у BookingPage.CATS) ──
    accommodation: { label: 'Проживання', icon: '🏨', color: '#8B5CF6' },
    transport: { label: 'Транспорт', icon: '✈️', color: '#0EA5E9' },
    food: { label: 'Харчування', icon: '🍽️', color: '#F97316' },
    leisure: { label: 'Дозвілля', icon: '🎭', color: '#EC4899' },
    shopping: { label: 'Шопінг', icon: '🛍️', color: '#EF4444' },
    other: { label: 'Інше', icon: '📌', color: '#9CA3AF' },
    // ── синоніми / альтернативні ключі (той самий вигляд) ──
    hotel: { label: 'Проживання', icon: '🏨', color: '#8B5CF6' },
    flight: { label: 'Транспорт', icon: '✈️', color: '#0EA5E9' },
    restaurant: { label: 'Харчування', icon: '🍽️', color: '#F97316' },
    activity: { label: 'Дозвілля', icon: '🎭', color: '#EC4899' },
};

// Категорія береться з оригінальних даних: бек віддає `type`,
// мок-дані використовують `type_id` — читаємо обидва, нічого не вигадуючи.
function bookingType(b) {
    return b.type ?? b.type_id ?? 'other';
}

// Повертає оформлення для типу. Якщо тип невідомий (кастомний) —
// показуємо його оригінальну назву з нейтральним кольором/іконкою.
function catMeta(type) {
    if (type && BOOKING_CATS[type]) return BOOKING_CATS[type];
    return { label: type || 'Бронювання', icon: '📌', color: '#9CA3AF' };
}

// Локальний YYYY-MM-DD (без зсуву часового поясу, який дає toISOString)
function toKey(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatTime(value) {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d)) return null;
    return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
}

export default function CalendarPage() {
    const { tripId, trip } = useOutletContext();

    // Лише бронювання
    const { data: bookingsData } = useApi(() => getBookings(tripId), [tripId]);
    const bookings = bookingsData ?? [];

    // Стан календаря
    const [viewDate, setViewDate] = useState(() => {
        if (trip?.start_at) return new Date(trip.start_at);
        return new Date();
    });
    const [selectedKey, setSelectedKey] = useState(null); // обраний день (модалка)

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // ── Бронювання за днями ──────────────────────────────────────
    // Правило: бронювання без дати (start_at) у календарі НЕ показуємо.
    const bookingsByDay = useMemo(() => {
        const map = {};
        bookings.forEach(b => {
            if (!b.start_at) return; // без дати — пропускаємо
            const key = toKey(b.start_at);
            const type = bookingType(b); // оригінальний type (бек) або type_id (мок)
            (map[key] ||= []).push({
                id: b.id,
                type,                    // зберігаємо як є, без підміни
                title: b.name || b.address || catMeta(type).label,
                time: formatTime(b.start_at),
                address: b.address || '',
                note: b.note || '',
                cost: b.cost || 0,
            });
        });
        return map;
    }, [bookings]);

    const bookingsForKey = (key) => bookingsByDay[key] ?? [];

    // ── Сітка днів місяця ────────────────────────────────────────
    const daysInMonth = useMemo(() => {
        const date = new Date(year, month, 1);
        const days = [];

        let firstDay = date.getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            days.push({ day: prevMonthLastDay - i + 1, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) });
        }
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
        }
        return days;
    }, [year, month]);

    const changeMonth = (offset) => {
        setViewDate(new Date(year, month + offset, 1));
        setSelectedKey(null);
    };

    const isTripDay = (date) => {
        if (!trip?.start_at || !trip?.end_at) return false;
        const d = new Date(date).setHours(0, 0, 0, 0);
        const s = new Date(trip.start_at).setHours(0, 0, 0, 0);
        const e = new Date(trip.end_at).setHours(0, 0, 0, 0);
        return d >= s && d <= e;
    };

    // Дані для модального вікна обраного дня
    const selectedBookings = selectedKey ? bookingsForKey(selectedKey) : [];
    const selectedDateLabel = selectedKey
        ? new Date(selectedKey + 'T00:00:00').toLocaleDateString('uk-UA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '';

    return (
        <div className="calendar-page">
            <div className="calendar-card">
                <header className="calendar-header">
                    <div className="calendar-nav">
                        <button onClick={() => changeMonth(-1)} className="cal-nav-btn" aria-label="Попередній місяць">←</button>
                        <h2 className="cal-current-month">{MONTHS[month]} {year}</h2>
                        <button onClick={() => changeMonth(1)} className="cal-nav-btn" aria-label="Наступний місяць">→</button>
                    </div>
                    <div className="cal-legend">
                        <span className="legend-item"><i style={{ background: 'rgba(64, 179, 224, 0.15)' }} /> Дні поїздки</span>
                        <span className="legend-item"><i style={{ background: '#8B5CF6' }} /> Бронювання</span>
                    </div>
                </header>

                <div className="calendar-grid">
                    {WEEKDAYS.map(d => <div key={d} className="cal-weekday">{d}</div>)}
                    {daysInMonth.map((d, i) => {
                        const key = toKey(d.date);
                        const tripActive = isTripDay(d.date);
                        const dayBookings = bookingsForKey(key);
                        const isToday = d.date.toDateString() === new Date().toDateString();
                        const has = dayBookings.length > 0;

                        // Акцентний колір дня = колір першого (домінуючого) бронювання.
                        // Для днів поїздки без бронювань — фірмовий primary.
                        const dayAccent = has
                            ? catMeta(dayBookings[0].type).color
                            : (tripActive ? '#40B3E0' : null);

                        return (
                            <div
                                key={i}
                                className={`cal-day ${!d.currentMonth ? 'cal-day--other' : ''} ${tripActive ? 'cal-day--trip' : ''} ${isToday ? 'cal-day--today' : ''} ${has ? 'cal-day--clickable cal-day--has' : ''}`}
                                style={dayAccent ? { '--day-accent': dayAccent } : undefined}
                                onClick={has ? () => setSelectedKey(key) : undefined}
                                role={has ? 'button' : undefined}
                                tabIndex={has ? 0 : undefined}
                                onKeyDown={has ? (e) => { if (e.key === 'Enter') setSelectedKey(key); } : undefined}
                            >
                                {has && <span className="cal-day-glow" aria-hidden="true" />}
                                <div className="cal-day-top">
                                    <span className="cal-day-num">{d.day}</span>
                                    {has && <span className="cal-day-count">{dayBookings.length}</span>}
                                </div>

                                <div className="cal-events">
                                    {dayBookings.slice(0, 3).map((b, idx) => {
                                        const meta = catMeta(b.type);
                                        return (
                                            <div
                                                key={idx}
                                                className="cal-event-chip"
                                                style={{ '--chip': meta.color }}
                                                title={`${meta.label}: ${b.title}`}
                                            >
                                                <span className="cal-event-ic">{meta.icon}</span>
                                                <span className="cal-event-tx">{b.title}</span>
                                            </div>
                                        );
                                    })}
                                    {dayBookings.length > 3 && (
                                        <span className="cal-event-more">+{dayBookings.length - 3} ще</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Модальне вікно дня ─────────────────────────────── */}
            {selectedKey && (
                <div className="cal-modal-overlay" onClick={() => setSelectedKey(null)}>
                    <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cal-modal-head">
                            <button className="cal-back-btn" onClick={() => setSelectedKey(null)} type="button">
                                ← Назад до календаря
                            </button>
                            <button className="cal-close-btn" onClick={() => setSelectedKey(null)} aria-label="Закрити" type="button">×</button>
                        </div>

                        <h3 className="cal-modal-title">{selectedDateLabel}</h3>
                        <p className="cal-modal-sub">
                            {selectedBookings.length} {selectedBookings.length === 1 ? 'бронювання' : 'бронювань'} цього дня
                        </p>

                        <div className="cal-modal-body">
                            {selectedBookings.length === 0 && (
                                <p className="cal-empty">Немає бронювань цього дня.</p>
                            )}

                            <ul className="cal-group-list">
                                {selectedBookings.map((b, idx) => {
                                    const meta = catMeta(b.type);
                                    return (
                                        <li key={idx} className="cal-item" style={{ '--item': meta.color, borderLeftColor: meta.color }}>
                                            <div className="cal-item-main">
                                                <span className="cal-item-title">
                                                    <span className="cal-item-ic">{meta.icon}</span> {b.title}
                                                </span>
                                                {b.time && <span className="cal-item-time">{b.time}</span>}
                                            </div>
                                            {/* Категорія — показуємо оригінальний type як є */}
                                            <div className="cal-item-cat" style={{ color: meta.color }}>
                                                {meta.label}
                                                <span className="cal-item-type-raw">({b.type || 'other'})</span>
                                            </div>
                                            {b.address && <div className="cal-item-sub">{b.address}</div>}
                                            {b.note && <div className="cal-item-note">{b.note}</div>}
                                            {b.cost > 0 && (
                                                <div className="cal-item-cost">${Number(b.cost).toLocaleString()}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .calendar-page {
                    animation: calFade 0.4s cubic-bezier(0.16,1,0.3,1);
                }

                /* ── Картка календаря: лёгкий glass + м'яка тінь ── */
                .calendar-card {
                    position: relative;
                    background:
                        radial-gradient(120% 120% at 0% 0%, rgba(64,179,224,0.05) 0%, rgba(64,179,224,0) 42%),
                        radial-gradient(120% 120% at 100% 0%, rgba(139,92,246,0.045) 0%, rgba(139,92,246,0) 46%),
                        var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xxl);
                    padding: var(--sp-6);
                    box-shadow:
                        0 1px 2px rgba(16,24,40,0.04),
                        0 12px 32px -12px rgba(16,24,40,0.12);
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--sp-6);
                    flex-wrap: wrap;
                    gap: var(--sp-4);
                }
                .calendar-nav { display: flex; align-items: center; gap: var(--sp-3); }
                .cal-nav-btn {
                    width: 36px; height: 36px; border-radius: var(--radius-full);
                    border: 1px solid var(--hairline-soft);
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    cursor: pointer;
                    transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s, color 0.2s, border-color 0.2s, background 0.2s;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; color: var(--slate);
                }
                .cal-nav-btn:hover {
                    border-color: transparent;
                    color: var(--primary);
                    background: var(--canvas);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px -6px rgba(64,179,224,0.45);
                }
                .cal-nav-btn:active { transform: translateY(0) scale(0.96); }
                .cal-current-month {
                    font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
                    color: var(--ink-deep); min-width: 168px; text-align: center;
                }

                .cal-legend { display: flex; gap: var(--sp-4); flex-wrap: wrap; }
                .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--slate); font-weight: 600; }
                .legend-item i { width: 11px; height: 11px; border-radius: var(--radius-sm); display: inline-block; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }

                /* ── Сітка ── */
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }
                .cal-weekday {
                    padding: 10px 0 12px;
                    text-align: center;
                    font-size: 11px; font-weight: 700; color: var(--slate);
                    text-transform: uppercase; letter-spacing: 0.08em;
                }

                /* ── День ── */
                .cal-day {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-lg);
                    min-height: 108px;
                    padding: 9px;
                    display: flex; flex-direction: column; gap: 6px;
                    transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, border-color 0.22s;
                    animation: dayPop 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .cal-day--other {
                    background: transparent;
                    border-color: transparent;
                    opacity: 0.4;
                }
                .cal-day--other .cal-day-num { color: var(--slate); font-weight: 500; }

                /* День поїздки (без бронювань) — рівний фірмовий фон, трохи темніший */
                .cal-day--trip {
                    background: rgba(64,179,224,0.16);
                    border-color: rgba(64,179,224,0.30);
                }

                /* День з подіями — premium градієнт у кольорі категорії */
                .cal-day--has {
                    background:
                        linear-gradient(160deg,
                            color-mix(in srgb, var(--day-accent) 16%, var(--canvas)) 0%,
                            color-mix(in srgb, var(--day-accent) 6%, var(--canvas)) 55%,
                            var(--canvas) 100%);
                    border-color: color-mix(in srgb, var(--day-accent) 30%, var(--hairline-soft));
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.6),
                        0 6px 18px -12px color-mix(in srgb, var(--day-accent) 60%, transparent);
                }
                /* Тонка кольорова смужка зверху */
                .cal-day--has::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg,
                        color-mix(in srgb, var(--day-accent) 85%, transparent),
                        color-mix(in srgb, var(--day-accent) 35%, transparent));
                    z-index: 2;
                }
                /* М'яке свечение в куті */
                .cal-day-glow {
                    position: absolute; z-index: 0;
                    width: 90px; height: 90px; right: -28px; top: -28px;
                    border-radius: 50%;
                    background: radial-gradient(circle, color-mix(in srgb, var(--day-accent) 30%, transparent) 0%, transparent 70%);
                    filter: blur(8px);
                    opacity: 0.8;
                    pointer-events: none;
                }

                .cal-day--clickable { cursor: pointer; }
                .cal-day--clickable:hover {
                    transform: translateY(-3px);
                    border-color: color-mix(in srgb, var(--day-accent) 45%, var(--hairline-soft));
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.7),
                        0 14px 30px -14px color-mix(in srgb, var(--day-accent) 70%, transparent);
                }
                .cal-day--clickable:active { transform: translateY(-1px) scale(0.995); }

                /* Сьогодні */
                .cal-day--today { border-color: var(--primary); }
                .cal-day--today .cal-day-num {
                    background: linear-gradient(135deg, var(--primary), var(--primary-deep));
                    color: #fff;
                    width: 24px; height: 24px; display: flex;
                    align-items: center; justify-content: center;
                    border-radius: 50%; font-size: 12px; font-weight: 700;
                    box-shadow: 0 3px 8px -2px rgba(64,179,224,0.6);
                }

                .cal-day-top { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
                .cal-day-num { font-size: 14px; font-weight: 700; color: var(--ink-deep); letter-spacing: -0.01em; }
                .cal-day-count {
                    font-size: 10px; font-weight: 800;
                    color: color-mix(in srgb, var(--day-accent) 75%, var(--ink-deep));
                    background: rgba(255,255,255,0.75);
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    border-radius: var(--radius-full);
                    padding: 2px 8px; min-width: 20px; text-align: center;
                    box-shadow: 0 1px 3px rgba(16,24,40,0.1);
                }

                .cal-events { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
                .cal-event-chip {
                    display: flex; align-items: center; gap: 5px;
                    padding: 3px 7px; border-radius: var(--radius-sm);
                    font-size: 11px; font-weight: 600;
                    white-space: nowrap; overflow: hidden;
                    color: color-mix(in srgb, var(--chip) 78%, var(--ink-deep));
                    background: color-mix(in srgb, var(--chip) 14%, var(--canvas));
                    border: 1px solid color-mix(in srgb, var(--chip) 22%, transparent);
                    transition: transform 0.18s ease, background 0.18s ease;
                }
                .cal-day--clickable:hover .cal-event-chip {
                    background: color-mix(in srgb, var(--chip) 22%, var(--canvas));
                }
                .cal-event-ic { font-size: 11px; flex-shrink: 0; }
                .cal-event-tx { overflow: hidden; text-overflow: ellipsis; }
                .cal-event-more { font-size: 10px; color: var(--slate); font-weight: 700; padding-left: 3px; }

                /* ── Модальне вікно ── */
                .cal-modal-overlay {
                    position: fixed; inset: 0; z-index: 1000;
                    background: rgba(5,5,5,0.42);
                    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    padding: var(--sp-4); animation: calFade 0.22s ease-out;
                }
                .cal-modal {
                    position: relative;
                    background:
                        radial-gradient(120% 80% at 50% 0%, rgba(64,179,224,0.06) 0%, rgba(64,179,224,0) 60%),
                        var(--canvas);
                    width: 100%; max-width: 560px;
                    max-height: 85vh; overflow-y: auto;
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xxl); padding: var(--sp-6);
                    box-shadow: 0 30px 80px -24px rgba(16,24,40,0.45);
                    animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1);
                }
                .cal-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-4); }
                .cal-back-btn {
                    display: inline-flex; align-items: center; gap: 4px;
                    background: none; border: none; cursor: pointer;
                    font-size: 13px; font-weight: 700; color: var(--primary);
                    padding: 6px 0; transition: gap 0.18s ease, opacity 0.18s ease;
                }
                .cal-back-btn:hover { gap: 8px; opacity: 0.8; }
                .cal-close-btn {
                    width: 32px; height: 32px; border-radius: 50%;
                    border: 1px solid var(--hairline-soft); background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
                    font-size: 20px; line-height: 1; color: var(--slate); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.18s ease, color 0.18s ease, background 0.18s ease;
                }
                .cal-close-btn:hover { background: var(--surface-soft); color: var(--ink-deep); transform: rotate(90deg); }

                .cal-modal-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink-deep); text-transform: capitalize; }
                .cal-modal-sub { font-size: 13px; color: var(--slate); margin-top: 3px; margin-bottom: var(--sp-5); }

                .cal-group-list { list-style: none; display: flex; flex-direction: column; gap: var(--sp-3); }
                .cal-item {
                    position: relative; overflow: hidden;
                    background:
                        linear-gradient(160deg, color-mix(in srgb, var(--item, var(--primary)) 9%, var(--canvas)) 0%, var(--canvas) 70%);
                    border: 1px solid var(--hairline-soft);
                    border-left: 3px solid var(--item, var(--primary));
                    border-radius: var(--radius-lg); padding: 13px 15px;
                    animation: dayPop 0.35s cubic-bezier(0.16,1,0.3,1) both;
                    transition: transform 0.18s ease, box-shadow 0.18s ease;
                }
                .cal-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 26px -16px color-mix(in srgb, var(--item, var(--primary)) 70%, transparent);
                }
                .cal-item-main { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
                .cal-item-title { font-size: 14.5px; font-weight: 700; color: var(--ink-deep); letter-spacing: -0.01em; }
                .cal-item-ic { font-size: 14px; }
                .cal-item-time {
                    font-size: 12px; font-weight: 700;
                    color: color-mix(in srgb, var(--item, var(--primary)) 70%, var(--ink-deep));
                    background: color-mix(in srgb, var(--item, var(--primary)) 12%, var(--canvas));
                    padding: 2px 9px; border-radius: var(--radius-full);
                    flex-shrink: 0;
                }
                .cal-item-cat { font-size: 12px; font-weight: 700; margin-top: 5px; display: flex; align-items: center; gap: 6px; }
                .cal-item-type-raw { font-size: 11px; color: var(--slate); font-weight: 500; }
                .cal-item-sub { font-size: 12.5px; color: var(--slate); margin-top: 5px; line-height: 1.45; }
                .cal-item-note { font-size: 12.5px; color: var(--slate); margin-top: 6px; font-style: italic; line-height: 1.5; }
                .cal-item-cost { font-size: 14px; font-weight: 800; color: var(--ink-deep); margin-top: 7px; letter-spacing: -0.01em; }
                .cal-empty { font-size: 13px; color: var(--slate); text-align: center; padding: var(--sp-8) 0; }

                @media (max-width: 768px) {
                    .calendar-card { padding: var(--sp-4); border-radius: var(--radius-xl); }
                    .calendar-header { flex-direction: column; align-items: flex-start; }
                    .calendar-grid { gap: 4px; }
                    .cal-day { min-height: 68px; padding: 6px; gap: 4px; border-radius: var(--radius-md); }
                    .cal-day-glow { width: 60px; height: 60px; right: -20px; top: -20px; }
                    .cal-weekday { padding: 6px 0 8px; font-size: 10px; }
                    .cal-event-chip { padding: 2px 5px; font-size: 9px; }
                    .cal-event-tx { display: none; }
                    .cal-event-ic { font-size: 12px; }
                    .cal-day-num { font-size: 13px; }
                    .cal-day-count { font-size: 9px; padding: 1px 6px; }
                    .cal-modal { padding: var(--sp-5); max-height: 90vh; border-radius: var(--radius-xl); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .calendar-page, .cal-day, .cal-item, .cal-modal { animation: none !important; }
                    .cal-day, .cal-nav-btn, .cal-item, .cal-close-btn { transition: none !important; }
                }

                @keyframes calFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dayPop { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}
