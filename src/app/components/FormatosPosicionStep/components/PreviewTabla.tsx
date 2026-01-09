/**
 * Componente de presentación para preview de tabla de posiciones
 */

import React from 'react';
import { FormatoTemporal } from '../types';
import { LIMITES } from '../constants';

interface PreviewTablaProps {
    formatos: FormatoTemporal[];
    cantidadEquipos: number;
}

export const PreviewTabla: React.FC<PreviewTablaProps> = ({ formatos, cantidadEquipos }) => {
    const generarFilas = () => {
        const filas = [];
        const maxFilas = Math.min(cantidadEquipos, LIMITES.PREVIEW_MAX_ROWS);
        
        for (let i = 1; i <= maxFilas; i++) {
            const formato = formatos.find(
                (f) =>
                    !f.errores &&
                    i >= f.posicion_desde &&
                    i <= f.posicion_hasta
            );
            const colorFondo = formato?.color || 'transparent';
            const colorTexto = formato?.color ? '#ffffff' : 'inherit';

            filas.push(
                <tr key={i} style={{ backgroundColor: colorFondo, color: colorTexto }}>
                    <td className="px-3 py-2 text-sm font-medium">{i}</td>
                    <td className="px-3 py-2 text-sm">
                        {formato?.descripcion || '-'}
                    </td>
                </tr>
            );
        }
        return filas;
    };

    return (
        <div className="mt-4">
            <h4 className="text-[var(--white)] font-medium mb-2 text-sm">
                Preview de Tabla de posiciones
            </h4>
            <div className="border border-[var(--gray-300)] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--gray-500)]">
                        <tr>
                            <th className="px-3 py-2 text-xs font-medium text-[var(--gray-100)]">
                                Pos
                            </th>
                            <th className="px-3 py-2 text-xs font-medium text-[var(--gray-100)]">
                                Formato
                            </th>
                        </tr>
                    </thead>
                    <tbody>{generarFilas()}</tbody>
                </table>
            </div>
        </div>
    );
};

