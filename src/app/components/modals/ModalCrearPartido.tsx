'use client';

import { useState, useEffect, useMemo } from 'react';
import { FormModal, FormField, FormDataValue } from '../modals/ModalAdmin';
import { useCrearPartido } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';

// Importar desde la nueva estructura modular
import {
    usePartidoFormState,
    usePartidoFormOptions,
    usePartidoDisponibilidad,
    useCrearPartidoInitialData,
} from '../partidos/hooks';
import { crearPartidoSchema } from '../partidos/schemas';
import { parseFechaFromInput } from '../partidos/utils';
import {
    getBasePartidoFields,
    getZonaConditionalFields,
} from '../partidos/fields';

interface ModalCrearPartidoProps {
    isOpen: boolean;
    onClose: () => void;
    jornada: number;
    onSuccess?: () => void;
}

export default function ModalCrearPartido({
    isOpen,
    onClose,
    jornada,
    onSuccess
}: ModalCrearPartidoProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    // Hook de estado del formulario
    const formState = usePartidoFormState();

    // Hook de opciones de selects
    const formOptions = usePartidoFormOptions({
        idCategoriaEdicion,
        selectedPredio: formState.selectedPredio,
        selectedZona: formState.selectedZona,
        selectedLocal: formState.selectedLocal,
        selectedVisitante: formState.selectedVisitante,
        isInterzonal: formState.isInterzonal,
        filterZonasTipo2: true, // Solo mostrar zonas tipo 2 para crear
    });

    // Hook de disponibilidad de cancha
    const disponibilidad = usePartidoDisponibilidad({
        fecha: formState.selectedFecha,
        hora: formState.selectedHora,
        idCategoriaEdicion,
        idCancha: formState.selectedCancha,
        // No excluir ningún partido al crear
    });

    // Hook de datos iniciales
    const { initialData } = useCrearPartidoInitialData({ jornada });

    // Mutación para crear partido
    const {
        mutate: crearPartido,
        isPending: isCreating,
        error: createError,
        isSuccess,
        reset: resetMutation
    } = useCrearPartido();

    // Promise resolvers para manejar el submit
    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    // Construir campos del formulario
    const fields: FormField[] = useMemo(() => {
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
            zonaFirst: true, // Zona primero para crear
        });

        const zonaFields = getZonaConditionalFields({
            esZonaTipo2: formOptions.esZonaTipo2,
        });

        return [...baseFields, ...zonaFields];
    }, [
        formOptions.zonasOptions,
        formOptions.equiposLocalOptions,
        formOptions.equiposVisitanteOptions,
        formOptions.prediosOptions,
        formOptions.canchasOptions,
        formOptions.planillerosOptions,
        formOptions.loadingZonas,
        formOptions.loadingEquipos,
        formOptions.loadingPredios,
        formOptions.loadingCanchas,
        formOptions.loadingUsuarios,
        formOptions.esZonaTipo1,
        formOptions.esZonaTipo2,
        formState.selectedZona,
        formState.selectedPredio,
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
            id_cancha: Number(data.id_cancha),
            arbitro: data.arbitro ? String(data.arbitro) : undefined,
            id_planillero: data.id_planillero ? String(data.id_planillero) : undefined,
            id_zona: Number(data.id_zona),
            destacado: Boolean(data.destacado),
            interzonal: Boolean(data.interzonal),
            ventaja_deportiva: data.ventaja_deportiva ? Boolean(data.ventaja_deportiva) : undefined,
        };

        return new Promise<void>((resolve, reject) => {
            setPromiseResolvers({ resolve, reject });
            crearPartido({
                id_categoria_edicion: idCategoriaEdicion,
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
            toast.success("Partido creado con éxito");
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
        if (createError) {
            if (promiseResolvers) {
                promiseResolvers.reject(new Error(createError.message));
                setPromiseResolvers(null);
            }
        }
    }, [createError, promiseResolvers]);

    // Efecto para resetear al abrir/cerrar
    useEffect(() => {
        if (isOpen) {
            formState.resetState();
            setPromiseResolvers(null);
            resetMutation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear nuevo partido"
            fields={fields}
            initialData={initialData}
            onSubmit={handleSubmit}
            submitText="Crear Partido"
            type="create"
            validationSchema={crearPartidoSchema}
            onFieldChange={handleFieldChange}
        >
            {/* Información de la Categoría */}
            <div className="mb-6">
                <div className="bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg p-4">
                    <h3 className="text-[var(--white)] font-medium mb-2">
                        Información de la Categoría
                    </h3>
                    <p className="text-[var(--gray-100)] text-sm">
                        {categoriaSeleccionada?.nombre_completo || 'Categoría no seleccionada'}
                    </p>
                    <p className="text-[var(--gray-100)] text-sm">
                        Jornada: {jornada}
                    </p>
                </div>
            </div>

            {/* Advertencia si se selecciona zona de eliminación directa */}
            {formState.selectedZona && formOptions.esZonaTipo1 && (
                <div className="mb-4">
                    <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-lg p-3">
                        <h4 className="text-[var(--color-danger)] font-medium text-sm mb-1">
                            ⚠️ Zona de Eliminación Directa
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            No se pueden crear partidos manualmente para zonas de eliminación directa.
                            Por favor, seleccione una zona de &quot;Todos contra todos&quot;.
                        </p>
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
                        <p className="text-[var(--blue)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
                            Verificando disponibilidad de cancha...
                        </p>
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

            {/* Indicador de creación en progreso */}
            {isCreating && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <div className="text-[var(--blue)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
                            Creando partido...
                        </div>
                    </div>
                </div>
            )}
        </FormModal>
    );
}
