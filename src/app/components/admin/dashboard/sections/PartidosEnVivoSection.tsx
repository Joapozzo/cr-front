import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PartidoEnVivo } from '@/app/types/admin.types';
import { Badge } from '@/app/components/admin/dashboard/base/Badge';
import { LoadingSkeleton } from '@/app/components/admin/dashboard/base/LoadingSkeleton';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface PartidosEnVivoSectionProps {
    data: PartidoEnVivo[] | null;
    loading: boolean;
    error: Error | null;
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

export const PartidosEnVivoSection: React.FC<PartidosEnVivoSectionProps> = ({ data, loading, error }) => {
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Auto update timer every minute para recalcular tiempo transcurrido
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return <LoadingSkeleton type="card" count={2} className="h-40" />;

    if (error) {
        return (
            <div className="bg-[var(--color-secondary-500)]/10 border border-[var(--color-secondary-500)]/20 rounded-xl p-6 text-center text-[var(--color-secondary-500)]">
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
                    className="w-3 h-3 rounded-full bg-[var(--color-secondary-500)]"
                />
                <h2 className="text-xl font-bold text-white tracking-tight">EN VIVO</h2>
                <Badge variant="danger" className="ml-2">{data.length} {data.length > 1 ? 'PARTIDOS' : 'PARTIDO'}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode='popLayout'>
                    {data.map((partido) => {
                        // Calcular tiempo transcurrido si existe hora_inicio
                        let tiempoTranscurrido = partido.tiempo_transcurrido_minutos;
                        if (partido.hora_inicio && !tiempoTranscurrido) {
                            const ahora = new Date();
                            const inicio = new Date(partido.hora_inicio);
                            const diferencia = ahora.getTime() - inicio.getTime();
                            tiempoTranscurrido = Math.floor(diferencia / (1000 * 60));
                        }

                        return (
                            <Link
                                key={partido.id_partido}
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
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
