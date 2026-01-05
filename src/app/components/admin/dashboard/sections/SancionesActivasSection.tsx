import { motion } from 'framer-motion';
import { Gavel, AlertTriangle, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SancionActiva } from '@/app/types/admin.types';
import { DataCard } from '@/app/components/admin/dashboard/base/DataCard';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';
import Image from 'next/image';

interface SancionesActivasSectionProps {
    data: SancionActiva[] | null;
    loading: boolean;
    error: Error | null;
}

export const SancionesActivasSection: React.FC<SancionesActivasSectionProps> = ({ data, loading, error }) => {
    // Ordenar: mayor a menor fechas restantes
    const sortedData = React.useMemo(() => {
        return data?.slice().sort((a, b) => (b.fechas_restantes || 0) - (a.fechas_restantes || 0)) || [];
    }, [data]);

    return (
        <DataCard
            title="Sanciones activas"
            icon={Gavel}
            loading={loading}
            error={error}
            emptyMessage="No hay jugadores sancionados actualmente"
            className="h-[450px]"
            contentClassName="overflow-y-auto custom-scrollbar"
        >
            <div className="space-y-0 divide-y divide-[#262626]">
                {sortedData.map((sancion, index) => (
                    <Link
                        key={sancion.id_expulsion}
                        href={`/adm/sanciones?id_expulsion=${sancion.id_expulsion}`}
                        className="block"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-[var(--black-800)]/30 transition-colors flex items-center gap-4 group cursor-pointer"
                        >
                        <div className="relative w-10 h-10 rounded-full bg-[var(--black-800)] overflow-hidden shrink-0 border border-[#333]">
                            <User className="w-full h-full p-2 text-[#737373]" />
                            {/* Fallback above, image would be better but keeping simple without external loader issues
                                 In real app: <Image ... />
                             */}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white truncate pr-2">
                                    {sancion.jugador.nombre} {sancion.jugador.apellido}
                                </h4>
                                <Badge variant={sancion.tipo_tarjeta?.toLowerCase().includes('roja') ? 'danger' : 'warning'}>
                                    {sancion.tipo_tarjeta || 'Sanción'}
                                </Badge>
                            </div>
                            <p className="text-xs text-[#737373] mt-0.5 truncate">
                                {sancion.equipo.nombre} • {sancion.categoria}
                            </p>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end">
                            <span
                                className={`text-lg font-bold ${(sancion.fechas_restantes || 0) > 3 ? 'text-[var(--red-500)]' : 'text-[var(--yellow-500)]'
                                    }`}
                            >
                                {sancion.fechas_restantes}
                            </span>
                            <span className="text-[10px] uppercase text-[#666]">Fechas</span>
                        </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </DataCard>
    );
};
