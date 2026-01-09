"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Partido } from '../types/partido';
import Image from 'next/image';
import { imagenFallBack, URI_IMG } from './ui/utils';

interface CardPartidosSliderProps {
    partidos: Partido[];
    isLoading?: boolean;
}

const CardPartidosSlider: React.FC<CardPartidosSliderProps> = ({
    partidos = [],
    isLoading = false
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [esProximo, setEsProximo] = useState(false);
    const [fechaFormateada, setFechaFormateada] = useState('');

    // Auto-slide cada 10 segundos si hay múltiples partidos
    useEffect(() => {
        if (partidos.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % partidos.length);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [currentIndex, partidos.length]);

    // Calcular valores dependientes de fecha solo en el cliente
    useEffect(() => {
        if (partidos.length > 0 && currentIndex < partidos.length) {
            const currentPartido = partidos[currentIndex];
            const ahora = new Date();
            const fechaPartido = new Date(currentPartido.dia);
            setEsProximo(fechaPartido > ahora);
            setFechaFormateada(fechaPartido.toLocaleDateString('es-AR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }));
        }
    }, [partidos, currentIndex]);

    const handlePartidoChange = (newIndex: number) => {
        setCurrentIndex(newIndex);
    };

    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-[var(--black-800)]">
                    <div className="h-5 bg-[var(--black-600)] rounded w-32 animate-pulse"></div>
                </div>
                <div className="p-6">
                    <div className="h-20 bg-[var(--black-700)] rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (partidos.length === 0) {
        return null;
    }

    const currentPartido = partidos[currentIndex];
    const hasMultiplePartidos = partidos.length > 1;

    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden border border-[var(--black-700)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-white" size={16} />
                    <span className="text-white font-bold">
                        {esProximo ? 'Próximo Partido' : 'Último Partido'}
                    </span>
                    {hasMultiplePartidos && (
                        <span className="text-[var(--black-300)]">
                            | {currentIndex + 1} de {partidos.length}
                        </span>
                    )}
                </div>

                {hasMultiplePartidos && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePartidoChange(
                                currentIndex === 0 ? partidos.length - 1 : currentIndex - 1
                            )}
                            className="p-1.5 text-[var(--black-400)] hover:text-white hover:bg-[var(--black-700)] rounded transition-all duration-200"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex gap-1">
                            {partidos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePartidoChange(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-[var(--color-primary)] w-4'
                                        : 'bg-[var(--black-600)] hover:bg-[var(--black-500)]'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => handlePartidoChange(
                                currentIndex === partidos.length - 1 ? 0 : currentIndex + 1
                            )}
                            className="p-1.5 text-[var(--black-400)] hover:text-white hover:bg-[var(--black-700)] rounded transition-all duration-200"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Partido Content */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    {/* Equipo Local */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                            <Image src={currentPartido.equipoLocal?.img ? URI_IMG + currentPartido.equipoLocal.img : imagenFallBack} alt="Imagen Equipo Local" width={40} height={40} />
                        </div>
                        <div>
                            <p className="text-white font-medium text-md">
                                {currentPartido.equipoLocal?.nombre || 'Equipo Local'}
                            </p>
                            <p className="text-[var(--black-400)] text-sm">Local</p>
                        </div>
                    </div>

                    {/* Score o VS */}
                    <div className="px-4">
                        {currentPartido.goles_local !== null && currentPartido.goles_visita !== null ? (
                            <div className="text-center">
                                <div className="text-xl font-bold text-white">
                                    {currentPartido.goles_local} - {currentPartido.goles_visita}
                                </div>
                                <div className="text-xs text-[var(--black-400)]">Final</div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="text-lg font-bold text-[var(--black-400)]">VS</div>
                                <div className="text-xs text-[var(--black-500)]">
                                    {esProximo ? 'Por jugar' : 'Sin resultado'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Equipo Visitante */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="text-right">
                            <p className="text-white font-medium text-md">
                                {currentPartido.equipoVisita?.nombre || 'Equipo Visitante'}
                            </p>
                            <p className="text-[var(--black-400)] text-sm">Visitante</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                            <Image src={currentPartido.equipoLocal?.img ? URI_IMG + currentPartido.equipoVisita.img : imagenFallBack} alt="Imagen Equipo Visita" width={30} height={40} />
                        </div>
                    </div>
                </div>

                {/* Info adicional */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-[var(--black-700)]">
                    <div className="flex items-center gap-2 text-[var(--black-400)] text-sm">
                        <Calendar size={14} />
                        <span>{fechaFormateada}</span>
                    </div>

                    {currentPartido.hora && (
                        <div className="flex items-center gap-2 text-[var(--black-400)] text-sm">
                            <Clock size={14} />
                            <span>{currentPartido.hora}</span>
                        </div>
                    )}

                    {currentPartido.cancha && (
                        <div className="flex items-center gap-2 text-[var(--black-400)] text-sm">
                            <MapPin size={14} />
                            <span>{currentPartido.cancha}</span>
                        </div>
                    )}
                </div>

                {/* Jornada */}
                <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-[var(--black-800)] text-[var(--black-300)] text-xs rounded-full">
                        Fecha {currentPartido.jornada}
                    </span>
                </div>
            </div>

            {/* Progress bar para auto-slide */}
            {hasMultiplePartidos && (
                <div className="h-1 bg-[var(--black-800)] relative overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-75 ease-linear"
                        style={{
                            width: '0%',
                            animation: 'progress 10s linear infinite'
                        }}
                    ></div>
                </div>
            )}

            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default CardPartidosSlider;