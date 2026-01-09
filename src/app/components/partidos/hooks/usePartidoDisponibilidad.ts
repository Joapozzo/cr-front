'use client';

import { useMemo } from 'react';
import { useVerificarDisponibilidadCancha } from '@/app/hooks/useCanchas';

/**
 * Información de un conflicto de horario
 */
export interface ConflictoPartido {
    id_partido: number;
    jornada?: number;
    equipos?: {
        local?: string;
        visita?: string;
    };
    hora_inicio: string;
    hora_fin: string;
}

/**
 * Estado de disponibilidad para mostrar en UI
 */
export interface DisponibilidadUIState {
    isLoading: boolean;
    hasAdvertencia: boolean;
    advertencia: string | null;
    conflictos: ConflictoPartido[];
    canVerify: boolean;
}

/**
 * Parámetros para el hook
 */
export interface UsePartidoDisponibilidadParams {
    fecha: string | null;
    hora: string | null;
    idCategoriaEdicion: number | null;
    idCancha: number | null;
    /** ID del partido a excluir (para edición) */
    idPartidoExcluir?: number;
}

/**
 * Hook para verificar disponibilidad de cancha
 * Encapsula la lógica de verificación y expone estado listo para UI
 */
export function usePartidoDisponibilidad({
    fecha,
    hora,
    idCategoriaEdicion,
    idCancha,
    idPartidoExcluir,
}: UsePartidoDisponibilidadParams) {
    const { 
        data: disponibilidadCancha, 
        isLoading: loadingDisponibilidad 
    } = useVerificarDisponibilidadCancha(
        fecha,
        hora,
        idCategoriaEdicion,
        idCancha,
        idPartidoExcluir
    );

    // Estado procesado para UI
    const uiState: DisponibilidadUIState = useMemo(() => {
        const canVerify = !!(idCancha && fecha && hora);
        
        return {
            isLoading: loadingDisponibilidad,
            hasAdvertencia: !!disponibilidadCancha?.advertencia,
            advertencia: disponibilidadCancha?.advertencia || null,
            conflictos: disponibilidadCancha?.conflictos || [],
            canVerify,
        };
    }, [loadingDisponibilidad, disponibilidadCancha, idCancha, fecha, hora]);

    return {
        // Estado para UI
        ...uiState,
        
        // Datos crudos
        disponibilidadCancha,
        loadingDisponibilidad,
        
        // Helpers
        shouldShowWarning: uiState.canVerify && !uiState.isLoading && uiState.hasAdvertencia,
        shouldShowLoading: uiState.canVerify && uiState.isLoading,
    };
}

export type UsePartidoDisponibilidadReturn = ReturnType<typeof usePartidoDisponibilidad>;

