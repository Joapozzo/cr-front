import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ChartCardProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactElement; // Expecting a wrapper around Recharts component
    loading?: boolean;
    error?: Error | null;
    height?: number | string;
    description?: string;
    className?: string; // Additional classes for the container
}

export const ChartCard: React.FC<ChartCardProps> = ({
    title,
    icon: Icon,
    children,
    loading = false,
    error,
    height = 300,
    description,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`bg-[var(--black-900)] border border-[#262626] rounded-xl p-5 flex flex-col ${className}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {Icon && <Icon size={16} className="text-[#737373]" />}
                        <h3 className="font-semibold text-white">{title}</h3>
                    </div>
                    {description && <p className="text-xs text-[#737373]">{description}</p>}
                </div>
            </div>

            <div style={{ height }} className="w-full relative">
                {loading ? (
                    <LoadingSkeleton type="chart" className="h-full border-none p-0 bg-transparent" />
                ) : error ? (
                    <div className="h-full flex items-center justify-center text-[#737373] text-sm bg-[var(--black-800)]/30 rounded-lg">
                        Datos no disponibles
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};
