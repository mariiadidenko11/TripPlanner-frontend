import { Link } from 'react-router-dom';

export default function Logo({ size = 32, showText = true, className = "" }) {
    return (
        <Link to="/" className={`nav__logo ${className}`} aria-label="БезМеж - На головну">
            <div className="logo-container" style={{ width: size, height: size }}>
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    {/* Globe */}
                    <circle cx="16" cy="16" r="12" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.5" />
                    <path d="M4 16H28" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d="M16 4V28" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
                    <ellipse cx="16" cy="16" rx="6" ry="12" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
                    
                    {/* Plane Path / Orbit (Static) */}
                    <circle cx="16" cy="16" r="14" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="4 4" className="logo-orbit" />
                    
                    {/* Plane (Static Position) */}
                    <g className="logo-plane" style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                        <path 
                            d="M16 2 L18 6 L16 5 L14 6 L16 2Z" 
                            fill="var(--primary-deep)" 
                            transform="rotate(45 16 2)"
                        />
                    </g>
                </svg>
            </div>
            {showText && <span className="nav__logo-text">БезМеж</span>}
            <style>{`
                .nav__logo { 
                    display: flex; 
                    align-items: center; 
                    gap: var(--sp-2); 
                    text-decoration: none;
                    transition: transform var(--t-fast);
                }
                .nav__logo:hover {
                    transform: scale(1.05);
                }
                .logo-container {
                    position: relative;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav__logo-text { 
                    font-size: 18px; 
                    font-weight: 600; 
                    color: var(--ink-deep); 
                    letter-spacing: -0.01em;
                }
                .logo-orbit {
                    transform-origin: center;
                    opacity: 0.3;
                }
                .logo-plane {
                    transform-origin: center;
                }
            `}</style>
        </Link>
    );
}


