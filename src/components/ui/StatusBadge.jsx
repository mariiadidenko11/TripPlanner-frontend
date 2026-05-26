import Badge from './Badge';

const STATUS_CONFIG = {
    active: { label: 'Активна', variant: 'active' },
    waiting: { label: 'В очікуванні', variant: 'waiting' },
    completed: { label: 'Завершена', variant: 'completed' }
};

export default function StatusBadge({ status, className = '', variant }) {
    const config = STATUS_CONFIG[status] || { label: status, variant: 'primary' };
    
    return (
        <Badge variant={variant || config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
