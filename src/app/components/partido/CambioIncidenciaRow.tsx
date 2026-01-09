import React from 'react';
import { RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { IncidenciaPartido } from '@/app/types/partido';
import IncidentActions from '../IncidentsActions';
import IncidentMinute from '../IncidentMinute';

interface CambioIncidenciaRowProps {
    cambio: IncidenciaPartido; // tipo === 'cambio'
    equipoNombre: string;
    equipoLocalId: number;
    index: number;
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CambioIncidenciaRow: React.FC<CambioIncidenciaRowProps> = ({
    cambio,
    equipoLocalId,
    index,
    mode,
    permitirAcciones,
    onEdit,
    onDelete
}) => {
    const esLocal = cambio.id_equipo === equipoLocalId;
    const tieneEntrada = !!cambio.jugador_entra_nombre;
    const tieneSalida = !!cambio.jugador_sale_nombre;

    // Formatear nombres como en otras incidencias: "N. APELLIDO"
    const formatearNombre = (nombreCompleto: string) => {
        const partes = nombreCompleto.split(' ');
        if (partes.length >= 2) {
            return `${partes[0].charAt(0)}. ${partes[partes.length - 1].toUpperCase()}`;
        }
        return nombreCompleto;
    };

    const nombreEntra = tieneEntrada ? formatearNombre(cambio.jugador_entra_nombre || '') : '';
    const nombreSale = tieneSalida ? formatearNombre(cambio.jugador_sale_nombre || '') : '';

    const containerClasses = `flex items-center w-full py-2 px-3 rounded-lg transition-colors ${esLocal ? 'justify-start' : 'justify-end bg-[#171717]'}`;

    return (
        <div 
            className="opacity-0 translate-y-4" 
            style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}
        >
            <div className={containerClasses}>
                {esLocal ? (
                    // Layout para equipo local (izquierda)
                    <>
                        <IncidentMinute minuto={cambio.minuto} isLocal={true} />

                        <div className="flex items-center justify-center mx-3">
                            <RefreshCw className="w-4 h-4 text-[#737373]" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-0.5">
                                
                                {/* Entra - verde, más grande, con flecha a la derecha */}
                                {tieneEntrada && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs sm:text-sm font-medium text-[var(--color-primary)] truncate">
                                            {nombreEntra}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-[var(--color-primary)] flex-shrink-0" />
                                    </div>
                                )}
                                {/* Sale - rojo, más chico, con flecha a la izquierda */}
                                {tieneSalida && (
                                    <div className="flex items-center gap-1.5 opacity-70">
                                        <ArrowLeft className="w-3 h-3 text-red-400 flex-shrink-0" />
                                        <span className="text-[10px] sm:text-xs text-red-400/70 truncate">
                                            {nombreSale}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {mode === 'planillero' && permitirAcciones && onEdit && onDelete && (
                            <IncidentActions
                                incidencia={cambio}
                                onEdit={() => onEdit()}
                                onDelete={() => onDelete()}
                                isLocal={true}
                            />
                        )}
                    </>
                ) : (
                    // Layout para equipo visitante (derecha)
                    <>
                        {mode === 'planillero' && permitirAcciones && onEdit && onDelete && (
                            <IncidentActions
                                incidencia={cambio}
                                onEdit={() => onEdit()}
                                onDelete={() => onDelete()}
                                isLocal={false}
                            />
                        )}

                        <div className="flex-1 min-w-0 text-right">
                            <div className="flex flex-col gap-0.5 items-end">
                                {/* Entra - verde, más grande, con flecha a la derecha */}
                                {tieneEntrada && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs sm:text-sm font-medium text-[var(--color-primary)] truncate">
                                            {nombreEntra}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-[var(--color-primary)] flex-shrink-0" />
                                    </div>
                                )}
                                {/* Sale - rojo, más chico, con flecha a la izquierda */}
                                {tieneSalida && (
                                    <div className="flex items-center gap-1.5 opacity-70">
                                        <ArrowLeft className="w-3 h-3 text-red-400 flex-shrink-0" />
                                        <span className="text-[10px] sm:text-xs text-red-400/70 truncate">
                                            {nombreSale}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center mx-3">
                            <RefreshCw className="w-4 h-4 text-[#737373]" />
                        </div>

                        <IncidentMinute minuto={cambio.minuto} isLocal={false} />
                    </>
                )}
            </div>
        </div>
    );
};

export default CambioIncidenciaRow;
