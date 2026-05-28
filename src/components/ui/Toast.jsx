

import { useEffect, useState } from 'react';

const listeners = new Set();

export function toast(message, type = 'success', duration = 3400) {
    listeners.forEach(fn => fn({ message, type, duration }));
}

export function ToastContainer() {
    const [item, setItem] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let hideTimer;
        const handler = ({ message, type, duration }) => {
            setItem({ message, type });
            setVisible(true);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => setVisible(false), duration);
        };
        listeners.add(handler);
        return () => { listeners.delete(handler); clearTimeout(hideTimer); };
    }, []);

    const COLORS = {
        success: '#27AE60', error: '#EF4444',
        warning: '#F59E0B', info: '#40B3E0',
    };

    if (!item) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                position: 'fixed',
                bottom: '28px',
                left: '50%',
                transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
                opacity: visible ? 1 : 0,
                background: '#1A1A1A',
                color: '#fff',
                padding: '13px 22px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 32px rgba(0,0,0,.22)',
                zIndex: 9999,
                transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s',
                pointerEvents: 'none',
                maxWidth: '90vw',
                whiteSpace: 'nowrap',
                borderLeft: `4px solid ${COLORS[item.type] || COLORS.info}`,
            }}
        >
            {item.message}
        </div>
    );
}




