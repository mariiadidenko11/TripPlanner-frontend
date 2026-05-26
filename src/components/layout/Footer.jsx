

import React from 'react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
    return (
        <footer className="footer-branded">
            <div className="footer-branded__inner">
                <div className="footer-branded__brand">
                    {/* Minimalist Logo (Static) */}
                    <div className="footer-branded__logo-wrap">
                        <svg
                            viewBox="0 0 32 32"
                            width="48"
                            height="48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="16" cy="16" r="12" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
                            <path d="M4 16H28" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                            <path d="M16 4V28" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                            <ellipse cx="16" cy="16" rx="6" ry="12" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                            <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                            <g style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                                <path d="M16 2 L18 6 L16 5 L14 6 L16 2Z" fill="white" transform="rotate(45 16 2)" />
                            </g>
                        </svg>
                    </div>
                    
                    <h2 className="footer-branded__title">БезМеж</h2>
                    <p className="footer-branded__tagline">— подорожі без меж —</p>
                </div>
                
                <div className="footer-branded__bottom">
                    <p className="footer-branded__copy">
                        © 2026 БезМеж. Створено з турботою для допитливих мандрівників
                    </p>
                </div>
            </div>

            <style>{`
                .footer-branded {
                    background-color: var(--footer-bg);
                    color: white;
                    padding: var(--sp-12) 0 var(--sp-8);
                    width: 100%;
                    margin-top: auto;
                }
                .footer-branded__inner {
                    max-width: var(--container-wide);
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 0 var(--sp-4);
                }
                .footer-branded__brand {
                    margin-bottom: var(--sp-8);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .footer-branded__logo-wrap {
                    margin-bottom: var(--sp-4);
                }
                .footer-branded__title {
                    font-size: 28px;
                    font-weight: 600;
                    margin: var(--sp-2) 0 0;
                    letter-spacing: -0.01em;
                    color: white;
                }
                .footer-branded__tagline {
                    font-size: 14px;
                    opacity: 0.9;
                    margin-top: var(--sp-1);
                    letter-spacing: 0.05em;
                }
                .footer-branded__bottom {
                    width: 100%;
                    padding-top: var(--sp-6);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                .footer-branded__copy {
                    font-size: 13px;
                    opacity: 0.8;
                    margin: 0;
                }
            `}</style>
        </footer>
    );
}
