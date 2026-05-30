import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, createCity } from '@/api/api';
import { toast } from '@/components/ui/Toast';

export default function AddTripPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        cityName: '',
        start_at: '',
        end_at: '',
        start_money: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState('');

    const handle = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        setError('');

        if (!form.name.trim()) { setError('Введіть назву подорожі'); return; }
        if (!form.start_at || !form.end_at) { setError('Вкажіть дати початку та завершення'); return; }
        if (form.start_at > form.end_at) { setError('Дата початку не може бути пізніше дати завершення'); return; }

        setLoading(true);
        try {
            const trip = await createTrip({
                name: form.name.trim(),
                description: form.description.trim(),
                start_at: new Date(form.start_at).toISOString(),
                end_at: new Date(form.end_at).toISOString(),
                start_money: parseInt(form.start_money) || 0,
                cities: form.cityName.trim() ? [form.cityName.trim()] : [],
                fact_money: 0,
                status: 'waiting',
                rate: 0,
            });

            if (form.cityName.trim()) {
                await createCity({
                    trips_id: trip?.id ?? trip?.data?.id,
                    name: form.cityName.trim(),
                });
            }

            toast('Подорож створена!', 'success');
            navigate('/trips');
        } catch (err) {
            setError(err.message || 'Не вдалося створити подорож');
            setLoading(false);
        }
    };

    const inputProps = (field, extra = {}) => ({
        value: form[field],
        onChange: handle(field),
        onFocus: () => setFocused(field),
        onBlur: () => setFocused(''),
        className: `atp-input ${focused === field ? 'atp-input--focused' : ''} ${form[field] ? 'atp-input--filled' : ''}`,
        ...extra,
    });

    return (
        <div className="atp-page">
            <div className="atp-blob atp-blob--1" />
            <div className="atp-blob atp-blob--2" />

            <div className="atp-card">
                {/* Header */}
                <div className="atp-card__header">
                    <div className="atp-card__icon">✈️</div>
                    <h1 className="atp-card__title">Нова подорож</h1>
                    <p className="atp-card__subtitle">Заповніть деталі вашої майбутньої пригоди</p>
                </div>

                <div className="atp-divider" />

                {error && (
                    <div className="atp-error">
                        <span className="atp-error__icon">⚠</span>
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="atp-form">

                    {/* Назва */}
                    <div className="atp-field">
                        <label className="atp-label">
                            <span className="atp-label__icon">🗺️</span>
                            Назва подорожі
                            <span className="atp-label__req">*</span>
                        </label>
                        <input
                            autoFocus
                            placeholder="Наприклад: Вихідні в Одесі"
                            required
                            {...inputProps('name')}
                        />
                    </div>

                    {/* Опис — нове поле */}
                    <div className="atp-field">
                        <label className="atp-label">
                            <span className="atp-label__icon">📝</span>
                            Опис
                        </label>
                        <textarea
                            placeholder="Розкажіть про цю подорож: маршрут, ціль, очікування…"
                            rows={3}
                            {...inputProps('description', {
                                className: `atp-input atp-textarea ${focused === 'description' ? 'atp-input--focused' : ''} ${form.description ? 'atp-input--filled' : ''}`,
                            })}
                        />
                    </div>

                    {/* Місто */}
                    <div className="atp-field">
                        <label className="atp-label">
                            <span className="atp-label__icon">📍</span>
                            Місто / Локація
                        </label>
                        <input
                            placeholder="Наприклад: Санторіні, Греція"
                            {...inputProps('cityName')}
                        />
                    </div>

                    {/* Дати */}
                    <div className="atp-row">
                        <div className="atp-field">
                            <label className="atp-label">
                                <span className="atp-label__icon">📅</span>
                                Дата початку
                                <span className="atp-label__req">*</span>
                            </label>
                            <input type="date" required {...inputProps('start_at')} />
                        </div>
                        <div className="atp-field">
                            <label className="atp-label">
                                <span className="atp-label__icon">🏁</span>
                                Дата завершення
                                <span className="atp-label__req">*</span>
                            </label>
                            <input type="date" required {...inputProps('end_at')} />
                        </div>
                    </div>

                    {/* Бюджет */}
                    <div className="atp-field">
                        <label className="atp-label">
                            <span className="atp-label__icon">💰</span>
                            Бюджет ($)
                        </label>
                        <div className="atp-input-prefix-wrap">
                            <span className="atp-prefix">$</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...inputProps('start_money', {
                                    className: `atp-input atp-input--prefixed ${focused === 'start_money' ? 'atp-input--focused' : ''} ${form.start_money ? 'atp-input--filled' : ''}`,
                                })}
                            />
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="atp-actions">
                        <button
                            type="button"
                            className="atp-btn atp-btn--cancel"
                            onClick={() => navigate('/trips')}
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className={`atp-btn atp-btn--submit ${loading ? 'atp-btn--loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="atp-spinner" />
                                    Створення...
                                </>
                            ) : (
                                <>
                                    <span>Створити подорож</span>
                                    <span className="atp-btn__arrow">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .atp-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 16px;
                    position: relative;
                    overflow: hidden;
                }

                .atp-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.18;
                    pointer-events: none;
                    z-index: 0;
                }
                .atp-blob--1 {
                    width: 480px; height: 480px;
                    background: radial-gradient(circle, #6366f1, transparent 70%);
                    top: -120px; right: -80px;
                    animation: blobDrift1 14s ease-in-out infinite alternate;
                }
                .atp-blob--2 {
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, #06b6d4, transparent 70%);
                    bottom: -100px; left: -60px;
                    animation: blobDrift2 18s ease-in-out infinite alternate;
                }
                @keyframes blobDrift1 {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(-30px,40px) scale(1.08); }
                }
                @keyframes blobDrift2 {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(20px,-30px) scale(1.05); }
                }

                .atp-card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 520px;
                    background: var(--canvas, #fff);
                    border: 1px solid var(--hairline-soft, rgba(0,0,0,0.08));
                    border-radius: 24px;
                    box-shadow:
                        0 0 0 1px rgba(255,255,255,0.6) inset,
                        0 4px 6px -1px rgba(0,0,0,0.04),
                        0 20px 60px -10px rgba(0,0,0,0.10);
                    padding: 40px;
                    animation: cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .atp-card__header { text-align: center; margin-bottom: 28px; }
                .atp-card__icon {
                    font-size: 36px; margin-bottom: 12px; display: block;
                    animation: iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
                }
                @keyframes iconBounce {
                    from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
                    to   { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                .atp-card__title {
                    font-size: 26px; font-weight: 700;
                    color: var(--ink-deep, #0f172a);
                    letter-spacing: -0.03em; margin: 0 0 6px; line-height: 1.2;
                }
                .atp-card__subtitle {
                    font-size: 14px; color: var(--slate, #64748b);
                    margin: 0; line-height: 1.5;
                }

                .atp-divider {
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--hairline-soft, rgba(0,0,0,0.08)) 20%, var(--hairline-soft, rgba(0,0,0,0.08)) 80%, transparent);
                    margin-bottom: 28px;
                }

                .atp-error {
                    display: flex; align-items: center; gap: 8px;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.25);
                    color: #dc2626;
                    padding: 10px 14px; border-radius: 12px;
                    font-size: 13px; font-weight: 500;
                    margin-bottom: 20px;
                    animation: shake 0.35s ease;
                }
                .atp-error__icon { font-size: 15px; flex-shrink: 0; }
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    25%     { transform: translateX(-5px); }
                    75%     { transform: translateX(5px); }
                }

                .atp-form { display: flex; flex-direction: column; gap: 20px; }

                .atp-field { display: flex; flex-direction: column; gap: 6px; }
                .atp-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

                .atp-label {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; font-weight: 600;
                    color: var(--slate, #64748b);
                    letter-spacing: 0.05em; text-transform: uppercase; cursor: default;
                }
                .atp-label__icon { font-size: 13px; }
                .atp-label__req  { color: #6366f1; font-size: 14px; line-height: 1; }

                .atp-input {
                    width: 100%;
                    padding: 11px 14px;
                    border-radius: 12px;
                    border: 1.5px solid var(--hairline, rgba(0,0,0,0.12));
                    background: var(--surface-soft, #f8fafc);
                    font-size: 15px;
                    font-family: var(--font, inherit);
                    color: var(--ink-deep, #0f172a);
                    box-sizing: border-box;
                    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
                    outline: none;
                    -webkit-appearance: none;
                }
                .atp-input::placeholder { color: var(--slate, #94a3b8); opacity: 0.7; }
                .atp-input--focused {
                    border-color: #40B3E0;
                    background: var(--canvas, #fff);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .atp-input--filled { background: var(--canvas, #fff); }

                /* Textarea — multiline опис */
                .atp-textarea {
                    resize: vertical;
                    min-height: 88px;
                    max-height: 200px;
                    line-height: 1.55;
                    padding-top: 12px;
                    padding-bottom: 12px;
                }

                .atp-input-prefix-wrap { position: relative; display: flex; align-items: center; }
                .atp-prefix {
                    position: absolute; left: 14px;
                    font-size: 15px; font-weight: 600;
                    color: var(--slate, #64748b);
                    pointer-events: none; z-index: 1;
                }
                .atp-input--prefixed { padding-left: 28px; }

                .atp-actions { display: flex; gap: 10px; margin-top: 8px; }

                .atp-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 13px 20px; border-radius: 14px;
                    font-size: 14px; font-weight: 600;
                    font-family: var(--font, inherit);
                    cursor: pointer; border: none;
                    transition: all 0.18s ease; white-space: nowrap;
                }
                .atp-btn--cancel {
                    background: var(--surface-soft, #f1f5f9);
                    color: var(--slate, #64748b);
                    border: 1.5px solid var(--hairline, rgba(0,0,0,0.1));
                    flex-shrink: 0;
                }
                .atp-btn--cancel:hover {
                    background: var(--hairline-soft, #e2e8f0);
                    color: var(--ink-deep, #0f172a);
                }
                .atp-btn--submit {
                    flex: 1;
                    background: linear-gradient(135deg, #40B3E0 0%, #40B3E0 100%);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
                }
                .atp-btn--submit:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
                }
                .atp-btn--submit:active:not(:disabled) { transform: translateY(0); }
                .atp-btn--submit:disabled { opacity: 0.75; cursor: not-allowed; }
                .atp-btn--loading        { pointer-events: none; }
                .atp-btn__arrow { transition: transform 0.18s ease; font-size: 16px; }
                .atp-btn--submit:hover .atp-btn__arrow { transform: translateX(3px); }

                .atp-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Staggered entrance */
                .atp-form > *:nth-child(1) { animation: fieldIn 0.4s ease 0.15s both; }
                .atp-form > *:nth-child(2) { animation: fieldIn 0.4s ease 0.22s both; }
                .atp-form > *:nth-child(3) { animation: fieldIn 0.4s ease 0.29s both; }
                .atp-form > *:nth-child(4) { animation: fieldIn 0.4s ease 0.36s both; }
                .atp-form > *:nth-child(5) { animation: fieldIn 0.4s ease 0.43s both; }
                .atp-form > *:nth-child(6) { animation: fieldIn 0.4s ease 0.50s both; }
                @keyframes fieldIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 560px) {
                    .atp-card { padding: 28px 20px; border-radius: 20px; }
                    .atp-card__title { font-size: 22px; }
                    .atp-row { grid-template-columns: 1fr; gap: 20px; }
                    .atp-actions { flex-direction: column-reverse; }
                    .atp-btn--cancel { flex: none; width: 100%; }
                }
            `}</style>
        </div>
    );
}
