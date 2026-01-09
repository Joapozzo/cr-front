import { motion } from 'framer-motion';
import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variants: Record<BadgeVariant, string> = {
    success: 'bg-[var(--color-primary-opacity)] text-[var(--color-primary)] border-[var(--color-primary)]',
    warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]',
    info: 'bg-[var(--blue-500)]/10 text-[var(--blue-500)] border-[var(--blue-500)]',
    neutral: 'bg-[var(--gray-700)] text-[var(--gray-100)] border-[var(--gray-600)]'
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                border-opacity-20 backdrop-blur-sm
                ${variants[variant]} 
                ${className}
            `}
        >
            {children}
        </motion.span>
    );
};
