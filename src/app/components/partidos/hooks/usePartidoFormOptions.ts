'use client';

import { useMemo } from 'react';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { usePredios, useCanchasPorPredio } from '@/app/hooks/usePredios';
import { Usuario } from '@/app/types/user';
import { ESTADO_PARTIDO_OPTIONS } from '../schemas/actualizarPartido.schema';

/**
 * Tipo para una opción de select
 */
export interface SelectOption {
    value: string | number;
    label: string;
}

/**
 * Información de zona para determinar tipo
 */
export interface ZonaInfo {
    id_zona: number;
    id_tipo_zona: number;
    nombre?: string;
}

/**
 * Parámetros para el hook
 */
export interface UsePartidoFormOptionsParams {
    idCategoriaEdicion: number;
    selectedPredio: number | null;
    selectedZona: number | null;
    selectedLocal: number | null;
    selectedVisitante: number | null;
    isInterzonal: boolean;
    /** Si es true, filtra zonas para mostrar solo tipo 2 (todos contra todos) */
    filterZonasTipo2?: boolean;
}

/**
 * Hook para construir todas las opciones de selects del formulario de partido
 * Centraliza la lógica de obtención y filtrado de opciones
 */
export function usePartidoFormOptions({
    idCategoriaEdicion,
    selectedPredio,
    selectedZona,
    selectedLocal,
    selectedVisitante,
    isInterzonal,
    filterZonasTipo2 = false,
}: UsePartidoFormOptionsParams) {
    // Queries de datos
    const { data: equipos, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);
    const { data: usuarios, isLoading: loadingUsuarios } = useObtenerPlanilleros();
    const { data: zonas, isLoading: loadingZonas } = useObtenerTodasLasZonas(idCategoriaEdicion);
    const { data: predios = [], isLoading: loadingPredios } = usePredios(false);
    const { data: canchasDelPredio = [], isLoading: loadingCanchas } = useCanchasPorPredio(
        selectedPredio || 0,
        false,
        { enabled: !!selectedPredio }
    );

    // Filtrar predios y canchas activos
    const prediosActivos = useMemo(() => 
        predios.filter(p => p.estado === 'A'),
        [predios]
    );

    const canchasActivas = useMemo(() => 
        canchasDelPredio.filter(c => c.estado === 'A'),
        [canchasDelPredio]
    );

    // Información de la zona seleccionada
    const zonaSeleccionada = useMemo(() => 
        zonas?.find(z => z.id_zona === selectedZona) || null,
        [zonas, selectedZona]
    );

    const esZonaTipo1 = zonaSeleccionada?.id_tipo_zona === 2; // Eliminación directa
    const esZonaTipo2 = zonaSeleccionada?.id_tipo_zona === 1; // Todos contra todos
    const permiteVentajaDeportiva = zonaSeleccionada?.id_tipo_zona === 2 || zonaSeleccionada?.id_tipo_zona === 4;

    // Equipos disponibles según zona e interzonal
    const equiposDisponibles = useMemo(() => {
        if (!equipos?.equipos) return [];

        // Si no hay zona seleccionada, mostrar todos
        if (!selectedZona) return equipos.equipos;

        // Si es zona tipo 1 (eliminación directa), no permitir crear partidos
        if (esZonaTipo1) return [];

        // Si es zona tipo 2 (todos contra todos)
        if (esZonaTipo2) {
            // Si es interzonal, mostrar todos los equipos
            if (isInterzonal) {
                return equipos.equipos;
            }
            // Solo equipos de la zona seleccionada
            return equipos.equipos.filter(equipo => equipo.id_zona === selectedZona);
        }

        return equipos.equipos;
    }, [equipos?.equipos, selectedZona, esZonaTipo1, esZonaTipo2, isInterzonal]);

    // Opciones de equipos
    const equiposOptions: SelectOption[] = useMemo(() =>
        equiposDisponibles.map(equipo => ({
            value: equipo.id_equipo,
            label: equipo.nombre
        })),
        [equiposDisponibles]
    );

    // Opciones de equipo local (excluyendo visitante seleccionado)
    const equiposLocalOptions: SelectOption[] = useMemo(() =>
        equiposOptions.filter(equipo =>
            !selectedVisitante || equipo.value !== selectedVisitante
        ),
        [equiposOptions, selectedVisitante]
    );

    // Opciones de equipo visitante (excluyendo local seleccionado)
    const equiposVisitanteOptions: SelectOption[] = useMemo(() =>
        equiposOptions.filter(equipo =>
            !selectedLocal || equipo.value !== selectedLocal
        ),
        [equiposOptions, selectedLocal]
    );

    // Opciones de planilleros
    const planillerosOptions: SelectOption[] = useMemo(() =>
        usuarios?.map((usuario: Usuario) => ({
            value: usuario.uid,
            label: `${usuario.nombre} ${usuario.apellido}`
        })) || [],
        [usuarios]
    );

    // Opciones de zonas (opcionalmente filtradas)
    const zonasOptions: SelectOption[] = useMemo(() => {
        const zonasAMostrar = filterZonasTipo2
            ? zonas?.filter(zona => zona.id_tipo_zona === 1) || []
            : zonas || [];

        return zonasAMostrar.map(zona => ({
            value: zona.id_zona,
            label: zona.nombre || `Zona ${zona.id_zona}`
        }));
    }, [zonas, filterZonasTipo2]);

    // Opciones de predios
    const prediosOptions: SelectOption[] = useMemo(() =>
        prediosActivos.map(predio => ({
            value: predio.id_predio,
            label: predio.nombre
        })),
        [prediosActivos]
    );

    // Opciones de canchas
    const canchasOptions: SelectOption[] = useMemo(() =>
        canchasActivas.map(cancha => ({
            value: cancha.id_cancha,
            label: `${cancha.nombre} - ${cancha.predio?.nombre || ''}`
        })),
        [canchasActivas]
    );

    // Opciones de equipo con ventaja deportiva (solo local y visitante)
    const equiposVentajaDeportivaOptions: SelectOption[] = useMemo(() => {
        const options: SelectOption[] = [];
        if (selectedLocal && selectedVisitante) {
            const equipoLocal = equiposOptions.find(e => e.value === selectedLocal);
            const equipoVisitante = equiposOptions.find(e => e.value === selectedVisitante);
            if (equipoLocal) options.push(equipoLocal);
            if (equipoVisitante) options.push(equipoVisitante);
        }
        return options;
    }, [selectedLocal, selectedVisitante, equiposOptions]);

    // Opciones de estado
    const estadosOptions = useMemo(() => [...ESTADO_PARTIDO_OPTIONS], []);

    return {
        // Opciones
        equiposOptions,
        equiposLocalOptions,
        equiposVisitanteOptions,
        planillerosOptions,
        zonasOptions,
        prediosOptions,
        canchasOptions,
        equiposVentajaDeportivaOptions,
        estadosOptions,

        // Estados de carga
        loadingEquipos,
        loadingUsuarios,
        loadingZonas,
        loadingPredios,
        loadingCanchas,
        isLoading: loadingEquipos || loadingUsuarios || loadingZonas || loadingPredios || loadingCanchas,

        // Información de zona
        zonaSeleccionada,
        esZonaTipo1,
        esZonaTipo2,
        permiteVentajaDeportiva,

        // Datos crudos (para casos especiales)
        usuarios,
        equipos: equipos?.equipos,
        zonas,
        prediosActivos,
        canchasActivas,
    };
}

export type UsePartidoFormOptionsReturn = ReturnType<typeof usePartidoFormOptions>;

