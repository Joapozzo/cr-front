'use client';

import { useState, useEffect, useMemo } from 'react';
import { FormModal, FormField, FormDataValue } from '../modals/ModalAdmin';
import { useActualizarPartido } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import toast from 'react-hot-toast';
import { PartidoResponse } from '@/app/schemas/partidos.schema';

// Importar desde la nueva estructura modular
import {
    usePartidoFormState,
    usePartidoFormOptions,
    usePartidoDisponibilidad,
    useActualizarPartidoInitialData,
} from '../partidos/hooks';
import { actualizarPartidoSchema } from '../partidos/schemas';
import { parseFechaFromInput } from '../partidos/utils';
import {
    getBasePartidoFields,
    getZonaConditionalFields,
    getVentajaDeportivaFields,
    getEstadoField,
} from '../partidos/fields';

interface ModalActualizarPartidoProps {
    isOpen: boolean;
    onClose: () => void;
    partido: PartidoResponse | null;
    onSuccess?: () => void;
}

export default function ModalActualizarPartido({
    isOpen,
    onClose,
    partido,
    onSuccess
}: ModalActualizarPartidoProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    // Obtener usuarios directamente para los datos iniciales
    const { data: usuarios } = useObtenerPlanilleros();

    // Hook de estado del formulario
    const formState = usePartidoFormState();

    // Hook de datos iniciales (necesita usuarios antes de formOptions)
    const { initialData, initialStateValues } = useActualizarPartidoInitialData({
        partido,
        usuarios,
    });

    // Hook de opciones de selects
    const formOptions = usePartidoFormOptions({
        idCategoriaEdicion,
        selectedPredio: formState.selectedPredio,
        selectedZona: formState.selectedZona,
        selectedLocal: formState.selectedLocal,
        selectedVisitante: formState.selectedVisitante,
        isInterzonal: formState.isInterzonal,
        filterZonasTipo2: false, // Mostrar todas las zonas para actualizar
    });

    // Hook de disponibilidad de cancha
    const disponibilidad = usePartidoDisponibilidad({
        fecha: formState.selectedFecha,
        hora: formState.selectedHora,
        idCategoriaEdicion,
        idCancha: formState.selectedCancha,
        idPartidoExcluir: partido?.id_partido, // Excluir el partido actual
    });

    // Mutación para actualizar partido
    const {
        mutate: actualizarPartido,
        isPending: isUpdating,
        error: updateError,
        isSuccess,
        reset: resetMutation
    } = useActualizarPartido();

    // Promise resolvers para manejar el submit
    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    // Construir campos del formulario
    const fields: FormField[] = useMemo(() => {
        // Campos base (equipos primero, zona después para actualizar)
        const baseFields = getBasePartidoFields({
            zonasOptions: formOptions.zonasOptions,
            equiposLocalOptions: formOptions.equiposLocalOptions,
            equiposVisitanteOptions: formOptions.equiposVisitanteOptions,
            prediosOptions: formOptions.prediosOptions,
            canchasOptions: formOptions.canchasOptions,
            planillerosOptions: formOptions.planillerosOptions,
            loadingZonas: formOptions.loadingZonas,
            loadingEquipos: formOptions.loadingEquipos,
            loadingPredios: formOptions.loadingPredios,
            loadingCanchas: formOptions.loadingCanchas,
            loadingUsuarios: formOptions.loadingUsuarios,
            selectedZona: formState.selectedZona,
            selectedPredio: formState.selectedPredio,
            esZonaTipo1: formOptions.esZonaTipo1,
            zonaFirst: false, // Equipos primero para actualizar
        });

        // Campo de estado (solo para actualizar)
        const estadoField = getEstadoField({
            estadosOptions: formOptions.estadosOptions,
        });

        // Insertar estado después de zona (posición 10 en el array base)
        const fieldsWithEstado = [...baseFields];
        fieldsWithEstado.splice(10, 0, estadoField);

        // Campos condicionales de zona
        const zonaFields = getZonaConditionalFields({
            esZonaTipo2: formOptions.esZonaTipo2,
        });

        // Campos de ventaja deportiva
        const ventajaFields = getVentajaDeportivaFields({
            permiteVentajaDeportiva: formOptions.permiteVentajaDeportiva,
            ventajaDeportiva: formState.ventajaDeportiva,
            equiposVentajaDeportivaOptions: formOptions.equiposVentajaDeportivaOptions,
            selectedLocal: formState.selectedLocal,
            selectedVisitante: formState.selectedVisitante,
        });

        return [...fieldsWithEstado, ...zonaFields, ...ventajaFields];
    }, [
        formOptions.zonasOptions,
        formOptions.equiposLocalOptions,
        formOptions.equiposVisitanteOptions,
        formOptions.prediosOptions,
        formOptions.canchasOptions,
        formOptions.planillerosOptions,
        formOptions.estadosOptions,
        formOptions.equiposVentajaDeportivaOptions,
        formOptions.loadingZonas,
        formOptions.loadingEquipos,
        formOptions.loadingPredios,
        formOptions.loadingCanchas,
        formOptions.loadingUsuarios,
        formOptions.esZonaTipo1,
        formOptions.esZonaTipo2,
        formOptions.permiteVentajaDeportiva,
        formState.selectedZona,
        formState.selectedPredio,
        formState.selectedLocal,
        formState.selectedVisitante,
        formState.ventajaDeportiva,
    ]);

    // Manejar submit
    const handleSubmit = async (data: Record<string, FormDataValue>) => {
        const diaString = typeof data.dia === 'string' ? data.dia : String(data.dia || '');

        const partidoData = {
            id_equipolocal: Number(data.id_equipolocal),
            id_equipovisita: Number(data.id_equipovisita),
            jornada: Number(data.jornada),
            dia: parseFechaFromInput(diaString),
            hora: typeof data.hora === 'string' ? data.hora : String(data.hora || ''),
            id_predio: Number(data.id_predio),
            id_cancha: Number(data.id_cancha),
            arbitro: data.arbitro ? String(data.arbitro) : undefined,
            id_planillero: data.id_planillero ? String(data.id_planillero) : undefined,
            id_zona: Number(data.id_zona),
            destacado: Boolean(data.destacado),
            interzonal: Boolean(data.interzonal),
            ventaja_deportiva: Boolean(data.ventaja_deportiva),
            id_equipo_ventaja_deportiva: data.ventaja_deportiva && data.id_equipo_ventaja_deportiva
                ? Number(data.id_equipo_ventaja_deportiva)
                : undefined,
            estado: typeof data.estado === 'string' 
                ? data.estado as 'P' | 'C1' | 'E' | 'C2' | 'T' | 'F' | 'S' | 'A' | 'I' 
                : undefined,
        };

        if (!partido) {
            return Promise.reject(new Error('No hay partido seleccionado'));
        }

        return new Promise<void>((resolve, reject) => {
            setPromiseResolvers({ resolve, reject });

            actualizarPartido({
                id_categoria_edicion: idCategoriaEdicion,
                id_partido: partido.id_partido,
                partidoData
            });
        });
    };

    // Manejar cambios en los campos
    const handleFieldChange = (name: string, value: FormDataValue) => {
        formState.handleFieldChange(name, value);
    };

    // Efecto para manejar éxito
    useEffect(() => {
        if (isSuccess) {
            toast.success("Partido actualizado con éxito");
            onSuccess?.();
            onClose();
            resetMutation();

            if (promiseResolvers) {
                promiseResolvers.resolve();
                setPromiseResolvers(null);
            }
        }
    }, [isSuccess, onSuccess, onClose, resetMutation, promiseResolvers]);

    // Efecto para manejar errores
    useEffect(() => {
        if (updateError) {
            if (promiseResolvers) {
                promiseResolvers.reject(new Error(updateError.message));
                setPromiseResolvers(null);
            }
        }
    }, [updateError, promiseResolvers]);

    // Efecto para inicializar estado cuando se abre el modal
    useEffect(() => {
        if (isOpen && partido && initialStateValues) {
            formState.initializeFromPartido(initialStateValues);
            setPromiseResolvers(null);
            resetMutation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, partido?.id_partido, initialStateValues]);

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Actualizar partido"
            fields={fields}
            initialData={initialData}
            onSubmit={handleSubmit}
            submitText="Actualizar partido"
            type="edit"
            validationSchema={actualizarPartidoSchema}
            onFieldChange={handleFieldChange}
        >
            {/* Zona seleccionada */}
            {formState.selectedZona && formOptions.zonaSeleccionada && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <h4 className="text-[var(--blue)] font-medium text-sm mb-1">
                            Información de la zona
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            Tipo: {formOptions.zonaSeleccionada.tipoZona.nombre}
                        </p>
                        {formOptions.esZonaTipo2 && (
                            <p className="text-[var(--color-primary)] text-sm pt-1">
                                ✓ Disponible opción interzonal
                            </p>
                        )}
                        {formOptions.permiteVentajaDeportiva && (
                            <p className="text-[var(--color-primary)] text-sm pt-1">
                                ✓ Disponible ventaja deportiva
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Indicadores de carga */}
            {formOptions.isLoading && (
                <div className="mb-4">
                    <div className="bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg p-3">
                        <div className="text-[var(--import)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--import)] border-t-transparent rounded-full animate-spin" />
                            Cargando datos necesarios...
                        </div>
                    </div>
                </div>
            )}

            {/* Advertencias de disponibilidad de cancha */}
            {disponibilidad.shouldShowLoading && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <div className="text-[var(--blue)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
                            Verificando disponibilidad de cancha...
                        </div>
                    </div>
                </div>
            )}

            {disponibilidad.shouldShowWarning && (
                <div className="mb-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <h4 className="text-yellow-500 font-medium text-sm mb-1">
                            ⚠️ Advertencia
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm whitespace-pre-line">
                            {disponibilidad.advertencia}
                        </p>
                        {disponibilidad.conflictos.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-yellow-500/20">
                                <p className="text-[var(--gray-100)] text-xs font-medium mb-1">
                                    Partidos conflictivos:
                                </p>
                                <ul className="text-[var(--gray-100)] text-xs space-y-1">
                                    {disponibilidad.conflictos.map((conflicto) => (
                                        <li key={conflicto.id_partido}>
                                            • Jornada {conflicto.jornada || 'N/A'}: {conflicto.equipos?.local || 'N/A'} vs {conflicto.equipos?.visita || 'N/A'} ({conflicto.hora_inicio} - {conflicto.hora_fin})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Indicador de actualización en progreso */}
            {isUpdating && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <div className="text-[var(--blue)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
                            Actualizando partido...
                        </div>
                    </div>
                </div>
            )}
        </FormModal>
    );
}
