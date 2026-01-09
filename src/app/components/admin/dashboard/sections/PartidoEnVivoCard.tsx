import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { PartidoEnVivo } from '@/app/types/admin.types';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface PartidoEnVivoCardProps {
    partido: PartidoEnVivo;
}

// Función helper para formatear el estado del partido
const getEstadoLabel = (estado: string): string => {
    const estados: Record<string, string> = {
        'C1': '1T',
        'E': 'ET',
        'C2': '2T',
        'T': 'TE'
    };
    return estados[estado] || estado;
};

/**
 * Calcula el tiempo transcurrido del partido en minutos.
 * Si existe tiempo_transcurrido_minutos lo usa, sino calcula desde hora_inicio.
 * @param currentTime - Timestamp actual para calcular la diferencia con hora_inicio
 */
const calcularTiempoTranscurrido = (partido: PartidoEnVivo, currentTime: number): number | null => {
    if (partido.tiempo_transcurrido_minutos !== null && partido.tiempo_transcurrido_minutos !== undefined) {
        return partido.tiempo_transcurrido_minutos;
    }

    if (partido.hora_inicio) {
        const inicio = new Date(partido.hora_inicio);
        const diferencia = currentTime - inicio.getTime();
        return Math.floor(diferencia / (1000 * 60));
    }

    return null;
};

export const PartidoEnVivoCard: React.FC<PartidoEnVivoCardProps> = ({ partido }) => {
    // Calcular tiempo transcurrido basándose en el tiempo actual
    // Este componente se re-renderiza cuando el componente padre actualiza su currentTime
    const tiempoTranscurrido = calcularTiempoTranscurrido(partido, Date.now());

    return (
        <Link
            href={`/planillero/partidos/${partido.id_partido}`}
            className="block"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                layout
                className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden relative group cursor-pointer"
            >
                {/* Live Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <motion.div
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="bg-[var(--color-secondary-500)] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        {getEstadoLabel(partido.estado)}
                    </motion.div>
                </div>

                <div className="p-4 pt-8">
                    <div className="flex justify-between items-center mb-6 px-2">
                        {/* Local */}
                        <div className="text-center flex-1">
                            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center">
                                <EscudoEquipo
                                    src={partido.equipoLocal.img}
                                    alt={partido.equipoLocal.nombre}
                                    width={26}
                                    height={26}
                                />
                            </div>
                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 h-8 flex items-center justify-center">
                                {partido.equipoLocal.nombre}
                            </h3>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center justify-center px-2">
                            <div className="text-3xl font-black text-white tracking-widest bg-[var(--black-800)] px-3 py-1 rounded-lg border border-[#333]">
                                {partido.goles_local ?? 0}-{partido.goles_visita ?? 0}
                            </div>
                            {tiempoTranscurrido !== null && tiempoTranscurrido >= 0 && (
                                <div className="text-[10px] text-[var(--color-primary)] mt-1 font-mono flex items-center gap-1">
                                    <Clock size={10} />
                                    {tiempoTranscurrido}&apos;
                                </div>
                            )}
                        </div>

                        {/* Visita */}
                        <div className="text-center flex-1">
                            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center">
                                <EscudoEquipo
                                    src={partido.equipoVisita.img}
                                    alt={partido.equipoVisita.nombre}
                                    width={26}
                                    height={26}
                                />
                            </div>
                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 h-8 flex items-center justify-center">
                                {partido.equipoVisita.nombre}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-[var(--black-800)]/50 p-2 rounded-lg flex justify-between items-center text-xs text-[#737373]">
                        <span className="truncate max-w-[50%]">{partido.categoria}</span>
                        <span>{partido.zona || 'Zona General'}</span>
                    </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-secondary-500)] via-[var(--orange-500)] to-[var(--color-secondary-500)] opacity-50"></div>
            </motion.div>
        </Link>
    );
};

