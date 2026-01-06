import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        label: string;
        positive: boolean;
    };
    color?: string;
    onClick?: () => void;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "var(--color-primary)",
    onClick,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                bg-[var(--black-900)] border border-[#262626] rounded-xl p-5 
                flex flex-col justify-between h-full relative overflow-hidden group
                ${onClick ? 'cursor-pointer hover:border-[var(--color-primary)]/50' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1 z-10">
                    <h3 className="text-[#a3a3a3] text-sm font-medium uppercase tracking-wider">{title}</h3>
                    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                </div>
                <div
                    className="p-2.5 rounded-lg bg-[var(--black-800)] group-hover:bg-[#262626] transition-colors"
                    style={{ color: color }}
                >
                    <Icon size={20} />
                </div>
            </div>

            {(subtitle || trend) && (
                <div className="flex items-center text-xs z-10">
                    {trend && (
                        <span className={`font-semibold mr-2 ${trend.positive ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary-500)]'}`}>
                            {trend.positive ? '+' : ''}{trend.value}%
                        </span>
                    )}
                    {subtitle && <span className="text-[#737373]">{subtitle}</span>}
                </div>
            )}

            {/* Background decoration */}
            <div
                className="absolute -bottom-4 -right-4 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                style={{ color: color }}
            >
                <Icon size={100} />
            </div>
        </motion.div>
    );
};
