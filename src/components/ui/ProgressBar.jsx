export default function ProgressBar({ value = 0, variant = '', thin = false }) {
    const cls = ['progress', variant && `progress--${variant}`, thin && 'progress--thin']
        .filter(Boolean).join(' ');
    return (
        <div className={cls}>
            <div className="progress__fill" style={{ width: `${Math.min(100, value)}%` }} />
        </div>
    );
}