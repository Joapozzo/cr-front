interface InfoFieldProps {
    label: string;
    value: string | number | null | undefined;
    variant?: 'default' | 'error';
    className?: string;
}

export const InfoField = ({ label, value, variant = 'default', className = '' }: InfoFieldProps) => {
    if (!value) return null;

    const textColor = variant === 'error' ? 'text-[var(--red)]' : 'text-[var(--white)]';
    const labelColor = variant === 'error' ? 'text-[var(--red)]' : 'text-[var(--gray-100)]';

    return (
        <div className={className}>
            <span className={`${labelColor} text-sm`}>{label}:</span>
            <p className={`${textColor} mt-1 font-medium`}>{value}</p>
        </div>
    );
};

