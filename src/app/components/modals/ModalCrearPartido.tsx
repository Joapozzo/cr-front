'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { FormModal, FormField } from '../modals/ModalAdmin';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { useCrearPartido } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';
import { Usuario } from '@/app/types/user';

interface ModalCrearPartidoProps {
    isOpen: boolean;
    onClose: () => void;
    jornada: number;
    onSuccess?: () => void;
}

const partidoSchema = z.object({
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
    ventaja_deportiva: z.number().optional(),
}).refine((data) => data.id_equipolocal !== data.id_equipovisita, {
    message: "El equipo local y visitante no pueden ser el mismo",
    path: ["id_equipovisita"],
});

export default function ModalCrearPartido({
    isOpen,
    onClose,
    jornada,
    onSuccess
}: ModalCrearPartidoProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const { data: equipos, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);
    const { data: usuarios, isLoading: loadingUsuarios } = useObtenerPlanilleros();
    const { data: zonas, isLoading: loadingZonas } = useObtenerTodasLasZonas(idCategoriaEdicion);

    const {
        mutate: crearPartido,
        isPending: isCreating,
        error: createError,
        isSuccess,
        reset: resetMutation
    } = useCrearPartido();

    const [selectedZona, setSelectedZona] = useState<number | null>(null);
    const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
    const [selectedVisitante, setSelectedVisitante] = useState<number | null>(null);
    const [isInterzonal, setIsInterzonal] = useState(false);

    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    const zonaSeleccionada = zonas?.find(z => z.id_zona === selectedZona);
    const esZonaTipo1 = zonaSeleccionada?.id_tipo_zona === 1; // Eliminación directa
    const esZonaTipo2 = zonaSeleccionada?.id_tipo_zona === 2; // Todos contra todos

    const getEquiposDisponibles = () => {
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
            
            return equipos.equipos.filter(equipo => 
                equipo.id_zona === selectedZona
            );
        }

        return equipos.equipos;
    };

    const equiposDisponibles = getEquiposDisponibles();

    const equiposOptions = equiposDisponibles.map(equipo => ({
        value: equipo.id_equipo,
        label: equipo.nombre
    }));

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

    // ✅ Filtrar zonas para mostrar solo tipo 2 (todos contra todos)
    const zonasDisponibles = zonas?.filter(zona => zona.id_tipo_zona === 2) || [];
    
    const zonasOptions = zonasDisponibles.map(zona => ({
        value: zona.id_zona,
        label: zona.nombre || `Zona ${zona.id_zona}`
    }));

    const canchasOptions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `Cancha ${i + 1}`
    }));

    const fields: FormField[] = [
        {
            name: 'id_zona',
            label: 'Zona',
            type: 'select',
            required: true,
            options: zonasOptions,
            placeholder: loadingZonas ? 'Cargando zonas...' : 'Seleccionar zona'
        },
        {
            name: 'id_equipolocal',
            label: 'Equipo Local',
            type: 'select',
            required: true,
            options: equiposLocalOptions,
            placeholder: loadingEquipos ? 'Cargando equipos...' : 
                        esZonaTipo1 ? 'No disponible para eliminación directa' :
                        !selectedZona ? 'Primero seleccione una zona' :
                        equiposLocalOptions.length === 0 ? 'No hay equipos disponibles en esta zona' :
                        'Seleccionar equipo local',
            disabled: !selectedZona || esZonaTipo1 || equiposLocalOptions.length === 0
        },
        {
            name: 'id_equipovisita',
            label: 'Equipo Visitante',
            type: 'select',
            required: true,
            options: equiposVisitanteOptions,
            placeholder: loadingEquipos ? 'Cargando equipos...' : 
                        esZonaTipo1 ? 'No disponible para eliminación directa' :
                        !selectedZona ? 'Primero seleccione una zona' :
                        equiposVisitanteOptions.length === 0 ? 'No hay equipos disponibles en esta zona' :
                        'Seleccionar equipo visitante',
            disabled: !selectedZona || esZonaTipo1 || equiposVisitanteOptions.length === 0
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
            name: 'destacado',
            label: 'Partido Destacado',
            type: 'switch'
        }
    ];

    // ✅ Solo agregar campo interzonal si la zona es tipo 2
    if (esZonaTipo2) {
        fields.push({
            name: 'interzonal',
            label: 'Partido Interzonal',
            type: 'switch'
        });
    }

    // ✅ Ventaja deportiva solo para zona tipo 1 (pero no deberíamos llegar aquí si bloqueamos tipo 1)
    if (esZonaTipo1) {
        fields.push({
            name: 'ventaja_deportiva',
            label: 'Ventaja Deportiva',
            type: 'switch',
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
    const handleFieldChange = (name: string, value: any) => {
        if (name === 'id_zona') {
            const newZona = Number(value);
            setSelectedZona(newZona);
            // Resetear selección de equipos cuando cambia la zona
            setSelectedLocal(null);
            setSelectedVisitante(null);
            setIsInterzonal(false);
        } else if (name === 'id_equipolocal') {
            setSelectedLocal(Number(value));
        } else if (name === 'id_equipovisita') {
            setSelectedVisitante(Number(value));
        } else if (name === 'interzonal') {
            setIsInterzonal(Boolean(value));
            // Resetear equipos cuando cambia interzonal
            setSelectedLocal(null);
            setSelectedVisitante(null);
        }
    };

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

    useEffect(() => {
        if (createError) {
            if (promiseResolvers) {
                promiseResolvers.reject(new Error(createError.message));
                setPromiseResolvers(null);
            }
        }
    }, [createError, promiseResolvers]);

    useEffect(() => {
        if (isOpen) {
            setSelectedZona(null);
            setSelectedLocal(null);
            setSelectedVisitante(null);
            setIsInterzonal(false);
            setPromiseResolvers(null);
            resetMutation();
        }
    }, [isOpen, resetMutation]);

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear nuevo partido"
            fields={fields}
            initialData={{
                jornada,
                destacado: false,
                interzonal: false
            }}
            onSubmit={handleSubmit}
            submitText="Crear Partido"
            type="create"
            validationSchema={partidoSchema}
            onFieldChange={handleFieldChange}
        >
            {/* Contenido adicional del modal */}
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

            {/* ✅ Advertencia si se selecciona zona de eliminación directa */}
            {selectedZona && esZonaTipo1 && (
                <div className="mb-4">
                    <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-3">
                        <h4 className="text-[var(--red)] font-medium text-sm mb-1">
                            ⚠️ Zona de Eliminación Directa
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            No se pueden crear partidos manualmente para zonas de eliminación directa.
                            Por favor, seleccione una zona de "Todos contra todos".
                        </p>
                    </div>
                </div>
            )}

            {/* Indicadores de carga */}
            {(loadingEquipos || loadingUsuarios || loadingZonas) && (
                <div className="mb-4">
                    <div className="bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg p-3">
                        <div className="text-[var(--import)] text-sm flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--import)] border-t-transparent rounded-full animate-spin" />
                            Cargando datos necesarios...
                        </div>
                    </div>
                </div>
            )}

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