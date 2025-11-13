'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { FormModal, FormField } from '../modals/ModalAdmin';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { useActualizarPartido } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';
import { Usuario } from '@/app/types/user';

interface ModalActualizarPartidoProps {
    isOpen: boolean;
    onClose: () => void;
    partido: any; // El partido a editar
    onSuccess?: () => void;
}

const actualizarPartidoSchema = z.object({
    id_equipolocal: z.number().min(1, 'Debe seleccionar un equipo local'),
    id_equipovisita: z.number().min(1, 'Debe seleccionar un equipo visitante'),
    jornada: z.number().min(1, 'La jornada debe ser mayor a 0'),
    dia: z.string().min(1, 'Debe seleccionar una fecha'),
    hora: z.string().min(1, 'Debe seleccionar una hora'),
    cancha: z.number().min(1, 'Debe seleccionar una cancha'),
    arbitro: z.string().optional(),
    id_planillero: z.string().optional(),
    id_zona: z.number().min(1, 'Debe seleccionar una zona'),
    destacado: z.boolean().default(false),
    interzonal: z.boolean().default(false),
    ventaja_deportiva: z.boolean().default(false),
    estado: z.enum(['P', 'A', 'S'] as const)
        .default('P')
        .refine(val => ['P', 'A', 'S'].includes(val), {
            message: 'El estado debe ser Programado, Aplazado o Suspendido'
        }),
}).refine((data) => data.id_equipolocal !== data.id_equipovisita, {
    message: "El equipo local y visitante no pueden ser el mismo",
    path: ["id_equipovisita"],
});

