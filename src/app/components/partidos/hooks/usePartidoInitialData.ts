'use client';

import { useMemo } from 'react';
import { PartidoResponse } from '@/app/schemas/partidos.schema';
import { Usuario } from '@/app/types/user';
import { FormDataValue } from '@/app/components/modals/ModalAdmin';
import { mapPartidoToFormData, getCrearPartidoInitialData } from '../utils/mapPartidoToForm';
import { formatearFechaParaInput } from '../utils/formatFecha';
import { formatearHoraParaInput } from '../utils/formatHora';

/**
 * Parámetros para inicializar datos de creación
 */
export interface UseCrearPartidoInitialDataParams {
    jornada: number;
}

/**
 * Parámetros para inicializar datos de actualización
 */
export interface UseActualizarPartidoInitialDataParams {
    partido: PartidoResponse | null;
    usuarios?: Usuario[];
}

/**
 * Hook para obtener datos iniciales del formulario de crear partido
 */
export function useCrearPartidoInitialData({ jornada }: UseCrearPartidoInitialDataParams) {
    const initialData = useMemo(() => 
        getCrearPartidoInitialData(jornada),
        [jornada]
    );

    return { initialData };
}

/**
 * Hook para obtener datos iniciales del formulario de actualizar partido
 */
export function useActualizarPartidoInitialData({ 
    partido, 
    usuarios 
}: UseActualizarPartidoInitialDataParams) {
    const initialData = useMemo(() => 
        mapPartidoToFormData(partido, usuarios),
        [partido, usuarios]
    );

    /**
     * Extrae los valores iniciales para el estado del formulario
     */
    const initialStateValues = useMemo(() => {
        if (!partido) return null;

        // Extraer id_equipo_ventaja_deportiva de forma segura
        const partidoExtendido = partido as PartidoResponse & {
            equipoVentajaDeportiva?: { id_equipo: number };
            id_equipo_ventaja_deportiva?: number;
        };

        return {
            id_zona: partido.id_zona || null,
            id_equipolocal: partido.equipoLocal?.id_equipo || null,
            id_equipovisita: partido.equipoVisita?.id_equipo || null,
            id_predio: partido.cancha?.id_predio || partido.cancha?.predio?.id_predio || null,
            id_cancha: partido.cancha?.id_cancha || null,
            dia: partido.dia ? formatearFechaParaInput(partido.dia) : null,
            hora: partido.hora ? formatearHoraParaInput(partido.hora) : null,
            interzonal: typeof partido.interzonal === 'boolean' ? partido.interzonal : false,
            ventaja_deportiva: partido.ventaja_deportiva || false,
            id_equipo_ventaja_deportiva: partidoExtendido?.equipoVentajaDeportiva?.id_equipo || 
                partidoExtendido?.id_equipo_ventaja_deportiva || null,
        };
    }, [partido]);

    return { 
        initialData, 
        initialStateValues 
    };
}

export type UseCrearPartidoInitialDataReturn = ReturnType<typeof useCrearPartidoInitialData>;
export type UseActualizarPartidoInitialDataReturn = ReturnType<typeof useActualizarPartidoInitialData>;

