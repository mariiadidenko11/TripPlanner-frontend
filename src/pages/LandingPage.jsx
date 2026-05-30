import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCTA = () => {
        if (user) {
            navigate('/trips');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="landing">
        
            <section className="landing__hero">
                <div className="landing__hero-inner">
                    <span className="landing__hero-badge">
                        <span className="landing__hero-badge-dot"></span>
                        Ваш особистий супутник у подорожах.
                    </span>
                    <h1 className="landing__hero-title">
                        Плануйте подорожі, які ви<br />
                        <span className="text-gradient">запам'ятаєте назавжди</span>
                    </h1>
                    <p className="landing__hero-sub">
                        Планувальник подорожей і щоденник, що супроводжує вас — від першого пошуку до останньої спогади.
                    </p>
                    <button className="btn btn--buy-cta btn--pill btn--lg landing__cta" onClick={handleCTA}>
                        Почати планування подорожі →
                    </button>
                </div>

                <div className="landing__collage-container">
                    <div className="landing__collage">
                        <div className="landing__collage-card card-left">
                            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop" alt="Kyoto" />
                        </div>
                        <div className="landing__collage-card card-center">
                            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop" alt="Mountains" />
                        </div>
                        <div className="landing__collage-card card-right">
                            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop" alt="Canyon" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing__stats">
                <div className="landing__stats-grid">
                    <div className="landing__stat-card">
                        <span className="landing__stat-val">50 тис +</span>
                        <span className="landing__stat-lbl">Запланованих подорожей</span>
                    </div>
                    <div className="landing__stat-card">
                        <span className="landing__stat-val">120 +</span>
                        <span className="landing__stat-lbl">Країн охоплено</span>
                    </div>
                    <div className="landing__stat-card">
                        <span className="landing__stat-val">4.9 ★</span>
                        <span className="landing__stat-lbl">Рейтинг користувачів</span>
                    </div>
                    <div className="landing__stat-card">
                        <span className="landing__stat-val">Безкоштовно</span>
                        <span className="landing__stat-lbl">Для старту</span>
                    </div>
                </div>
            </section>
            <section className="landing__features">
                <div className="landing__features-inner">
                    <div className="landing__section-header">
                        <span className="badge badge--promo">ФУНКЦІЇ</span>
                        <h2 className="landing__section-title">Усе необхідне - нічого зайвого</h2>
                        <p className="landing__section-sub">Створено для мандрівників, які люблять і пригоди, і порядок.</p>
                    </div>

                    <div className="landing__feature-grid">
                      
                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Розумне планування подорожей</h3>
                            <p className="landing__feature-desc">Організовуйте напрямки, дати та бюджет в одному зручному та красивому робочому просторі.</p>
                        </div>

                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-orange">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                                    <line x1="17" y1="18" x2="17.01" y2="18"/>
                                    <polyline points="2 10 22 10"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Контроль бюджету</h3>
                            <p className="landing__feature-desc">Організовуйте свої витрати, встановлюйте ліміти та стежте за бюджетом у реальному часі.</p>
                        </div>

                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-pink">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Керування бронюваннями</h3>
                            <p className="landing__feature-desc">Зберігайте квитки, броні готелів та підтвердження в одному безпечному місці.</p>
                        </div>

                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 11 12 14 22 4"/>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Списки справ</h3>
                            <p className="landing__feature-desc">Нічого не забудьте — від пакування валізи до отримання візи.</p>
                        </div>

                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Галерея спогадів</h3>
                            <p className="landing__feature-desc">Завантажуйте фото та нотатки з кожної точки вашої подорожі.</p>
                        </div>

                        <div className="landing__feature-card">
                            <div className="landing__feature-icon-wrapper f-teal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10"/>
                                    <line x1="12" y1="20" x2="12" y2="4"/>
                                    <line x1="6" y1="20" x2="6" y2="14"/>
                                </svg>
                            </div>
                            <h3 className="landing__feature-title">Аналітика та Порівняння</h3>
                            <p className="landing__feature-desc">Порівнюйте бюджети, тривалість та активність усіх ваших подорожей у детальних звітах.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing__reviews">
                <div className="landing__reviews-inner">
                    <div className="landing__section-header">
                        <span className="badge badge--promo">МАНДРІВНИКИ ЦЕ ОБОЖНЮЮТЬ</span>
                        <h2 className="landing__section-title">Історії з дороги</h2>
                        <p className="landing__section-sub">Реальний досвід нашої спільноти мандрівників</p>
                    </div>

                    <div className="landing__review-grid">
                     
                        <div className="landing__review-card">
                            <div className="landing__review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F7B928" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="landing__review-text">
                                BezMezh змінив те, як я планую подорожі. Це єдиний інструмент, який настільки ж красивий, як і місця, які я відвідую.
                            </p>
                            <div className="landing__review-user">
                                <div className="landing__review-avatar a-blue">С</div>
                                <div className="landing__review-info">
                                    <h4 className="landing__review-name">Софія К.</h4>
                                    <p className="landing__review-role">Фотограф і мандрівник</p>
                                </div>
                            </div>
                        </div>

                        <div className="landing__review-card">
                            <div className="landing__review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F7B928" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="landing__review-text">
                                Дуже сподобалось, все зроблено на найвищому рівні, особливо вразило бронювання, воно максимально зручне і зрозуміле, і всі нотатки завжди під рукою в одному місці
                            </p>
                            <div className="landing__review-user">
                                <div className="landing__review-avatar a-purple">М</div>
                                <div className="landing__review-info">
                                    <h4 className="landing__review-name">Максим Д.</h4>
                                    <p className="landing__review-role">Дизайнер</p>
                                </div>
                            </div>
                        </div>

                        <div className="landing__review-card">
                            <div className="landing__review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F7B928" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="landing__review-text">
                                Мені подобається, що цей додаток не перевантажений, а також, що можна додавати свої фото і зберігати спогади прямо в кожній поїздці!
                            </p>
                            <div className="landing__review-user">
                                <div className="landing__review-avatar a-orange">А</div>
                                <div className="landing__review-info">
                                    <h4 className="landing__review-name">Андрій М.</h4>
                                    <p className="landing__review-role">Маркетолог</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing__bottom-cta">
                <div className="landing__bottom-cta-inner">
                    <h2 className="landing__bottom-cta-title">Ваша наступна пригода починається тут</h2>
                    <p className="landing__bottom-cta-sub">
                        Приєднуйтесь до тисяч мандрівників, які розумніше планують і<br />
                        краще ведуть свої подорожні щоденники
                    </p>
                    <button className="btn btn--pill btn--lg landing__cta-white" onClick={handleCTA}>
                        Почніть безкоштовно — банківська карта не потрібна
                    </button>
                </div>
            </section>

            <style>{`
                .landing {
                    background: var(--canvas);
                    color: var(--ink-deep);
                    overflow-x: hidden;
                }
                .landing__hero {
                    padding: var(--sp-20) 0 var(--sp-12);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    position: relative;
                }
                .landing__hero-inner {
                    max-width: 800px;
                    padding: 0 var(--sp-4);
                    margin-bottom: var(--sp-16);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .landing__hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--sp-2);
                    background: var(--primary-soft);
                    color: var(--primary);
                    font-size: 13px;
                    font-weight: 600;
                    padding: 6px 14px;
                    border-radius: var(--radius-full);
                    margin-bottom: var(--sp-8);
                }
                .landing__hero-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 50%;
                }
                .landing__hero-title {
                    font-size: clamp(32px, 5vw, 64px);
                    font-weight: 600;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    margin-bottom: var(--sp-6);
                    color: var(--ink-deep);
                }
                .text-gradient {
                    background: linear-gradient(135deg, var(--primary), var(--primary-deep));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .landing__hero-sub {
                    font-size: clamp(16px, 1.8vw, 22px);
                    color: var(--slate);
                    max-width: 660px;
                    margin-bottom: var(--sp-10);
                    line-height: 1.5;
                }
                .landing__cta {
                    box-shadow: 0 4px 14px rgba(64, 179, 224, 0.2);
                    transition: transform var(--t-fast), box-shadow var(--t-fast);
                }
                .landing__cta:hover {
                    transform: scale(1.03);
                    box-shadow: 0 6px 20px rgba(64, 179, 224, 0.3);
                }
                .landing__cta:active {
                    transform: scale(0.98);
                }
                
                /* Collage Styles */
                .landing__collage-container {
                    width: 100%;
                    max-width: 900px;
                    padding: 0 var(--sp-4);
                    display: flex;
                    justify-content: center;
                }
                .landing__collage {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    height: 380px;
                    width: 100%;
                    max-width: 600px;
                    margin-top: var(--sp-4);
                }
                .landing__collage-card {
                    position: absolute;
                    width: 240px;
                    height: 240px;
                    border-radius: var(--radius-xxxl);
                    overflow: hidden;
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
                    background: var(--canvas);
                    border: 4px solid var(--canvas);
                    transition: transform var(--t-base), box-shadow var(--t-base);
                    cursor: pointer;
                }
                .landing__collage-card:hover {
                    z-index: 10 !important;
                    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
                }
                .landing__collage-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .card-left {
                    transform: translateX(-130px) translateY(20px) rotate(-8deg);
                    z-index: 1;
                }
                .card-left:hover {
                    transform: translateX(-140px) translateY(10px) rotate(-4deg) scale(1.05);
                }
                .card-center {
                    width: 280px;
                    height: 280px;
                    z-index: 2;
                    transform: translateY(-10px);
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
                }
                .card-center:hover {
                    transform: translateY(-20px) scale(1.05);
                }
                .card-right {
                    transform: translateX(130px) translateY(20px) rotate(8deg);
                    z-index: 1;
                }
                .card-right:hover {
                    transform: translateX(140px) translateY(10px) rotate(4deg) scale(1.05);
                }

                /* Stats grid */
                .landing__stats {
                    padding: var(--sp-12) 0;
                    border-top: 1px solid var(--hairline-soft);
                    border-bottom: 1px solid var(--hairline-soft);
                    background: var(--canvas);
                }
                .landing__stats-grid {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 var(--sp-8);
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    text-align: center;
                }
                .landing__stat-card {
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-1);
                    border-right: 1px solid var(--hairline-soft);
                }
                .landing__stat-card:last-child {
                    border-right: none;
                }
                .landing__stat-val {
                    font-size: 28px;
                    font-weight: 600;
                    color: var(--ink-deep);
                    letter-spacing: -0.02em;
                }
                .landing__stat-lbl {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--slate);
                }

                /* Features section */
                .landing__features {
                    background: var(--canvas);
                    padding: var(--sp-20) 0;
                }
                .landing__features-inner {
                    max-width: var(--container-wide);
                    margin: 0 auto;
                    padding: 0 var(--sp-8);
                }
                .landing__section-header {
                    text-align: center;
                    margin-bottom: var(--sp-16);
                }
                .landing__section-title {
                    font-size: clamp(28px, 4vw, 40px);
                    font-weight: 600;
                    color: var(--ink-deep);
                    margin: var(--sp-4) 0 var(--sp-3);
                    letter-spacing: -0.02em;
                }
                .landing__section-sub {
                    font-size: 17px;
                    color: var(--slate);
                }
                .landing__feature-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--sp-8);
                }
                .landing__feature-card {
                    background: var(--canvas);
                    padding: var(--sp-10);
                    border-radius: var(--radius-xxl);
                    border: 1px solid var(--hairline-soft);
                    transition: transform var(--t-base), box-shadow var(--t-base), border-color var(--t-base);
                    cursor: pointer;
                }
                .landing__feature-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
                    border-color: var(--hairline);
                }
                .landing__feature-card:active {
                    transform: scale(0.99);
                }
                .landing__feature-icon-wrapper {
                    width: 54px;
                    height: 54px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--sp-6);
                }
                .f-blue { background: var(--primary-soft); color: var(--primary); }
                .f-orange { background: rgba(249, 115, 22, 0.1); color: #F97316; }
                .f-pink { background: rgba(236, 72, 153, 0.1); color: #EC4899; }
                .f-green { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
                .f-purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
                .f-teal { background: rgba(20, 184, 166, 0.1); color: #20B8A6; }

                .landing__feature-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--ink-deep);
                    margin-bottom: var(--sp-3);
                }
                .landing__feature-desc {
                    font-size: 15px;
                    color: var(--slate);
                    line-height: 1.6;
                }

                /* Reviews section */
                .landing__reviews {
                    padding: var(--sp-20) 0;
                    background: var(--surface-soft);
                }
                .landing__reviews-inner {
                    max-width: var(--container-wide);
                    margin: 0 auto;
                    padding: 0 var(--sp-8);
                }
                .landing__review-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--sp-8);
                }
                .landing__review-card {
                    background: var(--canvas);
                    padding: var(--sp-10);
                    border-radius: var(--radius-xxl);
                    border: 1px solid var(--hairline-soft);
                    transition: transform var(--t-base), box-shadow var(--t-base);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }
                .landing__review-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
                }
                .landing__review-stars {
                    display: flex;
                    gap: 4px;
                    margin-bottom: var(--sp-4);
                }
                .landing__review-text {
                    font-size: 15px;
                    color: var(--ink);
                    line-height: 1.6;
                    margin-bottom: var(--sp-8);
                    flex-grow: 1;
                }
                .landing__review-user {
                    display: flex;
                    align-items: center;
                    gap: var(--sp-3);
                }
                .landing__review-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: white;
                    font-size: 18px;
                }
                .a-blue { background: var(--primary); }
                .a-purple { background: #8B5CF6; }
                .a-orange { background: #F97316; }

                .landing__review-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .landing__review-role {
                    font-size: 13px;
                    color: var(--slate);
                }

                /* Bottom CTA section */
                .landing__bottom-cta {
                    background: var(--primary);
                    padding: var(--sp-20) 0;
                    text-align: center;
                    color: white;
                }
                .landing__bottom-cta-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 var(--sp-4);
                }
                .landing__bottom-cta-title {
                    font-size: clamp(32px, 5vw, 48px);
                    font-weight: 600;
                    margin-bottom: var(--sp-6);
                    letter-spacing: -0.03em;
                }
                .landing__bottom-cta-sub {
                    font-size: 18px;
                    opacity: 0.9;
                    margin-bottom: var(--sp-10);
                    line-height: 1.5;
                }
                .landing__cta-white {
                    background: white;
                    color: var(--primary);
                    font-weight: 600;
                    padding: 18px 36px;
                    font-size: 16px;
                    border-radius: var(--radius-full);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    transition: transform var(--t-fast), box-shadow var(--t-fast);
                }
                .landing__cta-white:hover {
                    transform: scale(1.03);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                }
                .landing__cta-white:active {
                    transform: scale(0.98);
                }

                .badge--promo {
                    background: var(--primary-soft);
                    color: var(--primary);
                    font-size: 11px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    letter-spacing: 0.05em;
                }

                @media (max-width: 1000px) {
                    .landing__feature-grid, .landing__review-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .landing__stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .landing__stat-card:nth-child(2) {
                        border-right: none;
                    }
                    .landing__stat-card:nth-child(n+3) {
                        border-top: 1px solid var(--hairline-soft);
                        padding-top: var(--sp-6);
                    }
                }
                @media (max-width: 768px) {
                    .landing__feature-grid, .landing__review-grid {
                        grid-template-columns: 1fr;
                    }
                    .landing__stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .landing__stat-card {
                        border-right: none;
                        border-bottom: 1px solid var(--hairline-soft);
                        padding-bottom: var(--sp-6);
                    }
                    .landing__stat-card:last-child {
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
}
