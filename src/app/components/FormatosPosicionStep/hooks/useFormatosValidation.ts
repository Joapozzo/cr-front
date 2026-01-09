/**
 * Hook para validación de formatos
 */

import { useCallback } from 'react';
import { FormatoTemporal } from '../types';
import { validarFormato } from '../validation';

export const useFormatosValidation = (
    formatos: FormatoTemporal[],
    cantidadEquipos: number
) => {
    const validarYActualizarFormato = useCallback(
        (formato: FormatoTemporal): FormatoTemporal => {
            const otrosFormatos = formatos.filter((f) => f.id !== formato.id);
            const errores = validarFormato(formato, otrosFormatos, cantidadEquipos);
            return { ...formato, errores };
        },
        [formatos, cantidadEquipos]
    );

    return { validarYActualizarFormato };
};

