'use client';

import { FormatoPosicion } from '@/app/types/zonas';

interface FormatoPosicionBadgeProps {
    posicion: number;
    formatosPosicion?: FormatoPosicion[];
}

/**
 * Componente que muestra el color y descripción del formato de posición
 * para una posición específica en la tabla
 */
export const FormatoPosicionBadge: React.FC<FormatoPosicionBadgeProps> = ({
    posicion,
    formatosPosicion = []
}) => {
    // Encontrar el formato que corresponde a esta posición
    const formato = formatosPosicion.find(
        f => posicion >= f.posicion_desde && posicion <= f.posicion_hasta
    );

    if (!formato || !formato.color) {
        return null;
    }

    return (
        <div
            className="w-1 h-6 rounded-r mr-3 flex-shrink-0"
            style={{ backgroundColor: formato.color }}
            title={formato.descripcion}
        />
    );
};

/**
 * Componente para mostrar la leyenda de formatos de posición
 */
export const FormatoPosicionLeyenda: React.FC<{
    formatosPosicion?: FormatoPosicion[];
    className?: string;
}> = ({ formatosPosicion = [], className = '' }) => {
    if (formatosPosicion.length === 0) {
        return null;
    }

    // Ordenar por orden
    const formatosOrdenados = [...formatosPosicion].sort((a, b) => a.orden - b.orden);

    return (
        <div className={`px-4 py-3 bg-[var(--black-850)] border-t border-[var(--black-800)] ${className}`}>
            <div className="flex items-center gap-6 text-xs flex-wrap">
                {formatosOrdenados.map((formato) => (
                    <div key={formato.id_formato_posicion} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: formato.color || '#000' }}
                        />
                        <span className="text-[var(--gray-100)]">{formato.descripcion}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

