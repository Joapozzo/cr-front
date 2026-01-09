import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import React from 'react';
import { PartidoEnVivo } from '@/app/types/admin.types';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';
import { LoadingSkeleton } from '@/app/components/admin/dashboard/base/LoadingSkeleton';
import { PartidoEnVivoCard } from './PartidoEnVivoCard';
import { useCurrentTime } from '@/app/hooks/useCurrentTime';

interface PartidosEnVivoSectionProps {
    data: PartidoEnVivo[] | null;
    loading: boolean;
    error: Error | null;
}

export const PartidosEnVivoSection: React.FC<PartidosEnVivoSectionProps> = ({ data, loading, error }) => {
    // Hook personalizado que actualiza el tiempo cada minuto para recalcular tiempo transcurrido
    // Al actualizar el estado, el componente se re-renderiza y todos los hijos también
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _currentTime = useCurrentTime(); // Solo usado para trigger re-render, el valor no se necesita directamente

    if (loading) return <LoadingSkeleton type="card" count={2} className="h-40" />;

    if (error) {
        return (
            <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl p-6 text-center text-[var(--color-danger)]">
                <PlayCircle className="mx-auto mb-2" size={24} />
                <p>Error al cargar partidos en vivo</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center text-[#737373] flex flex-col items-center">
                <PlayCircle className="mb-3 opacity-30" size={40} />
                <p>No hay partidos en vivo en este momento</p>
                <div className="mt-2 text-xs text-[#555]">Los partidos aparecerán aquí cuando comiencen</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 rounded-full bg-[var(--color-danger)]"
                />
                <h2 className="text-xl font-bold text-white tracking-tight">EN VIVO</h2>
                <Badge variant="danger" className="ml-2">{data.length} {data.length > 1 ? 'PARTIDOS' : 'PARTIDO'}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode='popLayout'>
                    {data.map((partido) => (
                        <PartidoEnVivoCard key={partido.id_partido} partido={partido} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
