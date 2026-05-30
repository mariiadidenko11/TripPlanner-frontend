import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getTrips, getBookings } from '@/api/api';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const MONTHS = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];
const MONTHS_SHORT = [
    'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
    'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'
];

// ── Кольори за ТИПОМ події (trip / booking / майбутні tasks) ──
const EVENT_TYPE = {
    trip: { label: 'Подорож', color: '#40B3E0', icon: '🧳' },
    booking: { label: 'Бронювання', color: '#8B5CF6', icon: '📌' },
    task: { label: 'Завдання', color: '#22C55E', icon: '✅' }, // future-ready
};

// Унікальний м'який колір для КОЖНОЇ подорожі (детермінований за id).
// Преміальна палітра: фіксована насиченість/світлота, варіюємо лише відтінок (HSL),
// тож кольори завжди приглушені й акуратні, не кричущі.
function tripColor(id) {
    const str = String(id ?? '');
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    const hue = hash % 360;            // унікальний відтінок
    return `hsl(${hue}, 62%, 58%)`;    // спокійна насиченість/світлота
}

// Оформлення категорій бронювань (іконка/колір залежно від типу брони)
const BOOKING_CATS = {
    // основні категорії (значення з БД reservation_type)
    'Проживання': { icon: '🏨', color: '#8B5CF6' },
    'Транспорт': { icon: '✈️', color: '#0EA5E9' },
    'Харчування': { icon: '🍽️', color: '#F97316' },
    'Дозвілля': { icon: '🎭', color: '#EC4899' },
    'Шопінг': { icon: '🛍️', color: '#EF4444' },
    'Інше': { icon: '📌', color: '#9CA3AF' },
    // синоніми / альтернативні значення
    'Готель': { icon: '🏨', color: '#8B5CF6' },
    'Літак': { icon: '✈️', color: '#0EA5E9' },
    accommodation: { icon: '🏨', color: '#8B5CF6' },
    transport: { icon: '✈️', color: '#0EA5E9' },
    food: { icon: '🍽️', color: '#F97316' },
    leisure: { icon: '🎭', color: '#EC4899' },
    shopping: { icon: '🛍️', color: '#EF4444' },
    other: { icon: '📌', color: '#9CA3AF' },
};
function bookingCat(type) {
    return BOOKING_CATS[type] || { icon: '📌', color: '#8B5CF6' };
}

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
// Перелік ключів днів [start..end] включно (для подій-діапазонів, напр. подорожей)
function dayRangeKeys(start, end) {
    const s = new Date(start); s.setHours(0, 0, 0, 0);
    const e = end ? new Date(end) : new Date(start); e.setHours(0, 0, 0, 0);
    if (isNaN(s) || isNaN(e) || e < s) return [toKey(start)];
    const keys = [];
    const cur = new Date(s);
    // запобіжник проти величезних діапазонів
    let guard = 0;
    while (cur <= e && guard < 1000) {
        keys.push(toKey(cur));
        cur.setDate(cur.getDate() + 1);
        guard++;
    }
    return keys;
}

