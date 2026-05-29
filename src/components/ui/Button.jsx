

const SpinnerSVG = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{ animation: 'spin .7s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
);

export default function Button({
    children,
    variant = 'primary',  
    size = 'md',         
    rounded = 'full',
    loading = false,
    loadingText = 'Loading...',
    className = '',
    type = 'button',
    disabled,
    ...props
}) {
    const classes = [
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        rounded === 'full' && 'btn--pill',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <SpinnerSVG />{loadingText}
                </span>
            ) : children}
        </button>
    );
}
