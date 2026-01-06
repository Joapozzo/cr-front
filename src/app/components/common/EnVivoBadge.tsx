import React from 'react';

interface EnVivoBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const EnVivoBadge: React.FC<EnVivoBadgeProps> = ({ 
    size = 'md',
    className = '' 
}) => {
    const sizeClasses = {
        sm: {
            container: 'px-2 py-0.5 gap-1',
            dot: 'w-1 h-1',
            text: 'text-[9px]'
        },
        md: {
            container: 'px-3 py-1 gap-1.5',
            dot: 'w-2 h-2',
            text: 'text-[10px]'
        },
        lg: {
            container: 'px-4 py-1.5 gap-2',
            dot: 'w-2.5 h-2.5',
            text: 'text-xs'
        }
    };

    const classes = sizeClasses[size];

    return (
        <div className={`flex items-center ${classes.container} bg-[#1a1a1a] rounded-full border border-[#262626] ${className}`}>
            <div className="relative flex items-center justify-center">
                <div className={`absolute ${classes.dot} bg-[var(--color-primary)] rounded-full animate-ping opacity-75`} />
                <div className={`relative ${classes.dot} bg-[var(--color-primary)] rounded-full`} />
            </div>
            <span className={`text-[var(--color-primary)] ${classes.text} font-semibold uppercase`}>
                En Vivo
            </span>
        </div>
    );
};

