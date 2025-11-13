import React, { useState, useEffect } from 'react';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    FileText,
    Shield,
    Pause,
    Calendar,
} from "lucide-react";
import { BaseCard, CardHeader } from "./BaseCard";
import { PartidoCompleto } from '../types/partido';
import { deberMostrarResultado, formatearFecha, getEstadoInfo } from '../utils/partido.helper';
import { formatearHora } from '../utils/formated';
import CardPartidosSemanaSkeleton from './skeletons/CardPartidosSemanaSkeleton';

interface PartidosSemanaProps {
    partidos?: PartidoCompleto[];
    isLoading?: boolean;
}

const CardPartidosSemana: React.FC<PartidosSemanaProps> = ({ partidos = [], isLoading = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (partidos.length > 3) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.max(1, partidos.length - 2));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [partidos.length]);

    const partidosVisibles = partidos.slice(currentIndex, currentIndex + 3);

    if (isLoading || !partidos) {
        return <CardPartidosSemanaSkeleton/>;
    }

    return (
        <BaseCard>
            <CardHeader
                icon={<FileText className="text-green-400" size={16} />}
                title="Esta Semana"
                subtitle={partidos.length > 0 ? `${partidos.length} partidos` : ''}
                actions={
                    partidos.length > 3 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                className="p-1.5 text-[#525252] hover:text-[#d4d4d4] hover:bg-[#262626] rounded transition-all duration-200"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: Math.max(1, partidos.length - 2) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-green-400 w-4'
                                            : 'bg-[#404040] hover:bg-[#525252]'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentIndex(Math.min(partidos.length - 3, currentIndex + 1))}
                                className="p-1.5 text-[#525252] hover:text-[#d4d4d4] hover:bg-[#262626] rounded transition-all duration-200"
                                disabled={currentIndex >= partidos.length - 3}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )
                }
            />
            <div className="px-6 py-4">
                {partidosVisibles.length > 0 ? (
                    <div className="space-y-3">
                        {partidosVisibles.map((partido) => {
                            const debeMostrarResultado = deberMostrarResultado(partido.estado);
                            const estadoInfo = getEstadoInfo(partido.estado);
                            const nombreLocal = partido.equipoLocal?.nombre || `Equipo ${partido.id_equipoLocal || 'Local'}`;
                            const nombreVisita = partido.equipoVisita?.nombre || `Equipo ${partido.id_equipoVisita || 'Visita'}`;
                            
                            return (
                                <div key={partido.id_partido} className="bg-[#171717] rounded-lg border border-[#262626] p-4">
                                    {/* Header con estado */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${estadoInfo.bg} ${estadoInfo.color}`}>
                                            {estadoInfo.text}
                                        </span>
                                        <span className="text-[#525252] text-xs">
                                            {formatearFecha(partido.dia)}
                                        </span>
                                    </div>

                                    {/* Equipos y resultado/hora */}
                                    <div className="flex items-center justify-between">
                                        {/* Equipo Local */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="text-[#737373]" size={16} />
                                            </div>
                                            <span className="text-white text-sm font-medium truncate">
                                                {nombreLocal}
                                            </span>
                                        </div>

                                        {/* Resultado o Hora */}
                                        <div className="flex items-center gap-4 px-4">
                                            {debeMostrarResultado ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-lg">
                                                        {partido.goles_local ?? 0}
                                                    </span>
                                                    <span className="text-[#525252] text-sm">-</span>
                                                    <span className="text-white font-bold text-lg">
                                                        {partido.goles_visita ?? 0}
                                                    </span>
                                                </div>
                                            ) : partido.estado === 'S' ? (
                                                <div className="flex items-center gap-2">
                                                    <Pause className="text-red-400" size={16} />
                                                    <span className="text-red-400 text-sm font-medium">SUSP.</span>
                                                </div>
                                            ) : partido.estado === 'A' ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-orange-400" size={16} />
                                                    <span className="text-orange-400 text-sm font-medium">APLAZ.</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="text-gray-400" size={14} />
                                                    <span className="text-gray-400 text-sm font-medium">
                                                        {formatearHora(partido.hora)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Equipo Visita */}
                                        <div className="flex items-center gap-3 flex-1 justify-end">
                                            <span className="text-white text-sm font-medium truncate text-right">
                                                {nombreVisita}
                                            </span>
                                            <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="text-[#737373]" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <FileText className="text-[#525252] mx-auto mb-2" size={32} />
                        <p className="text-[#525252] text-sm">No hay partidos esta semana</p>
                    </div>
                )}
            </div>
        </BaseCard>
    );
};

export default CardPartidosSemana;