import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface DataCardProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    loading?: boolean;
    error?: Error | null;
    emptyMessage?: string;
    actions?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
    title,
    icon: Icon,
    children,
    loading = false,
    error,
    emptyMessage = "No hay datos disponibles",
    actions,
    className = '',
    contentClassName = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-[var(--black-900)] border border-[#262626] rounded-xl flex flex-col h-full overflow-hidden ${className}`}
        >
            <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[var(--black-900)] sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-1.5 bg-[var(--black-800)] rounded-lg text-[#a3a3a3]">
                            <Icon size={18} />
                        </div>
                    )}
                    <h3 className="font-semibold text-white tracking-wide">{title}</h3>
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>

            <div className={`p-0 flex-1 relative ${contentClassName}`}>
                {loading ? (
                    <div className="p-4">
                        <LoadingSkeleton type="list" count={3} />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-[#737373] h-full">
                        <div className="bg-[var(--color-secondary-500)]/10 text-[var(--color-secondary-500)] p-3 rounded-full mb-3">
                            {Icon ? <Icon size={24} /> : <span className="text-xl font-bold">!</span>}
                        </div>
                        <p className="text-sm">Error al cargar datos</p>
                    </div>
                ) : React.Children.count(children) === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-[#737373] h-full opacity-60">
                        <p className="text-sm italic">{emptyMessage}</p>
                    </div>
                ) : (
                    children
                )}
            </div>
        </motion.div>
    );
};