export default function CalendarPage() {
    const navigate = useNavigate();

    // 1) Усі подорожі
    const { data: tripsData } = useApi(() => getTrips(), []);
    const trips = useMemo(() => tripsData ?? [], [tripsData]);

    // 2) Бронювання з усіх подорожей
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        let cancelled = false;
        if (!trips.length) { setBookings([]); return; }
        Promise.all(
            trips.map(t =>
                getBookings(t.id)
                    .then(list => (list ?? []).map(b => ({ ...b, tripId: t.id, tripName: t.name })))
                    .catch(() => [])
            )
        ).then(res => { if (!cancelled) setBookings(res.flat()); });
        return () => { cancelled = true; };
    }, [trips]);

    // 3) ЄДИНИЙ список подій { id, title, start, end, type, color, sourceId }
    const events = useMemo(() => {
        const list = [];
        // подорожі
        const TRIP_ACTIVE_COLOR = '#22C55E'; // «у процесі» → зелений усюди
        trips.forEach(t => {
            if (!t.start_at) return;
            const isActive = t.status === 'active';
            list.push({
                id: `trip-${t.id}`,
                title: t.name || 'Подорож',
                start: t.start_at,
                end: t.end_at || t.start_at,
                type: 'trip',
                // активна подорож — завжди зелена; інші — унікальний відтінок за id
                color: isActive ? TRIP_ACTIVE_COLOR : tripColor(t.id),
                status: t.status,
                sourceId: t.id,
            });
        });
        // бронювання
        bookings.forEach(b => {
            if (!b.start_at) return;
            const cat = bookingCat(b.type);
            list.push({
                id: `booking-${b.id}`,
                title: b.name || b.address || 'Бронювання',
                start: b.start_at,
                end: b.end_at || b.start_at,
                type: 'booking',
                color: cat.color,          // колір за категорією брони
                icon: cat.icon,
                sourceId: b.id,
                tripId: b.tripId,
                tripName: b.tripName,
                cost: b.cost || 0,
                note: b.note || '',
                address: b.address || '',
                rawType: b.type,
            });
        });
        return list;
    }, [trips, bookings]);

    // 4) Агрегація подій по днях (performance-friendly: один прохід, Map)
    const eventsByDay = useMemo(() => {
        const map = {};
        events.forEach(ev => {
            if (ev.type === 'trip') {
                // подорож — діапазон днів
                dayRangeKeys(ev.start, ev.end).forEach(k => (map[k] ||= []).push(ev));
            } else {
                (map[toKey(ev.start)] ||= []).push(ev);
            }
        });
        // у кожному дні: спершу подорожі, потім бронювання (стабільний порядок)
        Object.values(map).forEach(arr => arr.sort((a, b) => (a.type === b.type ? 0 : a.type === 'trip' ? -1 : 1)));
        return map;
    }, [events]);

    const eventsForKey = (key) => eventsByDay[key] ?? [];
    const bookingsForKey = (key) => (eventsByDay[key] ?? []).filter(e => e.type === 'booking');

    const [viewDate, setViewDate] = useState(new Date());
    const [selectedKey, setSelectedKey] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Відкриття вибору місяця/року
    const openPicker = () => { setPickerYear(year); setPickerOpen(true); };
    const pickMonth = (m) => {
        setViewDate(new Date(pickerYear, m, 1));
        setSelectedKey(null);
        setPickerOpen(false);
    };
    const goToday = () => {
        const now = new Date();
        setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
        setSelectedKey(null);
        setPickerOpen(false);
    };

    const daysInMonth = useMemo(() => {
        const days = [];
        // Реальний день тижня 1-го числа (0=Нд..6=Сб) → робимо тиждень з понеділка
        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;
        // Хвіст попереднього місяця (реальні дати)
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            days.push({ day: prevMonthLastDay - i + 1, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) });
        }
        // Дні поточного місяця — кількість визначає JS Date (28/29/30/31, високосні автоматично)
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }
        // Динамічна кількість рядків (4/5/6) — добиваємо до повного тижня, як у реальному календарі
        const totalCells = Math.ceil(days.length / 7) * 7;
        let nextDay = 1;
        while (days.length < totalCells) {
            days.push({ day: nextDay, currentMonth: false, date: new Date(year, month + 1, nextDay) });
            nextDay++;
        }
        return days;
    }, [year, month]);

    // Розбиваємо на тижні (рядки по 7 днів)
    const weeks = useMemo(() => {
        const w = [];
        for (let i = 0; i < daysInMonth.length; i += 7) w.push(daysInMonth.slice(i, i + 7));
        return w;
    }, [daysInMonth]);

    // Сегменти подорожей по тижнях: для кожного тижня — суцільні смуги (start col → end col),
    // з округленими краями лише на справжньому початку/кінці подорожі. Розкладаємо по «доріжках»
    // (lanes), щоб смуги не накладались.
    const tripSegmentsByWeek = useMemo(() => {
        const tripEvents = events.filter(e => e.type === 'trip');
        const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
        return weeks.map(week => {
            const weekStart = startOfDay(week[0].date);
            const weekEnd = startOfDay(week[6].date);
            const segs = [];
            tripEvents.forEach(ev => {
                const s = startOfDay(ev.start);
                const e = startOfDay(ev.end);
                if (e < weekStart || s > weekEnd) return; // не перетинає цей тиждень
                // індекси колонок у межах тижня (0..6)
                let startCol = 0, endCol = 6;
                for (let i = 0; i < 7; i++) {
                    if (startOfDay(week[i].date) === Math.max(s, weekStart)) startCol = i;
                    if (startOfDay(week[i].date) === Math.min(e, weekEnd)) endCol = i;
                }
                // якщо межі поза тижнем — приліплюємо до краю
                if (s < weekStart) startCol = 0;
                if (e > weekEnd) endCol = 6;
                segs.push({
                    ev,
                    startCol, endCol,
                    isStart: s >= weekStart,   // справжній початок подорожі в цьому тижні
                    isEnd: e <= weekEnd,       // справжній кінець у цьому тижні
                });
            });
            // розкладка по lanes (жадібно), щоб смуги не перетинались
            segs.sort((a, b) => a.startCol - b.startCol || (b.endCol - b.startCol) - (a.endCol - a.startCol));
            const laneEnds = []; // остання зайнята колонка кожної доріжки
            segs.forEach(seg => {
                let lane = 0;
                while (lane < laneEnds.length && laneEnds[lane] >= seg.startCol) lane++;
                laneEnds[lane] = seg.endCol;
                seg.lane = lane;
            });
            return segs;
        });
    }, [weeks, events]);

    const changeMonth = (offset) => {
        setViewDate(new Date(year, month + offset, 1));
        setSelectedKey(null);
    };

    // Перехід у відповідну сутність
    const openEvent = (ev) => {
        if (ev.type === 'trip') navigate(`/trips/${ev.sourceId}/overview`);
        else if (ev.type === 'booking') navigate(`/trips/${ev.tripId}/booking`);
    };

    const selectedEvents = selectedKey ? eventsForKey(selectedKey) : [];
    const selectedDateLabel = selectedKey
        ? new Date(selectedKey + 'T00:00:00').toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '';

    return (
        <div className="container page calendar-page">
            <div className="cal-head-row">
                <div>
                    <h1 className="cal-page-title">Календар</h1>
                    <p className="cal-page-sub">Усі подорожі та бронювання в одному місці.</p>
                </div>
            </div>

            <div className="calendar-card">
                <header className="calendar-header">
                    <div className="calendar-nav">
                        <button onClick={() => changeMonth(-1)} className="cal-nav-btn" aria-label="Попередній місяць">←</button>
                        <div className="cal-month-wrap">
                            <button
                                className={`cal-current-month cal-month-btn ${pickerOpen ? 'cal-month-btn--open' : ''}`}
                                onClick={() => (pickerOpen ? setPickerOpen(false) : openPicker())}
                                aria-haspopup="true"
                                aria-expanded={pickerOpen}
                            >
                                {MONTHS[month]} {year}
                                <span className="cal-month-caret" aria-hidden="true">▾</span>
                            </button>

                            {pickerOpen && (
                                <>
                                    <div className="cal-picker-backdrop" onClick={() => setPickerOpen(false)} />
                                    <div className="cal-picker" role="dialog" aria-label="Вибір місяця та року">
                                        <div className="cal-picker-head">
                                            <button className="cal-picker-yr-btn" onClick={() => setPickerYear(y => y - 1)} aria-label="Попередній рік">←</button>
                                            <span className="cal-picker-yr">{pickerYear}</span>
                                            <button className="cal-picker-yr-btn" onClick={() => setPickerYear(y => y + 1)} aria-label="Наступний рік">→</button>
                                        </div>
                                        <div className="cal-picker-grid">
                                            {MONTHS_SHORT.map((mLabel, mi) => {
                                                const isCurrent = mi === month && pickerYear === year;
                                                const now = new Date();
                                                const isThisMonth = mi === now.getMonth() && pickerYear === now.getFullYear();
                                                return (
                                                    <button
                                                        key={mi}
                                                        className={`cal-picker-m ${isCurrent ? 'cal-picker-m--active' : ''} ${isThisMonth && !isCurrent ? 'cal-picker-m--today' : ''}`}
                                                        onClick={() => pickMonth(mi)}
                                                    >
                                                        {mLabel}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button className="cal-picker-today" onClick={goToday}>Сьогодні</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <button onClick={() => changeMonth(1)} className="cal-nav-btn" aria-label="Наступний місяць">→</button>
                    </div>
                </header>

                <div className="cal-weekdays">
                    {WEEKDAYS.map(d => <div key={d} className="cal-weekday">{d}</div>)}
                </div>

                <div className="calendar-body" key={`${year}-${month}`}>
                    {weeks.map((week, wi) => {
                        const segs = tripSegmentsByWeek[wi] || [];
                        return (
                            <div className="cal-week" key={wi}>
                                {/* фонова сітка днів (однаковий розмір) */}
                                <div className="cal-week-days">
                                    {week.map((d, di) => {
                                        const key = toKey(d.date);
                                        const dayBookings = bookingsForKey(key);
                                        const isToday = d.date.toDateString() === new Date().toDateString();
                                        const coveringSeg = segs.find(s => di >= s.startCol && di <= s.endCol);
                                        const dayHasTrip = !!coveringSeg;
                                        const clickable = dayBookings.length > 0 || dayHasTrip;
                                        return (
                                            <div
                                                key={di}
                                                className={`cal-day ${!d.currentMonth ? 'cal-day--other' : ''} ${isToday ? 'cal-day--today' : ''} ${clickable ? 'cal-day--clickable' : ''} ${dayHasTrip ? 'cal-day--trip' : ''}`}
                                                style={dayHasTrip ? { '--trip': coveringSeg.ev.color } : undefined}
                                                onClick={clickable ? () => setSelectedKey(key) : undefined}
                                                role={clickable ? 'button' : undefined}
                                                tabIndex={clickable ? 0 : undefined}
                                                onKeyDown={clickable ? (e) => { if (e.key === 'Enter') setSelectedKey(key); } : undefined}
                                            >
                                                {dayHasTrip && <span className="cal-day-sheen" aria-hidden="true" />}
                                                <div className="cal-day-top">
                                                    <span className="cal-day-num">{d.day}</span>
                                                </div>
                                                {/* назва подорожі — у кожному дні поїздки, зверху */}
                                                {dayHasTrip && (
                                                    <div className="cal-trip-name" title={coveringSeg.ev.title}>
                                                        <span className="cal-trip-name-ic">{EVENT_TYPE.trip.icon}</span>
                                                        <span className="cal-trip-name-tx">{coveringSeg.ev.title}</span>
                                                    </div>
                                                )}
                                                <div className="cal-events">
                                                    {dayBookings.slice(0, 2).map((ev, idx) => (
                                                        <div key={idx} className="cal-event-chip" style={{ '--chip': ev.color }} title={`${EVENT_TYPE[ev.type].label}: ${ev.title}`}>
                                                            <span className="cal-event-ic">{ev.icon || EVENT_TYPE[ev.type].icon}</span>
                                                            <span className="cal-event-tx">{ev.title}</span>
                                                        </div>
                                                    ))}
                                                    {dayBookings.length > 2 && <span className="cal-event-more">+{dayBookings.length - 2} ще</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedKey && (
                <div className="cal-modal-overlay" onClick={() => setSelectedKey(null)}>
                    <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cal-modal-head">
                            <button className="cal-back-btn" onClick={() => setSelectedKey(null)} type="button">← Назад до календаря</button>
                            <button className="cal-close-btn" onClick={() => setSelectedKey(null)} aria-label="Закрити" type="button">×</button>
                        </div>
                        <h3 className="cal-modal-title">{selectedDateLabel}</h3>
                        <p className="cal-modal-sub">{selectedEvents.length} {selectedEvents.length === 1 ? 'подія' : 'подій'} цього дня</p>
                        <div className="cal-modal-body">
                            {selectedEvents.length === 0 && <p className="cal-empty">Немає подій цього дня.</p>}
                            <ul className="cal-group-list">
                                {selectedEvents.map((ev, idx) => (
                                    <li
                                        key={idx}
                                        className="cal-item cal-item--clickable"
                                        style={{ '--item': ev.color, borderLeftColor: ev.color }}
                                        onClick={() => openEvent(ev)}
                                        role="button" tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter') openEvent(ev); }}
                                    >
                                        <div className="cal-item-main">
                                            <span className="cal-item-title">
                                                <span className="cal-item-ic">{ev.icon || EVENT_TYPE[ev.type].icon}</span> {ev.title}
                                            </span>
                                            {ev.type === 'booking' && formatTime(ev.start) && <span className="cal-item-time">{formatTime(ev.start)}</span>}
                                        </div>
                                        <div className="cal-item-cat" style={{ color: ev.color }}>
                                            {EVENT_TYPE[ev.type].label}
                                            {ev.type === 'booking' && ev.rawType && <span className="cal-item-type-raw">({ev.rawType})</span>}
                                        </div>
                                        {ev.type === 'booking' && ev.tripName && <div className="cal-item-sub">🧳 {ev.tripName}</div>}
                                        {ev.type === 'booking' && ev.address && <div className="cal-item-sub">{ev.address}</div>}
                                        {ev.type === 'booking' && ev.note && <div className="cal-item-note">{ev.note}</div>}
                                        {ev.type === 'booking' && ev.cost > 0 && <div className="cal-item-cost">${Number(ev.cost).toLocaleString()}</div>}
                                        {ev.type === 'trip' && (
                                            <div className="cal-item-sub">
                                                {new Date(ev.start).toLocaleDateString('uk-UA')} — {new Date(ev.end).toLocaleDateString('uk-UA')}
                                            </div>
                                        )}
                                        <div className="cal-item-go">Відкрити →</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .calendar-page { animation: calFade 0.5s cubic-bezier(0.16,1,0.3,1); }
                .cal-head-row { margin-bottom: var(--sp-6); }
                .cal-page-title { font-size: 27px; font-weight: 640; color: var(--ink-deep); letter-spacing: -0.025em; }
                .cal-page-sub { font-size: 14px; color: var(--slate); margin-top: 5px; font-weight: 450; }
                .calendar-card {
                    position: relative;
                    background:
                        radial-gradient(130% 120% at 0% 0%, rgba(64,179,224,0.04) 0%, rgba(64,179,224,0) 46%),
                        radial-gradient(130% 120% at 100% 0%, rgba(139,92,246,0.035) 0%, rgba(139,92,246,0) 50%),
                        var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xxl); padding: var(--sp-7, 28px);
                    box-shadow:
                        0 1px 1px rgba(16,24,40,0.03),
                        0 4px 12px -6px rgba(16,24,40,0.06),
                        0 24px 48px -24px rgba(16,24,40,0.14);
                }
                .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-6); flex-wrap: wrap; gap: var(--sp-4); }
                .calendar-nav { display: flex; align-items: center; gap: var(--sp-2, 8px); }
                .cal-nav-btn {
                    width: 34px; height: 34px; border-radius: var(--radius-full);
                    border: 1px solid var(--hairline-soft);
                    background: color-mix(in srgb, var(--canvas) 70%, transparent);
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    cursor: pointer;
                    transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, color 0.22s, border-color 0.22s;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 16px; color: var(--slate);
                }
                .cal-nav-btn:hover { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 40%, var(--hairline-soft)); transform: translateY(-1px); box-shadow: 0 8px 18px -8px rgba(64,179,224,0.4); }
                .cal-nav-btn:active { transform: translateY(0) scale(0.94); transition-duration: 0.1s; }
                .cal-current-month { font-size: 19px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink-deep); min-width: 176px; text-align: center; }
                /* Кнопка-тригер вибору місяця/року */
                .cal-month-wrap { position: relative; }
                .cal-month-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
                    background: none; border: none; cursor: pointer;
                    padding: 6px 12px; border-radius: var(--radius-full);
                    transition: background 0.18s ease, color 0.18s ease;
                }
                .cal-month-btn:hover { background: var(--surface-soft, #f1f5f9); }
                .cal-month-caret { font-size: 11px; color: var(--slate); transition: transform 0.22s cubic-bezier(0.16,1,0.3,1); }
                .cal-month-btn--open { background: var(--surface-soft, #f1f5f9); }
                .cal-month-btn--open .cal-month-caret { transform: rotate(180deg); color: var(--primary); }

                .cal-picker-backdrop { position: fixed; inset: 0; z-index: 40; }
                .cal-picker {
                    position: absolute; z-index: 50; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
                    width: 290px; padding: 14px;
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: 18px;
                    box-shadow: 0 1px 2px rgba(16,24,40,0.04), 0 18px 44px -16px rgba(16,24,40,0.28);
                    animation: pickerIn 0.24s cubic-bezier(0.16,1,0.3,1);
                }
                .cal-picker-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .cal-picker-yr { font-size: 15px; font-weight: 600; color: var(--ink-deep); letter-spacing: -0.01em; }
                .cal-picker-yr-btn {
                    width: 30px; height: 30px; border-radius: 50%;
                    border: 1px solid var(--hairline-soft); background: var(--canvas);
                    color: var(--slate); cursor: pointer; font-size: 14px;
                    display: flex; align-items: center; justify-content: center;
                    transition: color 0.18s, border-color 0.18s, transform 0.18s;
                }
                .cal-picker-yr-btn:hover { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 40%, var(--hairline-soft)); }
                .cal-picker-yr-btn:active { transform: scale(0.92); }
                .cal-picker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
                .cal-picker-m {
                    padding: 10px 0; border-radius: 10px;
                    border: 1px solid transparent; background: var(--surface-soft, #f8fafc);
                    color: var(--ink-deep); font-size: 13px; font-weight: 500;
                    cursor: pointer;
                    transition: background 0.16s, color 0.16s, transform 0.16s, box-shadow 0.16s;
                }
                .cal-picker-m:hover { background: color-mix(in srgb, var(--primary) 12%, var(--canvas)); color: var(--primary); transform: translateY(-1px); }
                .cal-picker-m:active { transform: translateY(0); }
                .cal-picker-m--today { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 45%, transparent); color: var(--primary); }
                .cal-picker-m--active {
                    background: linear-gradient(135deg, var(--primary), var(--primary-deep, #2ea8d8));
                    color: #fff; font-weight: 600;
                    box-shadow: 0 6px 14px -6px rgba(64,179,224,0.6);
                }
                .cal-picker-m--active:hover { color: #fff; background: linear-gradient(135deg, var(--primary), var(--primary-deep, #2ea8d8)); }
                .cal-picker-today {
                    width: 100%; margin-top: 12px; padding: 9px 0;
                    border: none; border-radius: 10px; cursor: pointer;
                    background: var(--surface-soft, #f1f5f9); color: var(--ink-deep);
                    font-size: 12.5px; font-weight: 600; letter-spacing: 0.01em;
                    transition: background 0.16s, color 0.16s;
                }
                .cal-picker-today:hover { background: color-mix(in srgb, var(--primary) 14%, var(--canvas)); color: var(--primary); }
                .cal-legend { display: flex; gap: var(--sp-4); flex-wrap: wrap; }
                .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--slate); font-weight: 500; }
                .legend-item i { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
                /* Шапка днів тижня — та сама 7-колонкова сітка */
                .cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 2px; }
                .cal-weekday { padding: 6px 11px 12px; text-align: left; font-size: 10.5px; font-weight: 600; color: color-mix(in srgb, var(--slate) 80%, transparent); text-transform: uppercase; letter-spacing: 0.1em; }

                /* Тіло календаря — рядки-тижні */
                .calendar-body { display: flex; flex-direction: column; gap: 7px; animation: bodySwitch 0.42s cubic-bezier(0.16,1,0.3,1); }
                .cal-week { position: relative; animation: weekRise 0.45s cubic-bezier(0.16,1,0.3,1) both; }
                .cal-week:nth-child(1) { animation-delay: 0.02s; }
                .cal-week:nth-child(2) { animation-delay: 0.05s; }
                .cal-week:nth-child(3) { animation-delay: 0.08s; }
                .cal-week:nth-child(4) { animation-delay: 0.11s; }
                .cal-week:nth-child(5) { animation-delay: 0.14s; }
                .cal-week:nth-child(6) { animation-delay: 0.17s; }
                .cal-week-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 7px; }

                /* Клітинка дня — ОДНАКОВИЙ розмір незалежно від кількості подій */
                .cal-day {
                    position: relative; isolation: isolate; overflow: hidden;
                    background: color-mix(in srgb, var(--canvas) 92%, var(--surface-soft, #f8fafc));
                    border: 1px solid color-mix(in srgb, var(--hairline-soft) 70%, transparent);
                    border-radius: 14px;
                    height: 118px;                 /* фіксована висота — рівна сітка */
                    padding: 9px 10px;
                    display: flex; flex-direction: column;
                    transition: border-color 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, transform 0.22s, background 0.22s;
                }
                .cal-day--other { background: transparent; border-color: transparent; }
                .cal-day--other .cal-day-num { color: var(--slate); font-weight: 450; opacity: 0.4; }
                .cal-day--clickable { cursor: pointer; }
                .cal-day--clickable:hover { border-color: color-mix(in srgb, var(--ink-deep) 14%, transparent); box-shadow: 0 10px 26px -16px rgba(16,24,40,0.32); transform: translateY(-2px); }
                .cal-day--clickable:active { transform: translateY(0); transition-duration: 0.1s; }

                /* Клітинка дня подорожі — повна преміальна заливка кольором (м'якша) */
                .cal-day--trip {
                    background:
                        linear-gradient(155deg,
                            color-mix(in srgb, var(--trip) 22%, var(--canvas)) 0%,
                            color-mix(in srgb, var(--trip) 13%, var(--canvas)) 52%,
                            color-mix(in srgb, var(--trip) 18%, var(--canvas)) 100%);
                    border-color: color-mix(in srgb, var(--trip) 26%, var(--hairline-soft));
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.5),
                        0 4px 14px -10px color-mix(in srgb, var(--trip) 55%, transparent);
                }
                .cal-day--trip .cal-day-num { color: color-mix(in srgb, var(--trip) 70%, var(--ink-deep)); font-weight: 600; }
                .cal-day--trip.cal-day--clickable:hover {
                    border-color: color-mix(in srgb, var(--trip) 42%, transparent);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.6),
                        0 16px 34px -16px color-mix(in srgb, var(--trip) 60%, transparent);
                }
                /* м'який глянцевий блиск (преміальний ефект) */
                .cal-day-sheen {
                    position: absolute; inset: 0; z-index: 0; pointer-events: none;
                    background:
                        radial-gradient(130% 90% at 0% 0%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 46%),
                        radial-gradient(100% 80% at 100% 100%, color-mix(in srgb, var(--trip) 18%, transparent) 0%, transparent 64%);
                    mix-blend-mode: soft-light;
                    opacity: 0.85;
                }
                /* Сьогодні — акуратна кольорова «пігулка» з кільцем */
                .cal-day--today { border-color: color-mix(in srgb, var(--primary) 45%, var(--hairline-soft)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary) 30%, transparent) inset; }
                .cal-day--today .cal-day-num {
                    background: linear-gradient(135deg, var(--primary), var(--primary-deep, #2ea8d8));
                    color: #fff; width: 25px; height: 25px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; font-size: 12.5px; font-weight: 600;
                    box-shadow: 0 4px 10px -3px rgba(64,179,224,0.55), inset 0 1px 0 rgba(255,255,255,0.4);
                }
                .cal-day-top { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; min-height: 25px; }
                .cal-day-num { font-size: 13.5px; font-weight: 550; color: var(--ink-deep); letter-spacing: -0.01em; }
                .cal-events { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden; margin-top: 5px; }
                .cal-event-chip {
                    position: relative;
                    display: flex; align-items: center; gap: 5px;
                    padding: 3px 8px 3px 9px; border-radius: 7px;
                    font-size: 11px; font-weight: 600;
                    white-space: nowrap; overflow: hidden;
                    color: color-mix(in srgb, var(--chip) 70%, var(--ink-deep));
                    /* фон у кольорі категорії бронювання */
                    background: linear-gradient(135deg,
                        color-mix(in srgb, var(--chip) 24%, var(--canvas)) 0%,
                        color-mix(in srgb, var(--chip) 14%, var(--canvas)) 100%);
                    box-shadow: inset 3px 0 0 var(--chip), 0 1px 3px -1px color-mix(in srgb, var(--chip) 45%, transparent);
                    transition: background 0.18s ease, transform 0.16s ease;
                }
                .cal-day--clickable:hover .cal-event-chip {
                    background: linear-gradient(135deg,
                        color-mix(in srgb, var(--chip) 32%, var(--canvas)) 0%,
                        color-mix(in srgb, var(--chip) 20%, var(--canvas)) 100%);
                }
                .cal-event-ic { font-size: 10px; flex-shrink: 0; }
                .cal-event-tx { overflow: hidden; text-overflow: ellipsis; }
                .cal-event-more { font-size: 10px; color: var(--slate); font-weight: 600; padding-left: 4px; margin-top: 1px; }

                /* ── Назва подорожі всередині залитої клітинки (перший день) ── */
                .cal-trip-name {
                    position: relative; z-index: 1;
                    display: flex; align-items: flex-start; gap: 5px;
                    margin-top: 6px;
                    color: color-mix(in srgb, var(--trip) 74%, var(--ink-deep));
                }
                .cal-trip-name-ic { font-size: 11px; line-height: 1.25; flex-shrink: 0; opacity: 0.9; }
                .cal-trip-name-tx {
                    font-size: 11.5px; font-weight: 600; letter-spacing: -0.01em;
                    line-height: 1.2;
                    display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                    text-overflow: ellipsis; word-break: break-word; overflow-wrap: anywhere;
                }
                .cal-modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(5,5,5,0.42); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: var(--sp-4); animation: calFade 0.22s ease-out; }
                .cal-modal { position: relative; background: radial-gradient(120% 80% at 50% 0%, rgba(64,179,224,0.06) 0%, rgba(64,179,224,0) 60%), var(--canvas); width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; border: 1px solid var(--hairline-soft); border-radius: var(--radius-xxl); padding: var(--sp-6); box-shadow: 0 30px 80px -24px rgba(16,24,40,0.45); animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1); }
                .cal-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-4); }
                .cal-back-btn { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: var(--primary); padding: 6px 0; transition: gap 0.18s, opacity 0.18s; }
                .cal-back-btn:hover { gap: 8px; opacity: 0.8; }
                .cal-close-btn { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--hairline-soft); background: rgba(255,255,255,0.7); backdrop-filter: blur(6px); font-size: 20px; line-height: 1; color: var(--slate); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.18s, color 0.18s, background 0.18s; }
                .cal-close-btn:hover { background: var(--surface-soft); color: var(--ink-deep); transform: rotate(90deg); }
                .cal-modal-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink-deep); text-transform: capitalize; }
                .cal-modal-sub { font-size: 13px; color: var(--slate); margin-top: 3px; margin-bottom: var(--sp-5); }
                .cal-group-list { list-style: none; display: flex; flex-direction: column; gap: var(--sp-3); }
                .cal-item { position: relative; overflow: hidden; background: linear-gradient(160deg, color-mix(in srgb, var(--item, var(--primary)) 8%, var(--canvas)) 0%, var(--canvas) 72%); border: 1px solid var(--hairline-soft); border-left: 3px solid var(--item, var(--primary)); border-radius: 14px; padding: 14px 16px; animation: dayPop 0.35s cubic-bezier(0.16,1,0.3,1) both; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s; }
                .cal-item--clickable { cursor: pointer; }
                .cal-item:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -18px color-mix(in srgb, var(--item, var(--primary)) 65%, transparent); }
                .cal-item-main { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
                .cal-item-title { font-size: 14.5px; font-weight: 600; color: var(--ink-deep); letter-spacing: -0.015em; }
                .cal-item-ic { font-size: 14px; }
                .cal-item-time { font-size: 12px; font-weight: 600; color: color-mix(in srgb, var(--item, var(--primary)) 70%, var(--ink-deep)); background: color-mix(in srgb, var(--item, var(--primary)) 12%, var(--canvas)); padding: 2px 10px; border-radius: var(--radius-full); flex-shrink: 0; }
                .cal-item-cat { font-size: 12px; font-weight: 600; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
                .cal-item-type-raw { font-size: 11px; color: var(--slate); font-weight: 450; }
                .cal-item-sub { font-size: 12.5px; color: var(--slate); margin-top: 5px; line-height: 1.5; }
                .cal-item-note { font-size: 12.5px; color: var(--slate); margin-top: 6px; font-style: italic; line-height: 1.5; }
                .cal-item-cost { font-size: 14px; font-weight: 700; color: var(--ink-deep); margin-top: 8px; letter-spacing: -0.01em; }
                .cal-item-go { font-size: 12px; font-weight: 600; color: var(--item, var(--primary)); margin-top: 9px; opacity: 0; transform: translateX(-4px); transition: opacity 0.2s, transform 0.2s; }
                .cal-item:hover .cal-item-go { opacity: 1; transform: translateX(0); }
                .cal-empty { font-size: 13px; color: var(--slate); text-align: center; padding: var(--sp-8) 0; }
                @media (max-width: 768px) {
                    .calendar-card { padding: var(--sp-4); border-radius: var(--radius-xl); }
                    .calendar-header { flex-direction: column; align-items: flex-start; }
                    .cal-week-days { gap: 4px; }
                    .calendar-body { gap: 4px; }
                    .cal-day { height: 82px; padding: 6px; border-radius: var(--radius-md); }
                    .cal-weekday { padding: 6px 7px 8px; font-size: 10px; }
                    .cal-event-chip { padding: 2px 5px; font-size: 9px; }
                    .cal-event-tx { display: none; }
                    .cal-event-ic { font-size: 12px; }
                    .cal-day-num { font-size: 13px; }
                    .cal-trip-name-tx { font-size: 10px; -webkit-line-clamp: 1; line-clamp: 1; }
                    .cal-trip-name-ic { font-size: 10px; }
                    .cal-modal { padding: var(--sp-5); max-height: 90vh; border-radius: var(--radius-xl); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .calendar-page, .cal-modal, .calendar-body, .cal-week, .cal-item { animation: none !important; }
                    .cal-day, .cal-nav-btn, .cal-item, .cal-close-btn, .cal-event-chip { transition: none !important; }
                }
                @keyframes calFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dayPop { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes bodySwitch { from { opacity: 0; } to { opacity: 1; } }
                @keyframes weekRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pickerIn { from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
            `}</style>
        </div>
    );
}
