'use client';

import { useState, useCallback } from 'react';
import { FormDataValue } from '@/app/components/modals/ModalAdmin';
import { normalizeFechaValue } from '../utils/formatFecha';
import { normalizeHoraValue } from '../utils/formatHora';

/**
 * Estado del formulario de partido
 */
export interface PartidoFormState {
    selectedZona: number | null;
    selectedLocal: number | null;
    selectedVisitante: number | null;
    selectedPredio: number | null;
    selectedCancha: number | null;
    selectedFecha: string | null;
    selectedHora: string | null;
    isInterzonal: boolean;
    ventajaDeportiva: boolean;
    equipoVentajaDeportiva: number | null;
}

/**
 * Valores iniciales del estado
 */
const initialState: PartidoFormState = {
    selectedZona: null,
    selectedLocal: null,
    selectedVisitante: null,
    selectedPredio: null,
    selectedCancha: null,
    selectedFecha: null,
    selectedHora: null,
    isInterzonal: false,
    ventajaDeportiva: false,
    equipoVentajaDeportiva: null,
};

/**
 * Opciones para inicializar el estado desde un partido existente
 */
export interface InitialPartidoState {
    id_zona?: number | null;
    id_equipolocal?: number | null;
    id_equipovisita?: number | null;
    id_predio?: number | null;
    id_cancha?: number | null;
    dia?: string | null;
    hora?: string | null;
    interzonal?: boolean;
    ventaja_deportiva?: boolean;
    id_equipo_ventaja_deportiva?: number | null;
}

/**
 * Hook para manejar el estado del formulario de partido
 * Centraliza toda la lógica de estado relacionada con selecciones
 */
