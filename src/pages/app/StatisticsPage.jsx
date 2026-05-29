import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { stats } from '@/api/api';


// Рендер зірок із підтримкою півзірки. value — у шкалі 0–5.
function Stars({ value }) {
    const v = Number(value) || 0;
    return (
        <span className="sp-stars" aria-label={`${v}/5`}>
            {Array.from({ length: 5 }, (_, i) => {
                const sv = i + 1;
                if (v >= sv) return <span key={sv} className="sp-star sp-star--full">★</span>;
                if (v >= sv - 0.5) return <span key={sv} className="sp-star sp-star--half">★</span>;
                return <span key={sv} className="sp-star sp-star--empty">★</span>;
            })}
        </span>
    );
}

const PERIODS = [
    { label: 'За весь час', value: 'all' },
    { label: 'За останній рік', value: 'last_year' },
    { label: 'За 6 місяців', value: 'last_6_months' },
];

function SpendingTrend({ trips }) {
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const data = months.map((m, mi) => {
        const val = trips.filter(t => t.spent > 0 && t.start_at && new Date(t.start_at).getMonth() === mi).reduce((s, t) => s + (t.spent || 0), 0);
        return { m, val };
    }).filter((_, i) => i < 8);
    const maxVal = Math.max(...data.map(d => d.val), 500);
    const W = 520, H = 160, pad = { t: 20, b: 30, l: 50, r: 20 };
    const pts = data.map((d, i) => {
        const x = pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
        const y = H - pad.b - (d.val / maxVal) * (H - pad.t - pad.b);
        return [x, y];
    });
    const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `C${(pts[i - 1][0] + p[0]) / 2},${pts[i - 1][1]} ${(pts[i - 1][0] + p[0]) / 2},${p[1]} ${p[0]},${p[1]}`)).join(' ');
    const areaPath = linePath + ` L${pts[pts.length - 1][0]},${H - pad.b} L${pts[0][0]},${H - pad.b} Z`;
    const yTicks = [0, Math.round(maxVal / 4), Math.round(maxVal / 2), Math.round(3 * maxVal / 4), maxVal];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {yTicks.map(v => {
                const y = H - pad.b - (v / maxVal) * (H - pad.t - pad.b);
                return <g key={v}>
                    <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</text>
                </g>;
            })}
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#40B3E0" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#40B3E0" stopOpacity="0" />
                </linearGradient>
            </defs>
            {pts.length > 1 && <>
                <path d={areaPath} fill="url(#areaGrad)" />
                <path d={linePath} fill="none" stroke="#40B3E0" strokeWidth="2" strokeLinecap="round" />
                {pts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#40B3E0" strokeWidth="2" />
                ))}
            </>}
            {data.map((d, i) => (
                <text key={i} x={pts[i][0]} y={H - pad.b + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.m}</text>
            ))}
        </svg>
    );
}

