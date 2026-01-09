/**
 * Hook para manejo de actualizaciones con debounce
 */

import { useRef } from 'react';
import toast from 'react-hot-toast';
import { FormatoTemporal } from '../types';
import { MENSAJES } from '../constants';

interface UpdateData {
    posicion_desde?: number;
    posicion_hasta?: number;
    descripcion?: string;
    color?: string | null;
    orden?: number;
}

export const useDebouncedUpdate = (
    onActualizarFormato?: (id_formato: number, data: UpdateData) => Promise<void>
) => {
    const debounceTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

    const scheduleUpdate = async (
        id: string,
        formatoActualizado: FormatoTemporal,
        delay: number = 1000
    ) => {
        const esFormatoExistente = id.startsWith('existing-');
        const idFormato = esFormatoExistente ? parseInt(id.replace('existing-', '')) : null;

        if (!esFormatoExistente || !idFormato || !onActualizarFormato) {
            return;
        }

        // Limpiar timeout anterior si existe
        if (debounceTimeoutsRef.current[id]) {
            clearTimeout(debounceTimeoutsRef.current[id]);
        }

        // Programar actualización con debounce
        const timeoutId = setTimeout(async () => {
            if (!formatoActualizado.errores) {
                try {
                    await onActualizarFormato(idFormato, {
                        posicion_desde: formatoActualizado.posicion_desde,
                        posicion_hasta: formatoActualizado.posicion_hasta,
                        descripcion: formatoActualizado.descripcion,
                        color: formatoActualizado.color || null,
                        orden: formatoActualizado.orden,
                    });
                } catch (error) {
                    toast.error(MENSAJES.TOAST_ERROR_ACTUALIZAR);
                    console.error(error);
                }
            }
            delete debounceTimeoutsRef.current[id];
        }, delay);

        debounceTimeoutsRef.current[id] = timeoutId;
    };

    const cancelUpdate = (id: string) => {
        if (debounceTimeoutsRef.current[id]) {
            clearTimeout(debounceTimeoutsRef.current[id]);
            delete debounceTimeoutsRef.current[id];
        }
    };

    return { scheduleUpdate, cancelUpdate };
};