export function usePartidoFormState(initialValues?: InitialPartidoState) {
    const [state, setState] = useState<PartidoFormState>(() => ({
        ...initialState,
        selectedZona: initialValues?.id_zona ?? null,
        selectedLocal: initialValues?.id_equipolocal ?? null,
        selectedVisitante: initialValues?.id_equipovisita ?? null,
        selectedPredio: initialValues?.id_predio ?? null,
        selectedCancha: initialValues?.id_cancha ?? null,
        selectedFecha: initialValues?.dia ?? null,
        selectedHora: initialValues?.hora ?? null,
        isInterzonal: initialValues?.interzonal ?? false,
        ventajaDeportiva: initialValues?.ventaja_deportiva ?? false,
        equipoVentajaDeportiva: initialValues?.id_equipo_ventaja_deportiva ?? null,
    }));

    /**
     * Resetea todo el estado a los valores iniciales
     */
    const resetState = useCallback(() => {
        setState(initialState);
    }, []);

    /**
     * Inicializa el estado con valores de un partido existente
     */
    const initializeFromPartido = useCallback((values: InitialPartidoState) => {
        setState({
            selectedZona: values.id_zona ?? null,
            selectedLocal: values.id_equipolocal ?? null,
            selectedVisitante: values.id_equipovisita ?? null,
            selectedPredio: values.id_predio ?? null,
            selectedCancha: values.id_cancha ?? null,
            selectedFecha: values.dia ?? null,
            selectedHora: values.hora ?? null,
            isInterzonal: values.interzonal ?? false,
            ventajaDeportiva: values.ventaja_deportiva ?? false,
            equipoVentajaDeportiva: values.id_equipo_ventaja_deportiva ?? null,
        });
    }, []);

    /**
     * Manejador de cambios de campos del formulario
     * Retorna true si el campo fue manejado, false si no
     */
    const handleFieldChange = useCallback((name: string, value: FormDataValue): boolean => {
        switch (name) {
            case 'id_zona':
                setState(prev => ({
                    ...prev,
                    selectedZona: Number(value) || null,
                    // Resetear equipos cuando cambia la zona
                    selectedLocal: null,
                    selectedVisitante: null,
                    isInterzonal: false,
                }));
                return true;

            case 'id_equipolocal':
                setState(prev => {
                    const newLocal = Number(value) || null;
                    return {
                        ...prev,
                        selectedLocal: newLocal,
                        // Si el equipo local estaba seleccionado para ventaja deportiva, resetear
                        equipoVentajaDeportiva: prev.equipoVentajaDeportiva === newLocal 
                            ? null 
                            : prev.equipoVentajaDeportiva,
                    };
                });
                return true;

            case 'id_equipovisita':
                setState(prev => {
                    const newVisitante = Number(value) || null;
                    return {
                        ...prev,
                        selectedVisitante: newVisitante,
                        // Si el equipo visitante estaba seleccionado para ventaja deportiva, resetear
                        equipoVentajaDeportiva: prev.equipoVentajaDeportiva === newVisitante 
                            ? null 
                            : prev.equipoVentajaDeportiva,
                    };
                });
                return true;

            case 'interzonal':
                setState(prev => ({
                    ...prev,
                    isInterzonal: Boolean(value),
                    // Resetear equipos cuando cambia interzonal
                    selectedLocal: null,
                    selectedVisitante: null,
                }));
                return true;

            case 'id_predio':
                setState(prev => ({
                    ...prev,
                    selectedPredio: Number(value) || null,
                    // Resetear cancha cuando cambia el predio
                    selectedCancha: null,
                }));
                return true;

            case 'id_cancha':
                setState(prev => ({
                    ...prev,
                    selectedCancha: Number(value) || null,
                }));
                return true;

            case 'dia':
                setState(prev => ({
                    ...prev,
                    selectedFecha: normalizeFechaValue(value),
                }));
                return true;

            case 'hora':
                setState(prev => ({
                    ...prev,
                    selectedHora: normalizeHoraValue(value),
                }));
                return true;

            case 'ventaja_deportiva':
                setState(prev => ({
                    ...prev,
                    ventajaDeportiva: Boolean(value),
                    // Si se desactiva, resetear equipo seleccionado
                    equipoVentajaDeportiva: value ? prev.equipoVentajaDeportiva : null,
                }));
                return true;

            case 'id_equipo_ventaja_deportiva':
                setState(prev => ({
                    ...prev,
                    equipoVentajaDeportiva: Number(value) || null,
                }));
                return true;

            default:
                return false;
        }
    }, []);

    return {
        // Estado
        ...state,
        
        // Acciones
        resetState,
        initializeFromPartido,
        handleFieldChange,
        
        // Setters individuales (para casos especiales)
        setSelectedZona: (zona: number | null) => 
            setState(prev => ({ ...prev, selectedZona: zona })),
        setSelectedLocal: (local: number | null) => 
            setState(prev => ({ ...prev, selectedLocal: local })),
        setSelectedVisitante: (visitante: number | null) => 
            setState(prev => ({ ...prev, selectedVisitante: visitante })),
        setSelectedPredio: (predio: number | null) => 
            setState(prev => ({ ...prev, selectedPredio: predio })),
        setSelectedCancha: (cancha: number | null) => 
            setState(prev => ({ ...prev, selectedCancha: cancha })),
        setSelectedFecha: (fecha: string | null) => 
            setState(prev => ({ ...prev, selectedFecha: fecha })),
        setSelectedHora: (hora: string | null) => 
            setState(prev => ({ ...prev, selectedHora: hora })),
        setIsInterzonal: (interzonal: boolean) => 
            setState(prev => ({ ...prev, isInterzonal: interzonal })),
        setVentajaDeportiva: (ventaja: boolean) => 
            setState(prev => ({ ...prev, ventajaDeportiva: ventaja })),
        setEquipoVentajaDeportiva: (equipo: number | null) => 
            setState(prev => ({ ...prev, equipoVentajaDeportiva: equipo })),
    };
}

export type UsePartidoFormStateReturn = ReturnType<typeof usePartidoFormState>;

