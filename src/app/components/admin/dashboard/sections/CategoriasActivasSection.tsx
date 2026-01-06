import { motion } from 'framer-motion';
import { Trophy, Activity, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { CategoriaActiva } from '@/app/types/admin.types';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';
import { LoadingSkeleton } from '@/app/components/admin/dashboard/base/LoadingSkeleton';

interface CategoriasActivasSectionProps {
    data: CategoriaActiva[] | null;
    loading: boolean;
    error: Error | null;
}

export const CategoriasActivasSection: React.FC<CategoriasActivasSectionProps> = ({ data, loading, error }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Calcular número de columnas dinámicamente basado en la cantidad de items
    const getGridCols = (count: number) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <LoadingSkeleton type="card" count={3} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[var(--color-secondary-500)]/10 border border-[var(--color-secondary-500)]/20 rounded-xl p-6 text-center text-[var(--color-secondary-500)]">
                <Activity className="mx-auto mb-2" size={24} />
                <p>Error al cargar categorías activas</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center text-[#737373]">
                <Trophy className="mx-auto mb-3 opacity-50" size={32} />
                <p>No hay categorías activas en este momento</p>
                <div className="mt-4"><Badge variant="neutral">Sin Actividad</Badge></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={`grid ${getGridCols(data.length)} gap-4 w-full`}
        >
            {data.map((cat) => (
                <Link
                    key={cat.id_categoria_edicion}
                    href={`/adm/ediciones/${cat.id_edicion}/${cat.id_categoria_edicion}/resumen`}
                    className="block"
                >
                    <motion.div
                        variants={item}
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-[var(--black-900)] border border-[#262626] hover:border-[var(--color-primary)]/30 rounded-xl p-5 flex flex-col justify-between group cursor-pointer h-full"
                    >
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-[var(--black-800)] rounded-lg text-white group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors duration-300">
                            <Trophy size={18} />
                        </div>
                        <Badge variant="success">Activa</Badge>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-1 line-clamp-1" title={cat.nombre_completo}>
                            {cat.nombre_completo}
                        </h4>
                        <div className="text-sm text-[#737373] flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{cat.nombre_edicion || 'Edición General'}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#262626] flex justify-between items-center text-xs text-[#a3a3a3]">
                        <span>ID: {cat.id_categoria_edicion}</span>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                            Online
                        </div>
                    </div>
                    </motion.div>
                </Link>
            ))}
        </motion.div>
    );
};
