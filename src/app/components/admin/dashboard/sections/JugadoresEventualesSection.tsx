import { motion } from 'framer-motion';
import { UserPlus, User } from 'lucide-react';
import React from 'react';
import { JugadorEventual } from '@/app/types/admin.types';
import { DataCard } from '@/app/components/admin/dashboard/base/DataCard';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';

interface JugadoresEventualesSectionProps {
    data: JugadorEventual[] | null;
    loading: boolean;
    error: Error | null;
}

export const JugadoresEventualesSection: React.FC<JugadoresEventualesSectionProps> = ({ data, loading, error }) => {
    const sortedData = React.useMemo(() => {
        return data?.slice().sort((a, b) => a.partidos_restantes - b.partidos_restantes) || [];
    }, [data]);

    return (
        <DataCard
            title="Jugadores eventuales"
            icon={UserPlus}
            loading={loading}
            error={error}
            emptyMessage="No hay jugadores eventuales registrados"
            className="h-[450px]"
            contentClassName="overflow-y-auto custom-scrollbar"
        >
            <div className="space-y-1 p-2">
                {sortedData.map((jugador, index) => {
                    // Logic for status color
                    const isCritical = jugador.partidos_restantes === 0;
                    const isWarning = jugador.partidos_restantes <= 1;

                    const progress = jugador.limite_partidos_eventuales
                        ? (jugador.partidos_eventuales_jugados / jugador.limite_partidos_eventuales) * 100
                        : 0;

                    return (
                        <motion.div
                            key={jugador.id_jugador}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[var(--black-800)]/20 hover:bg-[var(--black-800)]/60 rounded-lg p-3 border border-transparent hover:border-[#333] transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#555] border border-[#262626]">
                                    <User size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">{jugador.jugador.nombre} {jugador.jugador.apellido}</h4>
                                    <p className="text-[10px] text-[#737373] uppercase tracking-wide">{jugador.equipo.nombre} • {jugador.categoria}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block w-24">
                                    <div className="flex justify-between text-[9px] text-[#a3a3a3] mb-1">
                                        <span>Jugados</span>
                                        <span>{jugador.partidos_eventuales_jugados}/{jugador.limite_partidos_eventuales || '-'}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[var(--black-900)] rounded-full overflow-hidden border border-[#262626]">
                                        <div
                                            className={`h-full rounded-full ${isCritical ? 'bg-[var(--red-500)]' : 'bg-[var(--blue-500)]'}`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="text-center min-w-[3rem]">
                                    <span className={`text-sm font-bold ${isCritical ? 'text-[var(--red-500)]' : isWarning ? 'text-[var(--yellow-500)]' : 'text-[var(--green)]'}`}>
                                        {jugador.partidos_restantes}
                                    </span>
                                    <p className="text-[8px] text-[#555] uppercase">Restan</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </DataCard>
    );
};
