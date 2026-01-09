import React from 'react';
import { IncidenciaPartido } from '@/app/types/partido';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";

interface IncidenciaRowProps {
    incidencia: IncidenciaPartido;
    equipoLocalId: number;
    index: number;
}

/**
 * Componente para mostrar una fila de incidencia individual
 */
const IncidenciaRow: React.FC<IncidenciaRowProps> = ({ incidencia, equipoLocalId, index }) => {
    const getIcono = () => {
        switch (incidencia.tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-5 h-5 text-[var(--color-primary)] fill-current" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                    </div>
                );
            case 'asistencia':
                return <GiSoccerKick className="w-5 h-5 text-[var(--color-primary)]" />;
            default:
                return null;
        }
    };

    const esLocal = incidencia.id_equipo === equipoLocalId;
    const nombreCompleto = `${incidencia.nombre.charAt(0)}. ${incidencia.apellido.toUpperCase()}`;

    return (
        <div 
            className="flex items-center gap-4 py-3 last:border-0 opacity-0 translate-y-4"
            style={{ 
                animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards`
            }}
        >
            {/* Equipo Local - Alineado a la derecha */}
            <div className="flex-1 flex justify-end">
                {esLocal && (
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">
                                {nombreCompleto}
                                {incidencia.penal === 'S' && (
                                    <span className="text-[#737373] ml-1">(p)</span>
                                )}
                                {incidencia.en_contra === 'S' && (
                                    <span className="text-[#737373] ml-1">(ec)</span>
                                )}
                            </div>
                        </div>
                        <div className="text-xs font-mono text-[#737373] text-right">
                            {incidencia.minuto}&apos;
                        </div>
                    </div>
                )}
            </div>

            {/* Icono centrado */}
            <div className="flex items-center justify-center w-10 flex-shrink-0">
                {getIcono()}
            </div>

            {/* Equipo Visita - Alineado a la izquierda */}
            <div className="flex-1 flex justify-start">
                {!esLocal && (
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-mono text-[#737373]">
                            {incidencia.minuto}&apos;
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium text-white">
                                {nombreCompleto}
                                {incidencia.penal === 'S' && (
                                    <span className="text-yellow-500 ml-1">(P)</span>
                                )}
                                {incidencia.en_contra === 'S' && (
                                    <span className="text-red-400 ml-1">(EC)</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncidenciaRow;