export default function ModalActualizarPartido({
    isOpen,
    onClose,
    partido,
    onSuccess
}: ModalActualizarPartidoProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const { data: equipos, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);
    const { data: usuarios, isLoading: loadingUsuarios } = useObtenerPlanilleros();
    const { data: zonas, isLoading: loadingZonas } = useObtenerTodasLasZonas(idCategoriaEdicion);

    const {
        mutate: actualizarPartido,
        isPending: isUpdating,
        error: updateError,
        isSuccess,
        reset: resetMutation
    } = useActualizarPartido();

    const [selectedZona, setSelectedZona] = useState<number | null>(null);
    const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
    const [selectedVisitante, setSelectedVisitante] = useState<number | null>(null);
    const [selectedEstado, setSelectedEstado] = useState<string>('P');

    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    // Opciones para los selects con filtrado
    const equiposOptions = equipos?.equipos?.map(equipo => ({
        value: equipo.id_equipo,
        label: equipo.nombre
    })) || [];

    const equiposLocalOptions = equiposOptions.filter(equipo =>
        !selectedVisitante || equipo.value !== selectedVisitante
    );

    const equiposVisitanteOptions = equiposOptions.filter(equipo =>
        !selectedLocal || equipo.value !== selectedLocal
    );

    const planillerosOptions = usuarios?.map((usuario: Usuario) => ({
        value: usuario.uid,
        label: `${usuario.nombre} ${usuario.apellido}`
    })) || [];

    const zonasOptions = zonas?.map(zona => ({
        value: zona.id_zona,
        label: zona.nombre || `Zona ${zona.id_zona}`
    })) || [];

    const canchasOptions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `Cancha ${i + 1}`
    }));

    // Opciones de estado (solo permitir P, A, S para edición)
    const estadosOptions = [
        { value: 'P', label: 'Programado' },
        { value: 'A', label: 'Aplazado' },
        { value: 'S', label: 'Suspendido' }
    ];

    // Obtener información de la zona seleccionada
    const zonaSeleccionada = zonas?.find(z => z.id_zona === selectedZona);
    const esZonaTipo1 = zonaSeleccionada?.id_tipo_zona === 1;
    const esZonaTipo2 = zonaSeleccionada?.id_tipo_zona === 2;

    // Función para formatear fecha para input date
    const formatearFechaParaInput = (fecha: string | Date): string => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toISOString().split('T')[0];
    };

    // Función para formatear hora para input time
    const formatearHoraParaInput = (hora: string): string => {
        if (!hora) return '';
        // Si viene en formato HH:MM:SS, tomar solo HH:MM
        return hora.split(':').slice(0, 2).join(':');
    };

    // Datos iniciales del partido
    const datosIniciales = {
        id_equipolocal: partido?.equipoLocal?.id_equipo || '',
        id_equipovisita: partido?.equipoVisita?.id_equipo || '',
        jornada: partido?.jornada || 1,
        dia: formatearFechaParaInput(partido?.dia),
        hora: formatearHoraParaInput(partido?.hora),
        cancha: partido?.cancha || '',
        arbitro: partido?.arbitro || '',
        id_planillero: partido?.id_planillero || '',
        id_zona: partido?.id_zona || '',
        destacado: partido?.destacado || false,
        interzonal: partido?.interzonal === 'S' || false,
        ventaja_deportiva: partido?.ventaja_deportiva || false,
        estado: partido?.estado || 'P',
    };

    // Campos del formulario base
    const camposBase: FormField[] = [
        {
            name: 'id_equipolocal',
            label: 'Equipo Local',
            type: 'select',
            required: true,
            options: equiposLocalOptions,
            placeholder: loadingEquipos ? 'Cargando equipos...' : 'Seleccionar equipo local'
        },
        {
            name: 'id_equipovisita',
            label: 'Equipo Visitante',
            type: 'select',
            required: true,
            options: equiposVisitanteOptions,
            placeholder: loadingEquipos ? 'Cargando equipos...' : 'Seleccionar equipo visitante'
        },
        {
            name: 'jornada',
            label: 'Jornada',
            type: 'number',
            required: true,
            placeholder: 'Número de jornada'
        },
        {
            name: 'dia',
            label: 'Fecha',
            type: 'date',
            required: true
        },
        {
            name: 'hora',
            label: 'Hora',
            type: 'time',
            required: true
        },
        {
            name: 'cancha',
            label: 'Cancha',
            type: 'select',
            required: true,
            options: canchasOptions,
            placeholder: 'Seleccionar cancha'
        },
        {
            name: 'arbitro',
            label: 'Árbitro',
            type: 'text',
            placeholder: 'Nombre del árbitro (opcional)'
        },
        {
            name: 'id_planillero',
            label: 'Planillero',
            type: 'select',
            options: planillerosOptions,
            placeholder: loadingUsuarios ? 'Cargando planilleros...' : 'Seleccionar planillero (opcional)'
        },
        {
            name: 'id_zona',
            label: 'Zona',
            type: 'select',
            required: true,
            options: zonasOptions,
            placeholder: loadingZonas ? 'Cargando zonas...' : 'Seleccionar zona'
        },
        {
            name: 'estado',
            label: 'Estado del Partido',
            type: 'select',
            required: true,
            options: estadosOptions,
            placeholder: 'Seleccionar estado'
        },
        {
            name: 'destacado',
            label: 'Partido Destacado',
            type: 'switch'
        }
    ];

    // Agregar campos condicionales según zona
    const fields = [...camposBase];

    if (esZonaTipo2) {
        fields.push({
            name: 'interzonal',
            label: 'Partido Interzonal',
            type: 'switch'
        });
    }

    if (esZonaTipo1) {
        fields.push({
            name: 'ventaja_deportiva',
            label: 'Ventaja Deportiva',
            type: 'number',
            placeholder: 'Número de ventaja deportiva (opcional)'
        });
    }

    const handleSubmit = async (data: Record<string, any>) => {

        const partidoData = {
            id_equipolocal: Number(data.id_equipolocal),
            id_equipovisita: Number(data.id_equipovisita),
            jornada: Number(data.jornada),
            dia: data.dia,
            hora: data.hora,
            cancha: Number(data.cancha),
            arbitro: data.arbitro || undefined,
            id_planillero: data.id_planillero || undefined,
            id_zona: Number(data.id_zona),
            destacado: Boolean(data.destacado),
            interzonal: Boolean(data.interzonal),
            ventaja_deportiva: Boolean(data.ventaja_deportiva),
            estado: data.estado,
        };

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
    const handleFieldChange = (name: string, value: any) => {
        if (name === 'id_zona') {
            setSelectedZona(Number(value));
        } else if (name === 'id_equipolocal') {
            setSelectedLocal(Number(value));
        } else if (name === 'id_equipovisita') {
            setSelectedVisitante(Number(value));
        } else if (name === 'estado') {
            setSelectedEstado(value);
        }
    };

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

    useEffect(() => {
        if (updateError) {
            if (promiseResolvers) {
                promiseResolvers.reject(new Error(updateError.message));
                setPromiseResolvers(null);
            }
        }
    }, [updateError, promiseResolvers]);

    useEffect(() => {
        if (isOpen && partido) {
            // Inicializar estados con los datos del partido
            setSelectedZona(partido?.id_zona || null);
            setSelectedLocal(partido?.equipoLocal?.id_equipo || null);
            setSelectedVisitante(partido?.equipoVisita?.id_equipo || null);
            setSelectedEstado(partido?.estado || 'P');
            setPromiseResolvers(null);
            resetMutation();
        }
    }, [isOpen, partido, resetMutation]);

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Actualizar Partido"
            fields={fields}
            initialData={datosIniciales}
            onSubmit={handleSubmit}
            submitText="Actualizar Partido"
            type="edit"
            validationSchema={actualizarPartidoSchema}
            onFieldChange={handleFieldChange}
        >
            {/* Zona seleccionada */}
            {selectedZona && zonaSeleccionada && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <h4 className="text-[var(--blue)] font-medium text-sm mb-1">
                            Información de la Zona
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            Tipo: {zonaSeleccionada.tipoZona.nombre}
                        </p>
                        {esZonaTipo2 && (
                            <p className="text-[var(--green)] text-sm pt-1">
                                ✓ Disponible opción interzonal
                            </p>
                        )}
                        {esZonaTipo1 && (
                            <p className="text-[var(--green)] text-sm pt-1">
                                ✓ Disponible ventaja deportiva
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Indicadores de carga */}
            {(loadingEquipos || loadingUsuarios || loadingZonas) && (
                <div className="mb-4">
                    <div className="bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg p-3">
                        <p className="text-[var(--import)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--import)] border-t-transparent rounded-full animate-spin" />
                            Cargando datos necesarios...
                        </p>
                    </div>
                </div>
            )}

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