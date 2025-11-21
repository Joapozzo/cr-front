'use client';

import { useState, useMemo } from 'react';
import { Plus, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { FormModal, useModals, FormField, FormDataValue } from '@/app/components/modals/ModalAdmin';
import { usePredios, useCrearPredio, useActualizarPredio, useEliminarPredio } from '@/app/hooks/usePredios';
import { useCrearCancha, useActualizarCancha, useEliminarCancha } from '@/app/hooks/usePredios';
import PredioAccordion from '@/app/components/predios/PredioAccordion';
import CardCanchaSkeleton from '@/app/components/skeletons/CardCanchaSkeleton';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PredioConCanchas, CanchaConPredio, CrearPredioInput, ActualizarPredioInput, CrearCanchaInput, ActualizarCanchaInput } from '@/app/types/predios';
import { crearPredioSchema, actualizarPredioSchema, crearCanchaSchema, actualizarCanchaSchema } from '@/app/schemas/predios.schema';
import toast from 'react-hot-toast';
import { DeleteModal } from '@/app/components/modals/ModalAdmin';
import { DateInput } from '@/app/components/ui/Input';

const PrediosPage = () => {
    const { modals, openModal, closeModal } = useModals();
    
    // Estados para modales
    const [predioSeleccionado, setPredioSeleccionado] = useState<PredioConCanchas | null>(null);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState<CanchaConPredio | null>(null);
    
    // Fecha para visualizar ocupación (por defecto hoy)
    const [fechaVisualizacion, setFechaVisualizacion] = useState<string>(() => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    });

    // Queries
    const { data: predios = [], isLoading, isRefetching, refetch } = usePredios(false);
    const { mutate: crearPredio } = useCrearPredio();
    const { mutate: actualizarPredio } = useActualizarPredio();
    const { mutate: eliminarPredio } = useEliminarPredio();
    const { mutate: crearCancha } = useCrearCancha();
    const { mutate: actualizarCancha } = useActualizarCancha();
    const { mutate: eliminarCancha } = useEliminarCancha();


    // Obtener partidos por cancha y fecha
    type PartidoOcupado = {
        id_partido: number;
        hora: string;
        dia: string | Date;
        equipoLocal?: {
            nombre: string;
            img?: string | null;
        };
        equipoVisita?: {
            nombre: string;
            img?: string | null;
        };
        estado: string;
        goles_local?: number | null;
        goles_visita?: number | null;
    };

    const partidosPorCancha = useMemo(() => {
        const map = new Map<number, PartidoOcupado[]>();
        // Los partidos se obtendrán mediante el hook usePartidosPorCancha
        // Por ahora lo dejamos vacío y se poblará con los datos de los hooks
        return map;
    }, []);

    // Obtener partidos para cada cancha (haremos esto de forma optimizada)
    // Por ahora, vamos a obtenerlos del detalle de cancha cuando se expanda

    // ============ HANDLERS PARA PREDIOS ============

    const handleCrearPredio = async (data: Record<string, FormDataValue>): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Siempre crear como activo
            const predioData: CrearPredioInput = {
                nombre: String(data.nombre || ''),
                direccion: data.direccion ? String(data.direccion) : null,
                descripcion: data.descripcion ? String(data.descripcion) : null,
                estado: 'A'
            };
            crearPredio(predioData, {
                onSuccess: () => {
                    toast.success('Predio creado exitosamente');
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al crear el predio');
                    reject(error);
                }
            });
        });
    };

    const handleActualizarPredio = async (data: Record<string, FormDataValue>): Promise<void> => {
        if (!predioSeleccionado) return Promise.reject(new Error('No hay predio seleccionado'));

        return new Promise((resolve, reject) => {
            const predioData: ActualizarPredioInput = {
                nombre: data.nombre ? String(data.nombre) : undefined,
                direccion: data.direccion !== undefined ? (data.direccion ? String(data.direccion) : null) : undefined,
                descripcion: data.descripcion !== undefined ? (data.descripcion ? String(data.descripcion) : null) : undefined,
                estado: data.estado ? (data.estado as 'A' | 'I') : undefined
            };
            actualizarPredio({
                id_predio: predioSeleccionado.id_predio,
                data: predioData
            }, {
                onSuccess: () => {
                    toast.success('Predio actualizado exitosamente');
                    setPredioSeleccionado(null);
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al actualizar el predio');
                    reject(error);
                }
            });
        });
    };

    const handleEliminarPredio = async (): Promise<void> => {
        if (!predioSeleccionado) return Promise.reject(new Error('No hay predio seleccionado'));

        return new Promise((resolve, reject) => {
            eliminarPredio(predioSeleccionado.id_predio, {
                onSuccess: () => {
                    toast.success('Predio eliminado exitosamente');
                    setPredioSeleccionado(null);
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al eliminar el predio');
                    reject(error);
                }
            });
        });
    };

    // ============ HANDLERS PARA CANCHAS ============

    const handleCrearCancha = async (data: Record<string, FormDataValue>): Promise<void> => {
        if (!predioSeleccionado) return Promise.reject(new Error('No hay predio seleccionado'));

        return new Promise((resolve, reject) => {
            const canchaData: CrearCanchaInput = {
                id_predio: predioSeleccionado.id_predio,
                nombre: String(data.nombre || ''),
                tipo_futbol: data.tipo_futbol ? Number(data.tipo_futbol) : undefined,
                estado: data.estado ? (data.estado as 'A' | 'I') : 'A'
            };
            crearCancha(canchaData, {
                onSuccess: () => {
                    toast.success('Cancha creada exitosamente');
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al crear la cancha');
                    reject(error);
                }
            });
        });
    };

    const handleActualizarCancha = async (data: Record<string, FormDataValue>): Promise<void> => {
        if (!canchaSeleccionada) return Promise.reject(new Error('No hay cancha seleccionada'));

        return new Promise((resolve, reject) => {
            const canchaData: ActualizarCanchaInput = {
                id_predio: data.id_predio ? Number(data.id_predio) : undefined,
                nombre: data.nombre ? String(data.nombre) : undefined,
                tipo_futbol: data.tipo_futbol ? Number(data.tipo_futbol) : undefined,
                estado: data.estado ? (data.estado as 'A' | 'I') : undefined
            };
            actualizarCancha({
                id_cancha: canchaSeleccionada.id_cancha,
                data: canchaData
            }, {
                onSuccess: () => {
                    toast.success('Cancha actualizada exitosamente');
                    setCanchaSeleccionada(null);
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al actualizar la cancha');
                    reject(error);
                }
            });
        });
    };

    const handleEliminarCancha = async (): Promise<void> => {
        if (!canchaSeleccionada) return Promise.reject(new Error('No hay cancha seleccionada'));

        return new Promise((resolve, reject) => {
            eliminarCancha(canchaSeleccionada.id_cancha, {
                onSuccess: () => {
                    toast.success('Cancha eliminada exitosamente');
                    setCanchaSeleccionada(null);
                    refetch();
                    resolve();
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al eliminar la cancha');
                    reject(error);
                }
            });
        });
    };

    // ============ CAMPOS DE FORMULARIOS ============

    const predioFields: FormField[] = [
        {
            name: 'nombre',
            label: 'Nombre del Predio',
            type: 'text',
            placeholder: 'Ej: Predio Central',
            required: true
        },
        {
            name: 'direccion',
            label: 'Dirección (Link de Google Maps)',
            type: 'text',
            placeholder: 'https://maps.google.com/... o Av. Principal 123',
            required: false
        },
        {
            name: 'descripcion',
            label: 'Descripción',
            type: 'textarea',
            placeholder: 'Descripción del predio...',
            required: false
        }
    ];

    const canchaFields: FormField[] = [
        {
            name: 'nombre',
            label: 'Nombre de la Cancha',
            type: 'text',
            placeholder: 'Ej: Cancha 1',
            required: true
        },
        {
            name: 'tipo_futbol',
            label: 'Tipo de Fútbol',
            type: 'select',
            required: false,
            options: [
                { value: 5, label: 'Fútbol 5' },
                { value: 7, label: 'Fútbol 7' },
                { value: 8, label: 'Fútbol 8' },
                { value: 11, label: 'Fútbol 11' }
            ]
        },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            required: false,
            options: [
                { value: 'A', label: 'Activo' },
                { value: 'I', label: 'Inactivo' }
            ]
        }
    ];

    const canchaFieldsConPredio: FormField[] = [
        ...canchaFields,
        {
            name: 'id_predio',
            label: 'Predio',
            type: 'select',
            required: true,
            options: predios
                .filter(p => p.estado === 'A')
                .map(p => ({ value: p.id_predio.toString(), label: p.nombre }))
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--white)] mb-1">
                        Gestión de predios y canchas
                    </h1>
                    <p className="text-[var(--gray-100)] text-sm">
                        Administra los predios y canchas disponibles para los partidos
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <DateInput
                        value={fechaVisualizacion}
                        onChange={(e) => setFechaVisualizacion(e.target.value)}
                        className="bg-[var(--gray-300)] border-[var(--gray-200)] text-[var(--white)] w-auto min-w-[160px] min-h-[50px]"
                        fullWidth={false}
                    />
                    <Button
                        variant="default"
                        size="sm"
                        onClick={async () => {
                            try {
                                await refetch();
                                toast.success('Datos actualizados');
                            } catch {
                                toast.error('Error al actualizar los datos');
                            }
                        }}
                        disabled={isLoading || isRefetching}
                        className="flex items-center gap-2 min-h-[50px]"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading || isRefetching ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button
                        onClick={() => {
                            setPredioSeleccionado(null);
                            openModal('create');
                        }}
                        variant="success"
                        className="flex items-center gap-2 min-h-[50px]"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Predio
                    </Button>
                </div>
            </div>

            {/* Lista de Predios */}
            {isLoading && predios.length === 0 ? (
                // Mostrar skeletons de canchas cuando está cargando inicialmente
                <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-xl overflow-hidden p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton circle width={40} height={40} />
                            <div className="flex-1">
                                <Skeleton width={200} height={20} borderRadius={6} className="mb-2" />
                                <Skeleton width={150} height={14} borderRadius={6} />
                            </div>
                        </div>
                    </SkeletonTheme>
                    <h3 className="text-sm font-semibold text-[var(--gray-100)] mb-4">
                        Canchas Activas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CardCanchaSkeleton />
                        <CardCanchaSkeleton />
                        <CardCanchaSkeleton />
                    </div>
                </div>
            ) : predios.length === 0 ? (
                <div className="text-center py-12 bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg">
                    <MapPin className="w-16 h-16 mx-auto text-[var(--gray-200)] mb-4" />
                    <p className="text-[var(--gray-100)] text-lg mb-4">
                        No hay predios registrados
                    </p>
                    <Button
                        onClick={() => {
                            setPredioSeleccionado(null);
                            openModal('create');
                        }}
                        variant="success"
                        className="flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Crear primer predio
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {predios.map((predio) => (
                        <PredioAccordion
                            key={predio.id_predio}
                            predio={predio}
                            partidosPorCancha={partidosPorCancha}
                            fechaVisualizacion={fechaVisualizacion}
                            onEditPredio={(p) => {
                                setPredioSeleccionado(p);
                                openModal('edit');
                            }}
                            onDeletePredio={(p) => {
                                setPredioSeleccionado(p);
                                openModal('delete');
                            }}
                            onCreateCancha={(p) => {
                                setPredioSeleccionado(p);
                                openModal('createCancha');
                            }}
                            onEditCancha={(cancha) => {
                                setCanchaSeleccionada(cancha);
                                openModal('editCancha');
                            }}
                            onDeleteCancha={(cancha) => {
                                setCanchaSeleccionada(cancha);
                                openModal('deleteCancha');
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ============ MODALES ============ */}

            {/* Modal Crear Predio */}
            <FormModal
                isOpen={modals.create}
                onClose={() => {
                    closeModal('create');
                    setPredioSeleccionado(null);
                }}
                title="Crear Predio"
                fields={predioFields}
                onSubmit={handleCrearPredio}
                type="create"
                validationSchema={crearPredioSchema}
            />

            {/* Modal Editar Predio */}
            <FormModal
                isOpen={modals.edit}
                onClose={() => {
                    closeModal('edit');
                    setPredioSeleccionado(null);
                }}
                title="Editar Predio"
                fields={predioFields}
                initialData={{
                    nombre: predioSeleccionado?.nombre || '',
                    direccion: predioSeleccionado?.direccion || '',
                    descripcion: predioSeleccionado?.descripcion || '',
                    estado: predioSeleccionado?.estado || 'A'
                }}
                onSubmit={handleActualizarPredio}
                type="edit"
                validationSchema={actualizarPredioSchema}
            />

            {/* Modal Eliminar Predio */}
            <DeleteModal
                isOpen={modals.delete}
                onClose={() => {
                    closeModal('delete');
                    setPredioSeleccionado(null);
                }}
                title="Eliminar Predio"
                message="¿Estás seguro de que deseas eliminar este predio?"
                itemName={predioSeleccionado?.nombre || ''}
                onConfirm={handleEliminarPredio}
                error={null}
            />

            {/* Modal Crear Cancha */}
            <FormModal
                isOpen={modals.createCancha}
                onClose={() => {
                    closeModal('createCancha');
                    setPredioSeleccionado(null);
                }}
                title={`Crear Cancha - ${predioSeleccionado?.nombre || ''}`}
                fields={canchaFields}
                initialData={{
                    id_predio: predioSeleccionado?.id_predio || 0,
                    tipo_futbol: 11,
                    estado: 'A'
                }}
                onSubmit={handleCrearCancha}
                type="create"
                validationSchema={crearCanchaSchema}
            />

            {/* Modal Editar Cancha */}
            <FormModal
                isOpen={modals.editCancha}
                onClose={() => {
                    closeModal('editCancha');
                    setCanchaSeleccionada(null);
                }}
                title="Editar Cancha"
                fields={canchaFieldsConPredio}
                initialData={{
                    nombre: canchaSeleccionada?.nombre || '',
                    id_predio: canchaSeleccionada?.id_predio || '',
                    estado: canchaSeleccionada?.estado || 'A'
                }}
                onSubmit={handleActualizarCancha}
                type="edit"
                validationSchema={actualizarCanchaSchema}
            />

            {/* Modal Eliminar Cancha */}
            <DeleteModal
                isOpen={modals.deleteCancha}
                onClose={() => {
                    closeModal('deleteCancha');
                    setCanchaSeleccionada(null);
                }}
                title="Eliminar Cancha"
                message="¿Estás seguro de que deseas eliminar esta cancha?"
                itemName={canchaSeleccionada?.nombre || ''}
                onConfirm={handleEliminarCancha}
                error={null}
            />
        </div>
    );
};

export default PrediosPage;
