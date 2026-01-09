import React from 'react';
import { EstadoPartido } from '@/app/types/partido';
import { getEstadoInfo } from '@/app/utils/partido.helper';
import { estaEnVivo } from '@/app/utils/tiempoPartido.helper';
import { TiempoPartido } from '../common/TiempoPartido';

interface PartidoEstadoProps {
    estado: EstadoPartido;
    partidoId: number;
    esPlanillero?: boolean;
    cronometro?: {
        fase: 'PT' | 'HT' | 'ST' | 'ET';
        tiempoFormateado: string;
        shouldShowAdicional: boolean;
        tiempoAdicional: number;
    };
}

export const PartidoEstado: React.FC<PartidoEstadoProps> = ({
    estado,
    partidoId,
    esPlanillero = false,
    cronometro,
}) => {
    const mostrarCronometro = estaEnVivo(estado) || (estado === 'T' && esPlanillero);

    return (
        <div className="flex justify-center">
            {mostrarCronometro ? (
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1. bg-[var(--color-primary)] rounded-md animate-pulse">
                        {cronometro && cronometro.fase ? (
                            <span className="text-white font-medium text-xs">
                                {cronometro.fase} {cronometro.tiempoFormateado}
                                {cronometro.shouldShowAdicional && cronometro.tiempoAdicional > 0 && (
                                    <span className="text-red"> +{cronometro.tiempoAdicional}</span>
                                )}
                            </span>
                        ) : (
                            <TiempoPartido
                                estado={estado}
                                partidoId={partidoId}
                                showCronometro={false}
                                size="md"
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getEstadoInfo(estado).bg} ${getEstadoInfo(estado).color} border border-white/10 backdrop-blur-sm`}>
                        {getEstadoInfo(estado).text}
                    </span>
                </div>
            )}
        </div>
    );
};

