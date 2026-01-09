/**
 * Hook para manejo del estado de formatos
 */

import { useState, useEffect } from 'react';
import { FormatoPosicion } from '../../../types/zonas';
import { FormatoTemporal } from '../types';
import { COLORES_PREDEFINIDOS } from '../constants';

export const useFormatosState = (formatosIniciales: FormatoPosicion[] = []) => {
    const [formatos, setFormatos] = useState<FormatoTemporal[]>([]);
    const [formatosExpandidos, setFormatosExpandidos] = useState<Set<string>>(new Set());

    // Cargar formatos iniciales
    useEffect(() => {
        if (formatosIniciales.length > 0) {
            const formatosTemporales: FormatoTemporal[] = formatosIniciales.map((f) => ({
                id: `existing-${f.id_formato_posicion}`,
                posicion_desde: f.posicion_desde,
                posicion_hasta: f.posicion_hasta,
                descripcion: f.descripcion,
                color: f.color || COLORES_PREDEFINIDOS[0].hex,
                orden: f.orden,
            }));
            setFormatos(formatosTemporales);
            setFormatosExpandidos(new Set());
        }
    }, [formatosIniciales]);

    const toggleExpandFormato = (id: string) => {
        setFormatosExpandidos((prev) => {
            const nuevo = new Set(prev);
            if (nuevo.has(id)) {
                nuevo.delete(id);
            } else {
                nuevo.add(id);
            }
            return nuevo;
        });
    };

    const removeFormatoFromExpanded = (id: string) => {
        setFormatosExpandidos((prev) => {
            const nuevo = new Set(prev);
            nuevo.delete(id);
            return nuevo;
        });
    };

    return {
        formatos,
        setFormatos,
        formatosExpandidos,
        toggleExpandFormato,
        removeFormatoFromExpanded,
    };
};

