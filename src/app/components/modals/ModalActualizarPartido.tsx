'use client';

import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { FormModal, FormField } from '../modals/ModalAdmin';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useObtenerPlanilleros } from '@/app/hooks/useUsuarios';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { useActualizarPartido } from '@/app/hooks/usePartidosAdmin';
import { usePredios, useCanchasPorPredio } from '@/app/hooks/usePredios';
import { useVerificarDisponibilidadCancha } from '@/app/hooks/useCanchas';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';
import { Usuario } from '@/app/types/user';
import { PartidoResponse } from '@/app/schemas/partidos.schema';

interface ModalActualizarPartidoProps {
    isOpen: boolean;
    onClose: () => void;
    partido: PartidoResponse | null; // El partido a editar
    onSuccess?: () => void;
}

const actualizarPartidoSchema = z.object({
    id_equipolocal: z.coerce.number().min(1, 'Debe seleccionar un equipo local'),
    id_equipovisita: z.coerce.number().min(1, 'Debe seleccionar un equipo visitante'),
    jornada: z.coerce.number().min(1, 'La jornada debe ser mayor a 0'),
    dia: z.string().min(1, 'Debe seleccionar una fecha'),
    hora: z.string().min(1, 'Debe seleccionar una hora'),
    id_predio: z.coerce.number().min(1, 'Debe seleccionar un predio'),
    id_cancha: z.coerce.number().min(1, 'Debe seleccionar una cancha'),
    arbitro: z.string().optional(),
    id_planillero: z.string().optional(),
    id_zona: z.coerce.number().min(1, 'Debe seleccionar una zona'),
    destacado: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    interzonal: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    ventaja_deportiva: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    id_equipo_ventaja_deportiva: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
    }, z.number().optional()),
    estado: z.enum(['P', 'C1', 'E', 'C2', 'T', 'F', 'S', 'A', 'I'] as const, {
        message: 'El estado debe ser uno de: Programado (P), Primer tiempo (C1), Entretiempo (E), Segundo tiempo (C2), Terminado (T), Finalizado (F), Suspendido (S), Aplazado (A), Indefinido (I)'
    }).default('P'),
}).refine((data) => data.id_equipolocal !== data.id_equipovisita, {
    message: "El equipo local y visitante no pueden ser el mismo",
    path: ["id_equipovisita"],
}).refine((data) => {
    // Si ventaja_deportiva es true, debe seleccionar un equipo
    if (data.ventaja_deportiva && !data.id_equipo_ventaja_deportiva) {
        return false;
    }
    return true;
}, {
    message: "Debe seleccionar un equipo con ventaja deportiva",
    path: ["id_equipo_ventaja_deportiva"],
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
    
    // Obtener predios activos
    const { data: predios = [], isLoading: loadingPredios } = usePredios(false);
    const prediosActivos = predios.filter(p => p.estado === 'A');
    
    // Estados para predio y cancha seleccionados
    const [selectedPredio, setSelectedPredio] = useState<number | null>(null);
    const [selectedCancha, setSelectedCancha] = useState<number | null>(null);
    const [selectedFecha, setSelectedFecha] = useState<string | null>(null);
    const [selectedHora, setSelectedHora] = useState<string | null>(null);
    
    // Obtener canchas del predio seleccionado (solo activas)
    const { data: canchasDelPredio = [], isLoading: loadingCanchas } = useCanchasPorPredio(
        selectedPredio || 0,
        false, // No incluir inactivas
        { enabled: !!selectedPredio }
    );
    const canchasActivas = canchasDelPredio.filter(c => c.estado === 'A');
    
    // Verificar disponibilidad de cancha cuando se seleccionan fecha, hora y cancha
    const { data: disponibilidadCancha, isLoading: loadingDisponibilidad } = useVerificarDisponibilidadCancha(
        selectedFecha,
        selectedHora,
        idCategoriaEdicion || null,
        selectedCancha,
        partido?.id_partido // Excluir el partido actual al verificar
    );

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
    const [ventajaDeportiva, setVentajaDeportiva] = useState<boolean>(false);
    const [equipoVentajaDeportiva, setEquipoVentajaDeportiva] = useState<number | null>(null);

    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    // Opciones para los selects con filtrado
    const equiposOptions = useMemo(() => 
        equipos?.equipos?.map(equipo => ({
            value: equipo.id_equipo,
            label: equipo.nombre
        })) || [], 
        [equipos?.equipos]
    );

    const equiposLocalOptions = useMemo(() => 
        equiposOptions.filter(equipo =>
            !selectedVisitante || equipo.value !== selectedVisitante
        ),
        [equiposOptions, selectedVisitante]
    );

    const equiposVisitanteOptions = useMemo(() => 
        equiposOptions.filter(equipo =>
            !selectedLocal || equipo.value !== selectedLocal
        ),
        [equiposOptions, selectedLocal]
    );

    const planillerosOptions = useMemo(() => 
        usuarios?.map((usuario: Usuario) => ({
            value: usuario.uid,
            label: `${usuario.nombre} ${usuario.apellido}`
        })) || [],
        [usuarios]
    );

    const zonasOptions = useMemo(() => 
        zonas?.map(zona => ({
            value: zona.id_zona,
            label: zona.nombre || `Zona ${zona.id_zona}`
        })) || [],
        [zonas]
    );

    // Opciones de predios activos
    const prediosOptions = useMemo(() => 
        prediosActivos.map(predio => ({
            value: predio.id_predio,
            label: predio.nombre
        })),
        [prediosActivos]
    );

    // Opciones de canchas activas del predio seleccionado
    const canchasOptions = useMemo(() => 
        canchasActivas.map(cancha => ({
            value: cancha.id_cancha,
            label: `${cancha.nombre} - ${cancha.predio?.nombre || ''}`
        })),
        [canchasActivas]
    );

    // Opciones de estado (todos los estados disponibles)
    const estadosOptions = useMemo(() => [
        { value: 'P', label: 'Programado' },
        { value: 'C1', label: 'Primer tiempo' },
        { value: 'E', label: 'Entretiempo' },
        { value: 'C2', label: 'Segundo tiempo' },
        { value: 'T', label: 'Terminado' },
        { value: 'F', label: 'Finalizado' },
        { value: 'S', label: 'Suspendido' },
        { value: 'A', label: 'Aplazado' },
        { value: 'I', label: 'Indefinido' }
    ], []);

    // Buscar el planillero del partido por nombre y apellido
    const encontrarPlanilleroPorNombre = useMemo(() => {
        return (nombre?: string, apellido?: string): string => {
            if (!nombre || !apellido || !usuarios) return '';
            const planilleroEncontrado = usuarios.find(
                (usuario: Usuario) => 
                    usuario.nombre.toLowerCase() === nombre.toLowerCase() && 
                    usuario.apellido.toLowerCase() === apellido.toLowerCase()
            );
            return planilleroEncontrado?.uid || '';
        };
    }, [usuarios]);

    // Obtener información de la zona seleccionada
    const zonaSeleccionada = zonas?.find(z => z.id_zona === selectedZona);
    const esZonaTipo2 = zonaSeleccionada?.id_tipo_zona === 1; // Todos contra todos
    // Ventaja deportiva solo para eliminación directa (2) o eliminación directa ida y vuelta (4)
    const permiteVentajaDeportiva = zonaSeleccionada?.id_tipo_zona === 2 || zonaSeleccionada?.id_tipo_zona === 4;

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

    // Datos iniciales del partido - memoizado para evitar reseteos constantes
    const datosIniciales = useMemo(() => {
        if (!partido) {
            return {
                id_equipolocal: '',
                id_equipovisita: '',
                jornada: 1,
                dia: '',
                hora: '',
                id_predio: '',
                id_cancha: '',
                arbitro: '',
                id_planillero: '',
                id_zona: '',
                destacado: false,
                interzonal: false,
                ventaja_deportiva: false,
                id_equipo_ventaja_deportiva: '',
                estado: 'P',
            };
        }

        return {
            id_equipolocal: partido.equipoLocal?.id_equipo || '',
            id_equipovisita: partido.equipoVisita?.id_equipo || '',
            jornada: partido.jornada || 1,
            dia: partido.dia ? formatearFechaParaInput(partido.dia) : '',
            hora: partido.hora ? formatearHoraParaInput(partido.hora) : '',
            id_predio: partido.cancha?.id_predio || partido.cancha?.predio?.id_predio || '',
            id_cancha: partido.cancha?.id_cancha || '',
            arbitro: partido.arbitro || '',
            id_planillero: partido.planillero 
                ? encontrarPlanilleroPorNombre(partido.planillero.nombre, partido.planillero.apellido)
                : '',
            id_zona: partido.id_zona || '',
            destacado: partido.destacado || false,
            interzonal: typeof partido.interzonal === 'boolean' ? partido.interzonal : false,
            ventaja_deportiva: partido.ventaja_deportiva || false,
            id_equipo_ventaja_deportiva: (partido as PartidoResponse & { equipoVentajaDeportiva?: { id_equipo: number }; id_equipo_ventaja_deportiva?: number })?.equipoVentajaDeportiva?.id_equipo || (partido as PartidoResponse & { id_equipo_ventaja_deportiva?: number })?.id_equipo_ventaja_deportiva || '',
            estado: partido.estado || 'P',
        };
    }, [partido, encontrarPlanilleroPorNombre]); // Solo recalcular cuando partido o la función cambien

    // Campos del formulario base
    const camposBase: FormField[] = useMemo(() => [
        {
            name: 'id_equipolocal',
            label: 'Equipo local',
            type: 'select',
            required: true,
            options: equiposLocalOptions,
            placeholder: loadingEquipos ? 'Cargando equipos...' : 'Seleccionar equipo local'
        },
        {
            name: 'id_equipovisita',
            label: 'Equipo visitante',
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
            name: 'id_predio',
            label: 'Predio',
            type: 'select',
            required: true,
            options: prediosOptions,
            placeholder: loadingPredios ? 'Cargando predios...' : 
                        prediosOptions.length === 0 ? 'No hay predios disponibles' :
                        'Seleccionar predio',
            disabled: loadingPredios || prediosOptions.length === 0
        },
        {
            name: 'id_cancha',
            label: 'Cancha',
            type: 'select',
            required: true,
            options: canchasOptions,
            placeholder: !selectedPredio ? 'Primero seleccione un predio' :
                        loadingCanchas ? 'Cargando canchas...' :
                        canchasOptions.length === 0 ? 'No hay canchas disponibles en este predio' :
                        'Seleccionar cancha',
            disabled: !selectedPredio || loadingCanchas || canchasOptions.length === 0
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
            label: 'Estado del partido',
            type: 'select',
            required: true,
            options: estadosOptions,
            placeholder: 'Seleccionar estado'
        },
        {
            name: 'destacado',
            label: 'Partido destacado',
            type: 'switch'
        }
    ], [equiposLocalOptions, equiposVisitanteOptions, loadingEquipos, prediosOptions, loadingPredios, canchasOptions, selectedPredio, loadingCanchas, planillerosOptions, loadingUsuarios, zonasOptions, loadingZonas, estadosOptions]);

    // Opciones para el select de equipo con ventaja deportiva (solo local y visitante)
    const equiposVentajaDeportivaOptions = useMemo(() => {
        const options = [];
        if (selectedLocal && selectedVisitante) {
            const equipoLocal = equiposOptions.find(e => e.value === selectedLocal);
            const equipoVisitante = equiposOptions.find(e => e.value === selectedVisitante);
            if (equipoLocal) {
                options.push(equipoLocal);
            }
            if (equipoVisitante) {
                options.push(equipoVisitante);
            }
        }
        return options;
    }, [selectedLocal, selectedVisitante, equiposOptions]);

    // Agregar campos condicionales según zona
    const fields = useMemo(() => {
        const fieldsArray = [...camposBase];

        if (esZonaTipo2) {
            fieldsArray.push({
                name: 'interzonal',
                label: 'Partido interzonal',
                type: 'switch'
            });
        }

        if (permiteVentajaDeportiva) {
            fieldsArray.push({
                name: 'ventaja_deportiva',
                label: 'Ventaja deportiva',
                type: 'switch'
            });
            
            // Agregar select de equipo solo si ventaja_deportiva está activada
            if (ventajaDeportiva) {
                fieldsArray.push({
                    name: 'id_equipo_ventaja_deportiva',
                    label: 'Equipo con ventaja deportiva',
                    type: 'select',
                    required: ventajaDeportiva,
                    options: equiposVentajaDeportivaOptions,
                    placeholder: !selectedLocal || !selectedVisitante 
                        ? 'Primero seleccione los equipos local y visitante'
                        : equiposVentajaDeportivaOptions.length === 0
                        ? 'No hay equipos disponibles'
                        : 'Seleccionar equipo',
                    disabled: !selectedLocal || !selectedVisitante || equiposVentajaDeportivaOptions.length === 0
                });
            }
        }

        return fieldsArray;
    }, [camposBase, esZonaTipo2, permiteVentajaDeportiva, ventajaDeportiva, equiposVentajaDeportivaOptions, selectedLocal, selectedVisitante]);

    const handleSubmit = async (data: Record<string, unknown>) => {

        const partidoData = {
            id_equipolocal: Number(data.id_equipolocal),
            id_equipovisita: Number(data.id_equipovisita),
            jornada: Number(data.jornada),
            dia: typeof data.dia === 'string' ? new Date(data.dia) : undefined,
            hora: typeof data.hora === 'string' ? data.hora : undefined,
            id_predio: Number(data.id_predio),
            id_cancha: Number(data.id_cancha),
            arbitro: typeof data.arbitro === 'string' ? data.arbitro : undefined,
            id_planillero: typeof data.id_planillero === 'string' ? data.id_planillero : undefined,
            id_zona: Number(data.id_zona),
            destacado: Boolean(data.destacado),
            interzonal: Boolean(data.interzonal),
            ventaja_deportiva: Boolean(data.ventaja_deportiva),
            id_equipo_ventaja_deportiva: data.ventaja_deportiva && data.id_equipo_ventaja_deportiva 
                ? Number(data.id_equipo_ventaja_deportiva) 
                : undefined,
            estado: typeof data.estado === 'string' ? data.estado as 'P' | 'C1' | 'E' | 'C2' | 'T' | 'F' | 'S' | 'A' | 'I' : undefined,
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
    const handleFieldChange = (name: string, value: unknown) => {
        if (name === 'id_zona') {
            setSelectedZona(Number(value));
        } else if (name === 'id_equipolocal') {
            setSelectedLocal(Number(value));
            // Si cambia el equipo local y estaba seleccionado para ventaja deportiva, resetear
            if (equipoVentajaDeportiva === Number(value)) {
                setEquipoVentajaDeportiva(null);
            }
        } else if (name === 'id_equipovisita') {
            setSelectedVisitante(Number(value));
            // Si cambia el equipo visitante y estaba seleccionado para ventaja deportiva, resetear
            if (equipoVentajaDeportiva === Number(value)) {
                setEquipoVentajaDeportiva(null);
            }
        } else if (name === 'ventaja_deportiva') {
            setVentajaDeportiva(Boolean(value));
            // Si se desactiva la ventaja deportiva, resetear el equipo seleccionado
            if (!value) {
                setEquipoVentajaDeportiva(null);
            }
        } else if (name === 'id_equipo_ventaja_deportiva') {
            setEquipoVentajaDeportiva(Number(value) || null);
        } else if (name === 'id_predio') {
            const newPredio = Number(value);
            setSelectedPredio(newPredio);
            // Resetear selección de cancha cuando cambia el predio
            setSelectedCancha(null);
        } else if (name === 'id_cancha') {
            setSelectedCancha(Number(value) || null);
        } else if (name === 'dia') {
            // Convertir fecha a formato YYYY-MM-DD si viene como Date o string
            const fechaValue = typeof value === 'string' ? value : value instanceof Date ? value.toISOString().split('T')[0] : null;
            setSelectedFecha(fechaValue);
        } else if (name === 'hora') {
            const horaValue = typeof value === 'string' ? value : null;
            setSelectedHora(horaValue);
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
            // Inicializar estados con los datos del partido solo cuando se abre el modal
            setSelectedZona(partido.id_zona || null);
            setSelectedLocal(partido.equipoLocal?.id_equipo || null);
            setSelectedVisitante(partido.equipoVisita?.id_equipo || null);
            
            // Inicializar ventaja deportiva
            setVentajaDeportiva(partido.ventaja_deportiva || false);
            const equipoVentajaId = (partido as PartidoResponse & { equipoVentajaDeportiva?: { id_equipo: number }; id_equipo_ventaja_deportiva?: number })?.equipoVentajaDeportiva?.id_equipo || (partido as PartidoResponse & { id_equipo_ventaja_deportiva?: number })?.id_equipo_ventaja_deportiva || null;
            setEquipoVentajaDeportiva(equipoVentajaId ? Number(equipoVentajaId) : null);
            
            // Inicializar predio y cancha - IMPORTANTE: establecer predio primero
            // para que se carguen las canchas del predio
            const predioId = partido.cancha?.id_predio || partido.cancha?.predio?.id_predio || null;
            const canchaId = partido.cancha?.id_cancha || null;
            
            if (predioId) {
                setSelectedPredio(Number(predioId));
            } else {
                setSelectedPredio(null);
            }
            
            if (canchaId) {
                setSelectedCancha(Number(canchaId));
            } else {
                setSelectedCancha(null);
            }
            
            // Inicializar fecha y hora para verificación de disponibilidad
            if (partido.dia) {
                const fechaFormateada = formatearFechaParaInput(partido.dia);
                setSelectedFecha(fechaFormateada);
            } else {
                setSelectedFecha(null);
            }
            
            if (partido.hora) {
                const horaFormateada = formatearHoraParaInput(partido.hora);
                setSelectedHora(horaFormateada);
            } else {
                setSelectedHora(null);
            }
            
            setPromiseResolvers(null);
            resetMutation();
        }
        // Solo ejecutar cuando isOpen cambia a true o cuando cambia el ID del partido
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, partido?.id_partido]);

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Actualizar partido"
            fields={fields}
            initialData={datosIniciales}
            onSubmit={handleSubmit}
            submitText="Actualizar partido"
            type="edit"
            validationSchema={actualizarPartidoSchema}
            onFieldChange={handleFieldChange}
        >
            {/* Zona seleccionada */}
            {selectedZona && zonaSeleccionada && (
                <div className="mb-4">
                    <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                        <h4 className="text-[var(--blue)] font-medium text-sm mb-1">
                            Información de la zona
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            Tipo: {zonaSeleccionada.tipoZona.nombre}
                        </p>
                        {esZonaTipo2 && (
                            <p className="text-[var(--green)] text-sm pt-1">
                                ✓ Disponible opción interzonal
                            </p>
                        )}
                        {permiteVentajaDeportiva && (
                            <p className="text-[var(--green)] text-sm pt-1">
                                ✓ Disponible ventaja deportiva
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Indicadores de carga */}
            {(loadingEquipos || loadingUsuarios || loadingZonas || loadingPredios || loadingCanchas) && (
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
            {selectedCancha && selectedFecha && selectedHora && (
                <>
                    {loadingDisponibilidad ? (
                        <div className="mb-4">
                            <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg p-3">
                                <div className="text-[var(--blue)] text-sm flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
                                    Verificando disponibilidad de cancha...
                                </div>
                            </div>
                        </div>
                    ) : disponibilidadCancha?.advertencia ? (
                        <div className="mb-4">
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                <h4 className="text-yellow-500 font-medium text-sm mb-1">
                                    ⚠️ Advertencia
                                </h4>
                                <p className="text-[var(--gray-100)] text-sm whitespace-pre-line">
                                    {disponibilidadCancha.advertencia}
                                </p>
                                {disponibilidadCancha.conflictos && disponibilidadCancha.conflictos.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-yellow-500/20">
                                        <p className="text-[var(--gray-100)] text-xs font-medium mb-1">
                                            Partidos conflictivos:
                                        </p>
                                        <ul className="text-[var(--gray-100)] text-xs space-y-1">
                                            {disponibilidadCancha.conflictos.map((conflicto) => (
                                                <li key={conflicto.id_partido}>
                                                    • Jornada {conflicto.jornada || 'N/A'}: {conflicto.equipos?.local || 'N/A'} vs {conflicto.equipos?.visita || 'N/A'} ({conflicto.hora_inicio} - {conflicto.hora_fin})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </>
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