function BudgetDonut({ trips }) {
    const total = trips.reduce((s, t) => s + (t.spent || 0), 0);
    const items = [
        { label: 'Проживання', pct: 45, color: '#40B3E0' },
        { label: 'Транспорт', pct: 25, color: '#f59e0b' },
        { label: 'Їжа', pct: 20, color: '#6366f1' },
        { label: 'Активності', pct: 10, color: '#22c55e' },
    ];
    const r = 54, cx = 70, cy = 70, stroke = 18;
    let offset = 0;
    const circ = 2 * Math.PI * r;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-soft)" strokeWidth={stroke} />
                {items.map((it, i) => {
                    const dash = (it.pct / 100) * circ;
                    const seg = <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                        stroke={it.color} strokeWidth={stroke}
                        strokeDasharray={`${dash} ${circ - dash}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="butt"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dasharray 0.6s ease' }}
                    />;
                    offset += dash;
                    return seg;
                })}
                <text x={cx} y={cy - 7} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--ink-deep)">{total > 0 ? `$${(total / 1000).toFixed(1)}k` : '—'}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#94a3b8" letterSpacing="0.5">ВИТРАЧЕНО</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: it.color, flexShrink: 0 }} />
                        <span style={{ color: 'var(--slate)', fontSize: 12, flex: 1 }}>{it.label}</span>
                        <strong style={{ color: 'var(--ink-deep)', fontSize: 12, fontWeight: 600 }}>{it.pct}%</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DurationBars({ trips }) {
    const sorted = [...trips].sort((a, b) => (b.days || 0) - (a.days || 0)).slice(0, 6);
    const maxDays = Math.max(...sorted.map(t => t.days || 0), 1);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sorted.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 80, fontSize: 11, color: 'var(--slate)', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.title?.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div style={{ flex: 1, height: 8, background: 'var(--surface-soft)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${((t.days || 0) / maxDays) * 100}%`, background: `linear-gradient(90deg,#40B3E0,#0ea5e9)`, borderRadius: 99, transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                    <div style={{ width: 32, fontSize: 11, fontWeight: 600, color: 'var(--ink-deep)', textAlign: 'right', flexShrink: 0 }}>
                        {t.days || 0}д
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function StatisticsPage() {
    const [period, setPeriod] = useState('all');
    const { data: summary, loading } = useApi(() => stats.summary(period), [period]);

    const s = summary || {};
    const trips = s.trips_comparison || [];
    const tasksPct = s.tasks_total_total > 0 ? Math.round((s.tasks_done_total / s.tasks_total_total) * 100) : 0;
    const placesPct = s.places_total_total > 0 ? Math.round((s.places_visited_total / s.places_total_total) * 100) : 0;
    const budgetPct = s.total_budget > 0 ? Math.min(Math.round((s.total_spent / s.total_budget) * 100), 100) : 0;
    const avgRate = s.avg_rate || 0;

    const statusWeight = { active: 1, completed: 2, waiting: 3 };
    const filtered = [...trips].sort((a, b) => {
        const wa = statusWeight[a.status] || 99;
        const wb = statusWeight[b.status] || 99;
        if (wa !== wb) return wa - wb;
        return (a.title || '').localeCompare(b.title || '');
    });

    const mostActive = trips.reduce((b, t) => (t.tasks_percentage || 0) > (b?.tasks_percentage || 0) ? t : b, trips[0]);
    const longestTrip = trips.reduce((b, t) => (t.days || 0) > (b?.days || 0) ? t : b, trips[0]);
    const shortestTrip = trips.filter(t => (t.days || 0) > 0).reduce((b, t) => (t.days || 0) < (b?.days || 0) ? t : b, trips.filter(t => (t.days || 0) > 0)[0]);

    if (loading) return (
        <div className="container page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#40B3E0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--slate)', fontWeight: 500, fontSize: 14 }}>Завантаження аналітики…</p>
            </div>
        </div>
    );

    return (
        <div className="container page sp-page">


            <div className="sp-bg-orb sp-bg-orb--1" />
            <div className="sp-bg-orb sp-bg-orb--2" />

            <div className="sp-header">
                <div>
                    <h1 className="sp-title">Аналітика подорожей</h1>
                    <p className="sp-sub">Повний огляд ваших подорожей, бюджетів та досягнень.</p>
                </div>
                <div className="sp-period">
                    {PERIODS.map(p => (
                        <button key={p.value}
                            className={`sp-period__btn ${period === p.value ? 'sp-period__btn--on' : ''}`}
                            onClick={() => setPeriod(p.value)}
                        >{p.label}</button>
                    ))}
                </div>
            </div>

            <div className="sp-kpi-row">
                {[
                    { icon: '💰', label: 'Загальний бюджет', val: `$${(s.total_budget || 0).toLocaleString()}`, trend: `${budgetPct}% витрачено`, accent: '#40B3E0' },
                    { icon: '🏙️', label: 'Міст відвідано', val: s.cities_visited || 0, trend: `${s.total_trips || 0} поїздок`, accent: '#22c55e' },
                    { icon: '📍', label: 'Місць відвідано', val: s.places_visited_total || 0, trend: `з ${s.places_total_total || 0} запланованих`, accent: '#6366f1' },
                    { icon: '⭐', label: 'Середній рейтинг', val: avgRate > 0 ? `${avgRate.toFixed(1)}/5` : '—/5', trend: `${s.rated_trips || 0} оцінено`, accent: '#f59e0b' },
                ].map((k, i) => (
                    <div key={i} className="sp-kpi" style={{ '--ka': k.accent }}>
                        <div className="sp-kpi__top">
                            <span className="sp-kpi__icon">{k.icon}</span>
                            <span className="sp-kpi__trend">{k.trend}</span>
                        </div>
                        <div className="sp-kpi__val">{k.val}</div>
                        <div className="sp-kpi__label">{k.label}</div>
                        <div className="sp-kpi__bar" />
                    </div>
                ))}
            </div>

            <div className="sp-row-2 sp-row-2--wide">
                <div className="sp-card">
                    <div className="sp-card__head">
                        <div className="sp-card__title">Тренд витрат</div>
                        <div className="sp-card__sub">Щомісячні витрати по всіх поїздках</div>
                    </div>
                    <div style={{ height: 170, marginTop: 12 }}>
                        <SpendingTrend trips={trips} />
                    </div>
                </div>

                <div className="sp-card">
                    <div className="sp-card__head">
                        <div className="sp-card__title">Виконання завдань</div>
                        <div className="sp-card__sub">Від усіх запланованих</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 8px' }}>
                        <div style={{ position: 'relative' }}>
                            <svg width="130" height="130" viewBox="0 0 130 130">
                                <circle cx="65" cy="65" r="50" fill="none" stroke="var(--surface-soft)" strokeWidth="12" />
                                <circle cx="65" cy="65" r="50" fill="none" stroke="#40B3E0" strokeWidth="12"
                                    strokeDasharray={`${tasksPct * 3.14159} 314.159`}
                                    strokeDashoffset="78.54" strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)' }}
                                />
                                <text x="65" y="60" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--ink-deep)">{tasksPct}%</text>
                                <text x="65" y="76" textAnchor="middle" fontSize="8" fill="#94a3b8" letterSpacing="0.5">ВИКОНАНО</text>
                            </svg>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--slate)', paddingBottom: 4 }}>
                        {s.tasks_done_total || 0} з {s.tasks_total_total || 0} завдань
                    </div>
                </div>
            </div>

            <div className="sp-row-2">
                <div className="sp-card">
                    <div className="sp-card__head">
                        <div className="sp-card__title">Тривалість поїздок</div>
                        <div className="sp-card__sub">Кількість днів у кожній поїздці</div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <DurationBars trips={trips} />
                    </div>
                </div>
                <div className="sp-card">
                    <div className="sp-card__head">
                        <div className="sp-card__title">Розподіл бюджету</div>
                        <div className="sp-card__sub">Куди йдуть ваші кошти</div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <BudgetDonut trips={trips} />
                    </div>
                </div>
            </div>

            <div className="sp-section-head">
                <span className="sp-section-title">Найкращі результати</span>
            </div>
            <div className="sp-highlights">
                {[
                    {
                        badge: 'НАЙАКТИВНІША', color: '#40B3E0', name: mostActive?.title || '—', metric: mostActive?.tasks_done || 0, unit: 'завдань',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg>
                    },
                    {
                        badge: 'НАЙДОВША', color: '#6366f1', name: longestTrip?.title || '—', metric: longestTrip?.days || 0, unit: 'днів',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    },
                    {
                        badge: 'НАЙКОРОТША', color: '#0891b2', name: shortestTrip?.title || '—', metric: shortestTrip?.days || 0, unit: 'днів',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" /></svg>
                    },
                    {
                        badge: 'ТОП БЮДЖЕТ', color: '#f59e0b', name: s.most_expensive_trip?.title || '—', metric: s.most_expensive_trip?.spent ? `$${Number(s.most_expensive_trip.spent).toLocaleString()}` : '—', unit: 'витрачено',
                        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    },
                ].map((h, i) => (
                    <div key={i} className="sp-hl-card" style={{ '--hc': h.color }}>
                        <div className="sp-hl-badge">
                            {h.icon}
                            {h.badge}
                        </div>
                        <div className="sp-hl-name">{h.name}</div>
                        <div className="sp-hl-metric">
                            {h.metric} <span className="sp-hl-unit">{h.unit}</span>
                        </div>
                        <div className="sp-hl-glow" />
                    </div>
                ))}
            </div>

            <div className="sp-section-head" style={{ marginTop: 'var(--sp-2)' }}>
                <span className="sp-section-title">Всі подорожі</span>
                <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500 }}>{filtered.length} поїздок</span>
            </div>
            <div className="sp-table-wrap">
                <table className="sp-table">
                    <thead>
                        <tr>
                            {['Поїздка', 'Місто', 'Днів', 'Бюджет', 'Витрачено', 'Завдання', 'Місця', 'Рейтинг'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate)', fontSize: 14 }}>
                                Немає даних за цей період
                            </td></tr>
                        ) : filtered.map((t, i) => {
                            const bPct = t.budget > 0 ? Math.min(Math.round((t.spent / t.budget) * 100), 100) : 0;
                            const tkPct = t.tasks_total > 0 ? Math.round((t.tasks_done / t.tasks_total) * 100) : 0;
                            const statusCl = { active: 'sp-status--green', completed: 'sp-status--red', waiting: 'sp-status--orange' };
                            const statusLbl = { active: 'У процесі', completed: 'Завершена', waiting: 'В очікуванні' };
                            return (
                                <tr key={t.id || i} className="sp-table__row">
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--ink-deep)', fontSize: 13, marginBottom: 3 }}>{t.title}</div>
                                        <span className={`sp-status ${statusCl[t.status] || ''}`}>{statusLbl[t.status] || t.status}</span>
                                    </td>
                                    <td className="sp-td--muted">{t.city || '—'}</td>
                                    <td><span className="sp-td--num">{t.days || '—'}</span></td>
                                    <td className="sp-td--muted">${(t.budget || 0).toLocaleString()}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: t.spent > t.budget ? '#ef4444' : 'var(--ink-deep)', fontSize: 13, marginBottom: 4 }}>
                                            ${(t.spent || 0).toLocaleString()}
                                        </div>
                                        <div style={{ height: 3, width: 72, background: 'var(--surface-soft)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${bPct}%`, background: bPct >= 100 ? '#ef4444' : '#40B3E0', borderRadius: 99, transition: 'width 0.6s ease' }} />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                            <div style={{ height: 3, width: 44, background: 'var(--surface-soft)', borderRadius: 99, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${tkPct}%`, background: '#6366f1', borderRadius: 99 }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6366f1' }}>{tkPct}%</span>
                                        </div>
                                    </td>
                                    <td className="sp-td--muted">{t.places_visited || 0}/{t.places_total || 0}</td>
                                    <td>
                                        {t.rate > 0
                                            ? <Stars value={t.rate} />
                                            : <span style={{ color: 'var(--hairline)' }}>—</span>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes spin { to { transform:rotate(360deg); } }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes orb { 0%,100% { transform:scale(1) translate(0,0); } 50% { transform:scale(1.08) translate(12px,-8px); } }

                .sp-page { padding-bottom:80px; position:relative; overflow:hidden; }

                /* ── Ambient orbs ── */
                .sp-bg-orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; opacity:0.07; }
                .sp-bg-orb--1 { width:500px; height:500px; background:radial-gradient(circle,#40B3E0,transparent); top:-120px; right:-80px; animation:orb 16s ease-in-out infinite; }
                .sp-bg-orb--2 { width:360px; height:360px; background:radial-gradient(circle,#6366f1,transparent); bottom:-80px; left:-60px; animation:orb 20s ease-in-out infinite reverse; }

                /* ── Header ── */
                .sp-header { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; flex-wrap:wrap; gap:16px; animation:fadeUp 0.5s ease both; }
                .sp-title { font-size:26px; font-weight:600; color:var(--ink-deep); letter-spacing:-0.025em; margin-bottom:5px; line-height:1.2; }
                .sp-sub { font-size:13px; color:var(--slate); font-weight:400; }

                /* ── Period toggle ── */
                .sp-period { display:flex; gap:3px; background:var(--surface-soft); padding:3px; border-radius:99px; align-self:center; }
                .sp-period__btn { border-radius:99px; padding:7px 14px; background:transparent; border:none; cursor:pointer; font-weight:500; font-size:12px; color:var(--slate); transition:all 0.2s ease; white-space:nowrap; font-family:var(--font); }
                .sp-period__btn--on { background:#40B3E0; color:#fff; box-shadow:0 2px 10px rgba(64,179,224,0.35); }
                .sp-period__btn:hover:not(.sp-period__btn--on) { color:var(--ink-deep); }

                /* ── KPI strip ── */
                .sp-kpi-row { position:relative; z-index:1; display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; animation:fadeUp 0.5s ease 0.08s both; }
                .sp-kpi {
                    background:var(--canvas);
                    border:1px solid var(--hairline-soft);
                    border-radius:16px;
                    padding:20px;
                    position:relative;
                    overflow:hidden;
                    transition:transform 0.22s ease, box-shadow 0.22s ease;
                    cursor:default;
                }
                .sp-kpi:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
                .sp-kpi__top { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
                .sp-kpi__icon { font-size:20px; }
                .sp-kpi__trend { font-size:10px; font-weight:600; color:var(--slate); background:var(--surface-soft); padding:3px 8px; border-radius:99px; }
                .sp-kpi__val { font-size:24px; font-weight:600; color:var(--ink-deep); letter-spacing:-0.02em; margin-bottom:4px; }
                .sp-kpi__label { font-size:11px; color:var(--slate); font-weight:500; letter-spacing:0.01em; }
                .sp-kpi__bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--ka,#40B3E0); opacity:0.3; border-radius:0 0 16px 16px; }
                .sp-kpi:hover .sp-kpi__bar { opacity:0.7; }

                /* ── Cards ── */
                .sp-card {
                    position:relative; z-index:1;
                    background:var(--canvas);
                    border:1px solid var(--hairline-soft);
                    border-radius:16px;
                    padding:22px;
                    transition:box-shadow 0.22s ease;
                    animation:fadeUp 0.5s ease 0.12s both;
                }
                .sp-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.05); }
                .sp-card__head { margin-bottom:4px; }
                .sp-card__title { font-size:14px; font-weight:600; color:var(--ink-deep); margin-bottom:3px; letter-spacing:-0.01em; }
                .sp-card__sub { font-size:11px; color:var(--slate); }

                /* ── Row layouts ── */
                .sp-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
                .sp-row-2--wide { grid-template-columns:1.7fr 1fr; }

                /* ── Section head ── */
                .sp-section-head { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
                .sp-section-title { font-size:15px; font-weight:600; color:var(--ink-deep); letter-spacing:-0.01em; }
                .sp-section-link { font-size:12px; font-weight:600; color:#40B3E0; cursor:pointer; transition:opacity 0.18s; }
                .sp-section-link:hover { opacity:0.7; }

                /* ── Highlights ── */
                .sp-highlights { position:relative; z-index:1; display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; animation:fadeUp 0.5s ease 0.16s both; }
                .sp-hl-card {
                    background:var(--canvas);
                    border:1px solid var(--hairline-soft);
                    border-radius:14px;
                    padding:18px;
                    display:flex; flex-direction:column; gap:7px;
                    position:relative; overflow:hidden;
                    transition:transform 0.22s ease, box-shadow 0.22s ease;
                    cursor:default;
                }
                .sp-hl-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
                .sp-hl-badge { display:inline-flex; align-items:center; gap:5px; font-size:9px; font-weight:700; letter-spacing:0.08em; color:var(--hc,#40B3E0); text-transform:uppercase; }
                .sp-hl-name { font-size:13px; font-weight:600; color:var(--ink-deep); line-height:1.25; }
                .sp-hl-metric { font-size:22px; font-weight:600; color:var(--hc,#40B3E0); letter-spacing:-0.02em; line-height:1.1; }
                .sp-hl-unit { font-size:12px; font-weight:400; color:var(--slate); }
                .sp-hl-glow { position:absolute; bottom:0; right:0; width:80px; height:80px; border-radius:50%; background:var(--hc,#40B3E0); opacity:0.05; transform:translate(30px,30px); transition:opacity 0.3s; }
                .sp-hl-card:hover .sp-hl-glow { opacity:0.1; }

                /* ── Table ── */
                .sp-table-wrap { position:relative; z-index:1; background:var(--canvas); border:1px solid var(--hairline-soft); border-radius:16px; overflow:hidden; animation:fadeUp 0.5s ease 0.2s both; }
                .sp-table { width:100%; border-collapse:collapse; font-size:13px; }
                .sp-table thead tr { border-bottom:1px solid var(--hairline-soft); background:var(--surface-soft); }
                .sp-table th { padding:11px 16px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--slate); white-space:nowrap; }
                .sp-table td { padding:14px 16px; border-bottom:1px solid var(--hairline-soft); vertical-align:middle; }
                .sp-table__row { transition:background 0.15s ease; }
                .sp-table__row:last-child td { border-bottom:none; }
                .sp-table__row:hover td { background:var(--surface-soft); }
                .sp-td--muted { color:var(--slate); font-size:12px; }
                .sp-td--num { font-weight:600; color:var(--ink-deep); }
                .sp-stars { color:#f59e0b; font-size:12px; letter-spacing:1px; display:inline-flex; }
                .sp-star { position:relative; display:inline-block; color: var(--hairline); }
                .sp-star--full { color:#f59e0b; }
                .sp-star--half { color: var(--hairline); }
                .sp-star--half::before { content:'★'; position:absolute; left:0; top:0; width:50%; overflow:hidden; color:#f59e0b; }

                /* ── Status badges ── */
                .sp-status { display:inline-block; font-size:9px; font-weight:600; padding:2px 7px; border-radius:99px; letter-spacing:0.03em; }
                .sp-status--green  { background:rgba(30,198,139,0.10); color:#0d9e6e; }
                .sp-status--red    { background:rgba(239,68,68,0.08);  color:#ef4444; }
                .sp-status--orange { background:rgba(245,158,11,0.10); color:#d97706; }

                /* ── Responsive ── */
                @media (max-width:1100px) {
                    .sp-kpi-row { grid-template-columns:repeat(2,1fr); }
                    .sp-highlights { grid-template-columns:repeat(2,1fr); }
                    .sp-row-2, .sp-row-2--wide { grid-template-columns:1fr; }
                }
                @media (max-width:640px) {
                    .sp-kpi-row { grid-template-columns:1fr 1fr; }
                    .sp-highlights { grid-template-columns:1fr 1fr; }
                    .sp-title { font-size:20px; }
                    .sp-kpi__val { font-size:20px; }
                    .sp-table th, .sp-table td { padding:10px 12px; }
                }
                @media (max-width:420px) {
                    .sp-kpi-row, .sp-highlights { grid-template-columns:1fr; }
                }
            `}</style>
        </div>
    );
}

function GroupedBarChart({ data }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredType, setHoveredType] = useState(null);
    const svgWidth = 600, svgHeight = 300, margin = { top: 30, right: 20, bottom: 40, left: 55 };
    const chartWidth = svgWidth - margin.left - margin.right, chartHeight = svgHeight - margin.top - margin.bottom;
    const maxVal = Math.max(...data.map(d => Math.max(parseFloat(d.budget) || 0, parseFloat(d.spent) || 0, 500)));
    const yTicks = 5;
    let tooltipX = 0, tooltipY = 0, tooltipTitle = '', tooltipValue = 0, isOverBudget = false;
    if (hoveredIndex !== null && data[hoveredIndex]) {
        const d = data[hoveredIndex];
        const bVal = parseFloat(d.budget) || 0, sVal = parseFloat(d.spent) || 0;
        tooltipTitle = String(d.title || 'Подорож');
        isOverBudget = sVal > bVal;
        const groupWidth = chartWidth / data.length, groupGap = Math.max(12, 40 - data.length * 4), barWidth = (groupWidth - groupGap) / 2;
        const xStart = margin.left + hoveredIndex * groupWidth + groupGap / 2;
        if (hoveredType === 'budget') { const bH = (bVal / maxVal) * chartHeight; tooltipX = xStart + barWidth / 2; tooltipY = margin.top + chartHeight - bH; tooltipValue = bVal; }
        else { const sH = (sVal / maxVal) * chartHeight; tooltipX = xStart + barWidth + 2 + barWidth / 2; tooltipY = margin.top + chartHeight - sH; tooltipValue = sVal; }
    }
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2e8f0" /><stop offset="100%" stopColor="#f1f5f9" />
                    </linearGradient>
                    <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#40B3E0" /><stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="overBudgetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                {Array.from({ length: yTicks }).map((_, idx) => {
                    const tickVal = Math.round((maxVal / (yTicks - 1)) * idx);
                    const y = margin.top + chartHeight - (tickVal / maxVal) * chartHeight;
                    return <g key={idx}>
                        <line x1={margin.left} y1={y} x2={margin.left + chartWidth} y2={y} stroke="var(--hairline-soft)" strokeDasharray="4 4" />
                        <text x={margin.left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="var(--slate)" fontWeight="600">${tickVal}</text>
                    </g>;
                })}
                {data.map((d, i) => {
                    const groupWidth = chartWidth / data.length, groupGap = Math.max(12, 40 - data.length * 4), barWidth = (groupWidth - groupGap) / 2;
                    const xStart = margin.left + i * groupWidth + groupGap / 2;
                    const bVal = parseFloat(d.budget) || 0, sVal = parseFloat(d.spent) || 0;
                    const bH = (bVal / maxVal) * chartHeight, bY = margin.top + chartHeight - bH;
                    const sH = (sVal / maxVal) * chartHeight, sY = margin.top + chartHeight - sH;
                    const isOB = sVal > bVal, title = String(d.title || 'Подорож');
                    return <g key={d.id || i}>
                        <rect x={xStart} y={bY} width={barWidth} height={Math.max(bH, 2)} rx={3} fill="url(#budgetGrad)"
                            opacity={hoveredIndex !== null && (hoveredIndex !== i || hoveredType !== 'budget') ? 0.35 : 1}
                            style={{ transition: 'opacity 0.18s ease', cursor: 'pointer' }}
                            onMouseEnter={() => { setHoveredIndex(i); setHoveredType('budget'); }}
                            onMouseLeave={() => { setHoveredIndex(null); setHoveredType(null); }} />
                        <rect x={xStart + barWidth + 2} y={sY} width={barWidth} height={Math.max(sH, 2)} rx={3}
                            fill={isOB ? 'url(#overBudgetGrad)' : 'url(#spentGrad)'}
                            opacity={hoveredIndex !== null && (hoveredIndex !== i || hoveredType !== 'spent') ? 0.35 : 1}
                            style={{ transition: 'opacity 0.18s ease', cursor: 'pointer' }}
                            onMouseEnter={() => { setHoveredIndex(i); setHoveredType('spent'); }}
                            onMouseLeave={() => { setHoveredIndex(null); setHoveredType(null); }} />
                        <text x={xStart + barWidth + 1} y={margin.top + chartHeight + 20} textAnchor="middle" fontSize="10" fontWeight="600"
                            fill={hoveredIndex === i ? '#40B3E0' : 'var(--slate)'} style={{ transition: 'fill 0.18s' }}>
                            {title.length > 8 ? `${title.slice(0, 7)}…` : title}
                        </text>
                    </g>;
                })}
                <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} stroke="var(--hairline)" strokeWidth="1" />
                {hoveredIndex !== null && data[hoveredIndex] && (
                    <g transform={`translate(${tooltipX},${tooltipY - 12})`} style={{ pointerEvents: 'none' }}>
                        <rect x={-72} y={-46} width={144} height={42} rx={8} fill="var(--ink-deep)" opacity="0.92" />
                        <polygon points="-5,-4 5,-4 0,2" fill="var(--ink-deep)" opacity="0.92" />
                        <text x={0} y={-30} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">{tooltipTitle.length > 16 ? `${tooltipTitle.slice(0, 15)}…` : tooltipTitle}</text>
                        <text x={0} y={-14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">
                            {hoveredType === 'budget' ? 'Бюджет: ' : 'Витрачено: '}
                            <tspan fontWeight="700" fill={hoveredType === 'budget' ? '#93c5fd' : isOverBudget ? '#fca5a5' : '#86efac'}>${tooltipValue}</tspan>
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
}

function TaskCompletionChart({ data }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {data.map((t, idx) => {
                const percentage = parseInt(t.tasks_percentage) || 0, total = parseInt(t.tasks_total) || 0, done = parseInt(t.tasks_done) || 0;
                const title = String(t.title || 'Подорож');
                const color = percentage === 100 ? 'var(--success)' : total === 0 ? 'var(--stone)' : '#40B3E0';
                return (
                    <div key={t.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                            <span style={{ fontWeight: 600, color: 'var(--ink-deep)' }}>{title}</span>
                            <span style={{ fontWeight: 600, color, fontSize: 12 }}>{done}/{total} ({percentage}%)</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--surface-soft)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function PlacesVisitedChart({ data }) {
    const sortedData = [...data].sort((a, b) => (parseInt(b.places_visited) || 0) - (parseInt(a.places_visited) || 0));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {sortedData.map((t, idx) => {
                const total = parseInt(t.places_total) || 0, visited = parseInt(t.places_visited) || 0;
                const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
                const title = String(t.title || 'Подорож');
                return (
                    <div key={t.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx === 0 ? 'rgba(64,179,224,0.15)' : 'var(--surface-soft)', color: idx === 0 ? '#40B3E0' : 'var(--slate)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>#{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                                <span style={{ fontWeight: 600, color: 'var(--ink-deep)' }}>{title}</span>
                                <span style={{ fontSize: 11, color: 'var(--slate)' }}>{visited}/{total}</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--surface-soft)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg,#40B3E0,#0ea5e9)', borderRadius: 99, transition: 'width 0.8s ease-out' }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
