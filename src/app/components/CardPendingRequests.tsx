"use client";

import { Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { SolicitudPendiente } from "../types/user";
import { URI_IMG } from "./ui/utils";

interface CardPendingRequestsProps {
    solicitudesPendientes: SolicitudPendiente[];
}

const CardPendingRequests: React.FC<CardPendingRequestsProps> = ({
    solicitudesPendientes = []
}) => {
    const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

    // Auto-slide para múltiples solicitudes cada 6 segundos
    useEffect(() => {
        if (solicitudesPendientes.length > 1) {
            const interval = setInterval(() => {
                setCurrentRequestIndex(prev =>
                    (prev + 1) % solicitudesPendientes.length
                );
            }, 6000);

            return () => clearInterval(interval);
        }
    }, [currentRequestIndex, solicitudesPendientes.length]);

    const handleRequestChange = (newIndex: number) => {
        setCurrentRequestIndex(newIndex);
    };

    if (solicitudesPendientes.length === 0) {
        return null;
    }

    const currentRequest = solicitudesPendientes[currentRequestIndex];
    const hasMultipleRequests = solicitudesPendientes.length > 1;

    // Calcular días desde la solicitud
    const diasPendiente = Math.floor(
        (new Date().getTime() - new Date(currentRequest.fecha_solicitud).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-[var(--black-950)] rounded-2xl overflow-hidden border border-[var(--black-700)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-900)]">
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-orange-400" size={16} />
                    <span className="text-white font-bold">Solicitudes Enviadas</span>
                    {hasMultipleRequests && (
                        <span className="text-[var(--black-400)]">
                            | {currentRequestIndex + 1} de {solicitudesPendientes.length}
                        </span>
                    )}
                </div>

                {hasMultipleRequests && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleRequestChange(
                                currentRequestIndex === 0
                                    ? solicitudesPendientes.length - 1
                                    : currentRequestIndex - 1
                            )}
                            className="p-1.5 text-[var(--black-500)] hover:text-[var(--black-300)] hover:bg-[var(--black-800)] rounded transition-all duration-200"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Indicadores de progreso */}
                        <div className="flex gap-1">
                            {solicitudesPendientes.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRequestChange(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentRequestIndex
                                        ? 'bg-orange-400 w-4'
                                        : 'bg-[var(--black-700)] hover:bg-[var(--black-600)]'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => handleRequestChange(
                                currentRequestIndex === solicitudesPendientes.length - 1
                                    ? 0
                                    : currentRequestIndex + 1
                            )}
                            className="p-1.5 text-[var(--black-500)] hover:text-[var(--black-300)] hover:bg-[var(--black-800)] rounded transition-all duration-200"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Request Card */}
            <div className="px-6 py-4 relative overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center relative">
                        {currentRequest.img_equipo ? (
                            <Image
                                src={URI_IMG + currentRequest.img_equipo}
                                alt={currentRequest.nombre_equipo}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover opacity-60"
                            />
                        ) : (
                            <AlertCircle className="text-[var(--black-500)]" size={24} />
                        )}

                        {/* Indicador de pendiente */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[var(--black-200)] font-medium">
                                {currentRequest.nombre_equipo}
                            </h4>
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs font-medium rounded border border-orange-500/30">
                                En proceso
                            </span>
                        </div>

                        <p className="text-[var(--black-500)] text-sm mb-2">
                            {currentRequest.nombre_cat_edicion}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-[var(--black-600)]">
                            <span>
                                Enviada hace {diasPendiente === 0 ? 'hoy' : `${diasPendiente} día${diasPendiente > 1 ? 's' : ''}`}
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                Aguardando respuesta
                            </span>
                        </div>

                        {currentRequest.mensaje_jugador && (
                            <div className="mt-3 p-3 bg-[var(--black-900)] rounded-lg border border-[var(--black-700)]">
                                <p className="text-[var(--black-400)] text-xs mb-1">Tu mensaje:</p>
                                <p className="text-[var(--black-300)] text-sm italic">
                                    &quot;{currentRequest.mensaje_jugador}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar para auto-slide */}
                {hasMultipleRequests && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--black-800)]">
                        <div
                            className="h-full bg-orange-400 transition-all duration-75 ease-linear"
                            style={{
                                width: '0%',
                                animation: 'progress 6s linear infinite'
                            }}
                        ></div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default CardPendingRequests;