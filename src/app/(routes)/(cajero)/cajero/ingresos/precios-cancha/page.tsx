'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { Button } from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import RadioButton from '@/app/components/ui/RadioButton';
import { FormModal } from '@/app/components/modals/ModalAdmin';
import type { FormField } from '@/app/components/modals/ModalAdmin';
import ConfirmActionModal from '@/app/components/modals/ConfirmActionModal';
import { 
    usePreciosPorEdicion, 
    useCrearPrecio,
    useEditarPrecio,
    useEliminarPrecio
} from '@/app/hooks/useConfiguracionPrecios';
import { useEdiciones } from '@/app/hooks/useEdiciones';
import { useCategoriasPorEdicion } from '@/app/hooks/useCategorias';
import { ConfiguracionPrecio, TipoConcepto, UnidadMedida, CrearPrecioInput, ActualizarPrecioInput } from '@/app/services/configuracionPrecio.services';
import PreciosCanchaTableSkeleton from '@/app/components/skeletons/PreciosCanchaTableSkeleton';
import { 
    DollarSign, 
    Plus, 
    Edit, 
    Trash2, 
    AlertCircle,
    Circle,
    Ticket,
    FileText,
    Trophy,
    Pill,
    Camera,
    Video,
    Wallet,
    User,
    FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Schema de validación
const precioSchema = z.object({
    tipo_concepto: z.enum(['CANCHA', 'INSCRIPCION', 'PLANILLERO', 'ARBITRO', 'MEDICO', 'FOTOGRAFO', 'VIDEOGRAFO', 'CAJERO', 'ENCARGADO', 'OTRO']),
    alcance: z.enum(['global', 'especifico']),
    id_categoria_edicion: z.number().optional().nullable(),
    unidad: z.enum(['POR_PARTIDO', 'POR_EQUIPO', 'POR_HORA', 'POR_DIA', 'POR_JORNADA']),
    monto: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
    fecha_desde: z.string().min(1, 'La fecha desde es requerida'),
    fecha_hasta: z.string().optional().nullable(),
    descripcion: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
}).refine((data) => {
    if (data.alcance === 'especifico') {
        return data.id_categoria_edicion !== null && data.id_categoria_edicion !== undefined;
    }
    return true;
}, {
    message: 'Debe seleccionar una categoría para precios específicos',
    path: ['id_categoria_edicion']
});

type PrecioFormData = z.infer<typeof precioSchema>;

export default function PreciosCanchaPage() {
    const [id_edicion, setIdEdicion] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [precioEditando, setPrecioEditando] = useState<ConfiguracionPrecio | null>(null);
    const [alcance, setAlcance] = useState<'global' | 'especifico'>('global');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [precioAEliminar, setPrecioAEliminar] = useState<number | null>(null);

    // Obtener ediciones
    const { data: ediciones } = useEdiciones('conCategorias');
    const edicionActiva = Array.isArray(ediciones) && ediciones.length > 0 ? ediciones[0] : undefined;

    // Obtener categorías de la edición seleccionada
    const { data: categoriasData } = useCategoriasPorEdicion(id_edicion || 0);

    // Establecer edición activa al cargar
    useEffect(() => {
        if (edicionActiva && !id_edicion) {
            setIdEdicion(edicionActiva.id_edicion);
        }
    }, [edicionActiva, id_edicion]);

    const { data: precios, isLoading, error, refetch } = usePreciosPorEdicion(id_edicion || 0, {
        activo: true
    });

    const crearPrecio = useCrearPrecio({
        onSuccess: (data) => {
            toast.success(`Precio creado exitosamente: ${data.tipo_concepto} - ${formatPrecio(Number(data.monto))}`, {
                duration: 4000,
            });
            refetch();
            setShowModal(false);
            setPrecioEditando(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear precio');
        }
    });

    const editarPrecio = useEditarPrecio({
        onSuccess: (data) => {
            toast.success(`Precio actualizado exitosamente: ${data.tipo_concepto} - ${formatPrecio(Number(data.monto))}`, {
                duration: 4000,
            });
            refetch();
            setShowModal(false);
            setPrecioEditando(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar precio');
        }
    });

    const eliminarPrecio = useEliminarPrecio({
        onSuccess: () => {
            toast.success('Precio desactivado exitosamente');
            refetch();
            setShowDeleteModal(false);
            setPrecioAEliminar(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al desactivar precio');
            setShowDeleteModal(false);
            setPrecioAEliminar(null);
        }
    });

    // Separar precios globales y por categoría
    const preciosGlobales = precios?.filter(p => p.id_categoria_edicion === null) || [];
    const preciosPorCategoria = precios?.filter(p => p.id_categoria_edicion !== null) || [];

    // Agrupar por categoría
    const preciosAgrupados = preciosPorCategoria.reduce((acc, precio) => {
        const categoriaId = precio.id_categoria_edicion!;
        if (!acc[categoriaId]) {
            acc[categoriaId] = [];
        }
        acc[categoriaId].push(precio);
        return acc;
    }, {} as Record<number, ConfiguracionPrecio[]>);

    const handleCrearPrecio = () => {
        setPrecioEditando(null);
        setAlcance('global');
        setShowModal(true);
    };

    const handleEditarPrecio = (precio: ConfiguracionPrecio) => {
        setPrecioEditando(precio);
        setAlcance(precio.id_categoria_edicion ? 'especifico' : 'global');
        setShowModal(true);
    };

    const handleEliminarPrecio = (id_config: number) => {
        setPrecioAEliminar(id_config);
        setShowDeleteModal(true);
    };

    const handleConfirmEliminar = async () => {
        if (precioAEliminar) {
            eliminarPrecio.mutate(precioAEliminar);
        }
    };

    const handleSubmit = async (data: Record<string, unknown>) => {
        if (!id_edicion) {
            toast.error('Debe seleccionar una edición');
            return;
        }

        // Usar el alcance del estado si no viene en los datos
        const alcanceFinal = data.alcance || alcance;

        const formData: PrecioFormData = {
            tipo_concepto: data.tipo_concepto as TipoConcepto,
            alcance: alcanceFinal as 'global' | 'especifico',
            id_categoria_edicion: alcanceFinal === 'especifico' ? Number(data.id_categoria_edicion) : null,
            unidad: data.unidad as UnidadMedida,
            monto: Number(data.monto),
            fecha_desde: String(data.fecha_desde),
            fecha_hasta: data.fecha_hasta ? String(data.fecha_hasta) : null,
            descripcion: data.descripcion ? String(data.descripcion) : null,
            observaciones: data.observaciones ? String(data.observaciones) : null,
        };

        if (precioEditando) {
            const precioDataUpdate: ActualizarPrecioInput = {
                monto: formData.monto,
                unidad: formData.unidad,
                fecha_desde: formData.fecha_desde,
                fecha_hasta: formData.fecha_hasta || undefined,
                descripcion: formData.descripcion || undefined,
                observaciones: formData.observaciones || undefined
            };
            await editarPrecio.mutateAsync({ id_config: precioEditando.id_config, data: precioDataUpdate });
        } else {
            const precioDataCreate: CrearPrecioInput = {
                id_edicion,
                id_categoria_edicion: formData.id_categoria_edicion,
                tipo_concepto: formData.tipo_concepto,
                unidad: formData.unidad,
                monto: formData.monto,
                fecha_desde: formData.fecha_desde,
                fecha_hasta: formData.fecha_hasta || undefined,
                descripcion: formData.descripcion || undefined,
                observaciones: formData.observaciones || undefined
            };
            await crearPrecio.mutateAsync(precioDataCreate);
        }
    };

    const formatPrecio = (precio: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(precio);
    };

    const getIconoTipo = (tipo: TipoConcepto): React.ReactNode => {
        const iconos: Record<TipoConcepto, React.ReactNode> = {
            CANCHA: <Circle className="w-5 h-5" />,
            INSCRIPCION: <Ticket className="w-5 h-5" />,
            PLANILLERO: <FileText className="w-5 h-5" />,
            ARBITRO: <Trophy className="w-5 h-5" />,
            MEDICO: <Pill className="w-5 h-5" />,
            FOTOGRAFO: <Camera className="w-5 h-5" />,
            VIDEOGRAFO: <Video className="w-5 h-5" />,
            CAJERO: <Wallet className="w-5 h-5" />,
            ENCARGADO: <User className="w-5 h-5" />,
            OTRO: <FileCheck className="w-5 h-5" />
        };
        return iconos[tipo] || <FileCheck className="w-5 h-5" />;
    };

    // Opciones de categorías
    const categoriasOptions = categoriasData?.map(cat => ({
        value: cat.id_categoria_edicion,
        label: `${cat.categoria?.division?.nombre || ''} - ${cat.categoria?.nombreCategoria?.nombre_categoria || ''}`
    })) || [];

    // Campos del formulario base
    const camposBase: FormField[] = [
        {
            name: 'tipo_concepto',
            label: 'Tipo de Concepto',
            type: 'select',
            required: true,
            options: [
                { value: 'CANCHA', label: 'Cancha' },
                { value: 'INSCRIPCION', label: 'Inscripción' },
                { value: 'PLANILLERO', label: 'Planillero' },
                { value: 'ARBITRO', label: 'Árbitro' },
                { value: 'MEDICO', label: 'Médico' },
                { value: 'FOTOGRAFO', label: 'Fotógrafo' },
                { value: 'VIDEOGRAFO', label: 'Videógrafo' },
                { value: 'CAJERO', label: 'Cajero' },
                { value: 'ENCARGADO', label: 'Encargado' },
                { value: 'OTRO', label: 'Otro' }
            ]
        },
        {
            name: 'unidad',
            label: 'Unidad',
            type: 'select',
            required: true,
            options: [
                { value: 'POR_PARTIDO', label: 'Por Partido' },
                { value: 'POR_EQUIPO', label: 'Por Equipo' },
                { value: 'POR_HORA', label: 'Por Hora' },
                { value: 'POR_DIA', label: 'Por Día' },
                { value: 'POR_JORNADA', label: 'Por Jornada' }
            ]
        },
        {
            name: 'monto',
            label: 'Monto',
            type: 'number',
            required: true,
            placeholder: '0.00'
        },
        {
            name: 'fecha_desde',
            label: 'Fecha Desde',
            type: 'date',
            required: true
        },
        {
            name: 'fecha_hasta',
            label: 'Fecha Hasta (opcional)',
            type: 'date',
            required: false
        },
        {
            name: 'descripcion',
            label: 'Descripción (opcional)',
            type: 'text',
            required: false,
            placeholder: 'Descripción del precio'
        },
        {
            name: 'observaciones',
            label: 'Observaciones (opcional)',
            type: 'textarea',
            required: false,
            placeholder: 'Observaciones adicionales'
        }
    ];

    // Agregar campo de categoría si el alcance es específico
    const campos: FormField[] = alcance === 'especifico' 
        ? [
            ...camposBase,
            {
                name: 'id_categoria_edicion',
                label: 'Categoría',
                type: 'select',
                required: true,
                options: categoriasOptions
            }
        ]
        : camposBase;

    const datosIniciales = precioEditando ? {
        tipo_concepto: precioEditando.tipo_concepto,
        alcance: precioEditando.id_categoria_edicion ? 'especifico' : 'global',
        id_categoria_edicion: precioEditando.id_categoria_edicion || '',
        unidad: precioEditando.unidad,
        monto: Number(precioEditando.monto),
        fecha_desde: precioEditando.fecha_desde ? new Date(precioEditando.fecha_desde).toISOString().split('T')[0] : '',
        fecha_hasta: precioEditando.fecha_hasta ? new Date(precioEditando.fecha_hasta).toISOString().split('T')[0] : '',
        descripcion: precioEditando.descripcion || '',
        observaciones: precioEditando.observaciones || ''
    } : {
        alcance: alcance
    };

    if (isLoading && !precios) {
        return (
            <div className="space-y-6">
                <PreciosCanchaTableSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error al cargar precios: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Configuración de precios"
                description="Gestiona los precios globales y por categoría"
                actions={
                    <div className="flex gap-2">
                        {ediciones && Array.isArray(ediciones) && ediciones.length > 0 ? (
                            <Select
                                value={id_edicion || ''}
                                onChange={(value) => setIdEdicion(Number(value))}
                                options={ediciones.map((e: { id_edicion: number; nombre: string; temporada?: { nombre: string } }) => ({
                                    value: e.id_edicion,
                                    label: `${e.nombre} - ${e.temporada?.nombre || ''}`
                                }))}
                                placeholder="Seleccionar edición"
                                className="w-64"
                            />
                        ) : null}
                        <Button
                            onClick={handleCrearPrecio}
                            variant="secondary"
                            disabled={!id_edicion}
                            className='flex items-center gap-2 w-full justify-center'
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo precio
                        </Button>
                    </div>
                }
            />

            {!id_edicion ? (
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Seleccione una edición</h3>
                    <p className="text-[var(--gray-100)]">
                        Por favor, seleccione una edición para ver los precios configurados
                    </p>
                </div>
            ) : (
                <>
                    {/* Precios Globales */}
                    {preciosGlobales.length > 0 && (
                        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Precios globales
                            </h2>
                            <div className="space-y-2">
                                {preciosGlobales.map((precio) => (
                                    <div
                                        key={precio.id_config}
                                        className="flex items-center justify-between p-4 bg-[var(--black-950)] rounded-lg border border-[var(--gray-300)]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-[var(--green)]">
                                                {getIconoTipo(precio.tipo_concepto)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{precio.tipo_concepto}</p>
                                                <p className="text-[var(--gray-100)] text-sm">
                                                    {precio.unidad} • {formatPrecio(Number(precio.monto))}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="import"
                                                size="sm"
                                                onClick={() => handleEditarPrecio(precio)}
                                                className="flex items-center gap-2 justify-center"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEliminarPrecio(precio.id_config)}
                                                className="flex items-center gap-2 justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Precios por Categoría */}
                    {Object.keys(preciosAgrupados).length > 0 && (
                        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Precios por categoría
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(preciosAgrupados).map(([categoriaId, preciosCat]) => {
                                    const categoria = preciosCat[0]?.categoriaEdicion;
                                    const nombreCategoria = categoria 
                                        ? `${categoria.categoria?.division?.nombre || ''} - ${categoria.categoria?.nombreCategoria?.nombre_categoria || ''}`
                                        : `Categoría ${categoriaId}`;
                                    
                                    return (
                                        <div key={categoriaId} className="space-y-2">
                                            <h3 className="text-lg font-medium text-white">{nombreCategoria}</h3>
                                            {preciosCat.map((precio) => (
                                                <div
                                                    key={precio.id_config}
                                                    className="flex items-center justify-between p-4 bg-[var(--black-950)] rounded-lg border border-[var(--gray-300)]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-[var(--green)]">
                                                            {getIconoTipo(precio.tipo_concepto)}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{precio.tipo_concepto}</p>
                                                            <p className="text-[var(--gray-100)] text-sm">
                                                                {precio.unidad} • {formatPrecio(Number(precio.monto))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleEditarPrecio(precio)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleEliminarPrecio(precio.id_config)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {preciosGlobales.length === 0 && Object.keys(preciosAgrupados).length === 0 && (
                        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-12 text-center">
                            <DollarSign className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No hay precios configurados</h3>
                            <p className="text-[var(--gray-100)] mb-4">
                                Comience creando un nuevo precio
                            </p>
                            <Button onClick={handleCrearPrecio} variant="secondary" className="flex items-center gap-2 justify-center mx-auto">
                                <Plus className="w-4 h-4 mr-2" />
                                Crear primer precio
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <FormModal
                    isOpen={showModal}
                    onClose={() => {
                        if (!crearPrecio.isPending && !editarPrecio.isPending) {
                            setShowModal(false);
                            setPrecioEditando(null);
                        }
                    }}
                    title={precioEditando ? 'Editar Precio' : 'Nuevo Precio'}
                    fields={campos}
                    initialData={datosIniciales}
                    onSubmit={handleSubmit}
                    submitText={precioEditando ? 'Actualizar' : 'Crear'}
                    type={precioEditando ? 'edit' : 'create'}
                    validationSchema={precioSchema}
                    onFieldChange={(name, value) => {
                        if (name === 'alcance') {
                            setAlcance(value as 'global' | 'especifico');
                        }
                    }}
                    isLoading={crearPrecio.isPending || editarPrecio.isPending}
                    autoClose={false}
                    key={alcance} // Forzar re-render cuando cambie el alcance
                >
                    {/* Campo de alcance con radio buttons */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                                Alcance <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-6">
                                <RadioButton
                                    name="alcance"
                                    value="global"
                                    checked={alcance === 'global'}
                                    onChange={() => {
                                        setAlcance('global');
                                        // Actualizar datos iniciales
                                        datosIniciales.alcance = 'global';
                                    }}
                                    label="Global (todas las categorías)"
                                />
                                <RadioButton
                                    name="alcance"
                                    value="especifico"
                                    checked={alcance === 'especifico'}
                                    onChange={() => {
                                        setAlcance('especifico');
                                        // Actualizar datos iniciales
                                        datosIniciales.alcance = 'especifico';
                                    }}
                                    label="Específico por categoría"
                                />
                            </div>
                        </div>
                        {/* Campo oculto para incluir alcance en el submit */}
                        <input type="hidden" name="alcance" value={alcance} />
                    </div>
                </FormModal>
            )}

            {/* Modal de Confirmación para Eliminar */}
            <ConfirmActionModal
                isOpen={showDeleteModal}
                onClose={() => {
                    if (!eliminarPrecio.isPending) {
                        setShowDeleteModal(false);
                        setPrecioAEliminar(null);
                    }
                }}
                onConfirm={handleConfirmEliminar}
                title="Desactivar precio"
                message="¿Está seguro de que desea desactivar este precio?"
                confirmText="Desactivar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={eliminarPrecio.isPending}
            />
        </div>
    );
}

