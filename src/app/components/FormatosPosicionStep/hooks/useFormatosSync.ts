/**
 * Hook para sincronización de formatos con callbacks externos
 */

import { useEffect } from 'react';
import { FormatoPosicion } from '../../../types/zonas';
import { FormatoTemporal } from '../types';

export const useFormatosSync = (
    formatos: FormatoTemporal[],
    onFormatosChange: (formatos: FormatoPosicion[]) => void
) => {
    useEffect(() => {
        const formatosValidados = formatos
            .filter((f) => !f.errores)
            .map((f) => ({
                id_formato_posicion: f.id.startsWith('existing-')
                    ? parseInt(f.id.replace('existing-', ''))
                    : 0,
                id_zona: 0,
                posicion_desde: f.posicion_desde,
                posicion_hasta: f.posicion_hasta,
                descripcion: f.descripcion,
                color: f.color || null,
                orden: f.orden,
            })) as FormatoPosicion[];

        onFormatosChange(formatosValidados);
    }, [formatos, onFormatosChange]);
};

