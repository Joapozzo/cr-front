'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
    Star,
    RefreshCcw
} from 'lucide-react';
import { DataTable } from '@/app/components/ui/DataTable';
import DreamTeamField from '@/app/components/CardDreamTeam';
import InstruccionesDreamTeam from '@/app/components/InstruccionesDreamTeam';
import GetPartidosColumns from '@/app/components/columns/PartidosColumns';
import ModalCrearPartido from '@/app/components/modals/ModalCrearPartido';
import ModalActualizarPartido from '@/app/components/modals/ModalActualizarPartido';
import { usePartidosPorJornadaYCategoria, useEliminarPartido } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useModals, DeleteModal } from "@/app/components/modals/ModalAdmin";
import toast from 'react-hot-toast';
import DescriptionModal from '@/app/components/modals/DescripcionPartidoModal';
import { Partido } from '@/app/types/partido';
import { useDreamteamCategoriaJornada, usePublicarDreamteam, useVaciarFormacionDreamteam } from '@/app/hooks/useDreamteam';
import DreamTeamSkeleton from '@/app/components/skeletons/DreamTeamSkeleton';

export default function FixtureDreamTeamPage() {
    const toastShownRef = useRef(false);

    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);
    const [jornadaActual, setJornadaActual] = useState(1);
    const [formacionActual, setFormacionActual] = useState<string>('1-2-3-1');

    const {
        data: partidosPorJornada,
        isLoading,
        isError,
        refetch
    } = usePartidosPorJornadaYCategoria(jornadaActual, idCategoriaEdicion);

    const {
        data: dreamteam,
        refetch: refetchDreamteam,
        isLoading: isLoadingDreamteam,
    } = useDreamteamCategoriaJornada(
        categoriaSeleccionada?.id_categoria_edicion || 0,
        jornadaActual,
        {
            enabled: !!categoriaSeleccionada
        }
    );
    const id_dreamteam = dreamteam?.id_dreamteam || 0;

    const {mutateAsync: publicarDreamteam, isPending: isPublicando} = usePublicarDreamteam({
        onSuccess: () => {
            refetchDreamteam();
            toast.success("Dreamteam publicado exitosamente");
        },
        onError: (error) => {
            toast.error(error.message || "Error al publicar dreamteam");
        }
    });

    const {mutateAsync: vaciarFormacion, isPending: isVaciando} = useVaciarFormacionDreamteam({
        onSuccess: () => {
            refetchDreamteam();
            toast.success("Formación vaciada exitosamente");
        },
        onError: (error) => {
            toast.error(error.message || "Error al vaciar la formación");
        }
    });

    const EstadosPermitidosActualizar = ['P', 'S', 'A'];

    const [vistaActual, setVistaActual] = useState<'fixture' | 'dreamteam'>('fixture');
    const [isRefetch, setIsRefetch] = useState(false);
    const [partidoAEliminar, setPartidoAEliminar] = useState<Partido | null>(null);
    const [partidoAEditar, setPartidoAEditar] = useState<Partido | null>(null);
    const [partidoDescripcion, setPartidoDescripcion] = useState<Partido | null>(null);

    // ✅ Estado para manejar resolvers como en crear partido
    const [promiseResolvers, setPromiseResolvers] = useState<{
        resolve: () => void;
        reject: (error: Error) => void;
    } | null>(null);

    const { modals, openModal, closeModal } = useModals();

    const {
        mutate: eliminarPartido,
        // isPending: isDeleting,
        error: deleteError,
        isSuccess: deleteSuccess,
        reset: resetDeleteMutation
    } = useEliminarPartido();

    // Función para manejar eliminar partido
    const handleEliminarPartido = (partido: Partido) => {
        setPartidoAEliminar(partido);
        openModal('delete');
    };

    const handleEditarPartido = (partido: Partido) => {
        if (!EstadosPermitidosActualizar.includes(partido.estado)) {
            toast.error("No se puede editar un partido que ya está comenzado, terminado o finalizado");
            return;
        }
        setPartidoAEditar(partido);
        openModal('edit');
    };

    const handleVerDescripcion = (partido: Partido) => {
        setPartidoDescripcion(partido);
        openModal('info');
    };

    const partidosColumns = GetPartidosColumns(handleEliminarPartido, handleEditarPartido, handleVerDescripcion);

    const confirmarEliminacion = async () => {
        if (partidoAEliminar) {
            return new Promise<void>((resolve, reject) => {
                setPromiseResolvers({ resolve, reject });

                // Ejecutar la mutación
                eliminarPartido(partidoAEliminar.id_partido);
            });
        }
    };

    // Usar datos reales de la API
    const totalJornadas = partidosPorJornada?.totalJornadas || 1;
    const jornadasDisponibles = Array.from({ length: totalJornadas }, (_, i) => i + 1);
    const indexActual = jornadasDisponibles.indexOf(jornadaActual);

    const cambiarJornada = (direccion: 'anterior' | 'siguiente') => {
        if (direccion === 'anterior' && indexActual > 0) {
            setJornadaActual(jornadasDisponibles[indexActual - 1]);
        } else if (direccion === 'siguiente' && indexActual < jornadasDisponibles.length - 1) {
            setJornadaActual(jornadasDisponibles[indexActual + 1]);
        }
    };

    const handlePartidoCreado = () => {
        handleRefresh();
    };

    const handlePartidoActualizado = () => {
        handleRefresh();
        closeModal('edit');
        setPartidoAEditar(null);
    };

    const handleRefresh = () => {
        setIsRefetch(true);
        refetch().finally(() => {
            setTimeout(() => {
                setIsRefetch(false);
            }, 500);
        });
    };

    useEffect(() => {
        if (deleteSuccess) {
            toast.success("Partido eliminado correctamente");
            closeModal('delete');
            setPartidoAEliminar(null);
            resetDeleteMutation();
            handleRefresh();

            // Resolver la promesa
            if (promiseResolvers) {
                promiseResolvers.resolve();
                setPromiseResolvers(null);
            }
        }
    }, [deleteSuccess, promiseResolvers]);

    useEffect(() => {
        if (deleteError && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error(deleteError.message || "Error al eliminar el partido");

            // Rechazar la promesa para que el modal pare el loading
            if (promiseResolvers) {
                promiseResolvers.reject(new Error(deleteError.message));
                setPromiseResolvers(null);
            }
        }
    }, [deleteError, promiseResolvers]);

    useEffect(() => {
        if (modals.delete) {
            resetDeleteMutation();
            setPromiseResolvers(null);
            toastShownRef.current = false;
        }
    }, [modals.delete, resetDeleteMutation]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Fixture / DreamTeam - {categoriaSeleccionada?.nombre_completo || 'Categoría no seleccionada'}
                </h1>
                <p className="text-[var(--gray-100)]">
                    Gestiona los partidos y arma el equipo ideal de cada fecha
                </p>
            </div>

            {/* Navegación de fechas */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => cambiarJornada("anterior")}
                        disabled={indexActual <= 0}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-[var(--white)] font-medium text-lg text-center">
                        Fecha {jornadaActual}
                    </span>
                    <Button
                        variant="ghost"
                        onClick={() => cambiarJornada("siguiente")}
                        disabled={indexActual >= jornadasDisponibles.length - 1}
                        className="flex items-end justify-end"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={vistaActual === "fixture" ? "more" : "default"}
                        onClick={() => setVistaActual("fixture")}
                        className="flex items-center gap-2"
                    >
                        <Calendar size={14} />
                        Fixture
                    </Button>
                    <Button
                        variant={vistaActual === "dreamteam" ? "more" : "default"}
                        onClick={() => setVistaActual("dreamteam")}
                        className="flex items-center gap-2"
                    >
                        <Star size={14} />
                        DreamTeam
                    </Button>
                </div>
            </div>

            {/* Acciones */}
            {vistaActual === "fixture" && (
                <div className="flex items-center gap-3">
                    <Button
                        variant="success"
                        onClick={() => openModal('create')}
                        className="flex items-center gap-2"
                        disabled={!categoriaSeleccionada}
                    >
                        <Plus className="w-4 h-4" />
                        Crear partido
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleRefresh}
                        className="flex items-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Actualizar
                    </Button>
                </div>
            )}

            {/* Mostrar mensaje si no hay categoría seleccionada */}
            {!categoriaSeleccionada && (
                <div className="bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg p-4">
                    <p className="text-[var(--import)] text-sm">
                        Selecciona una categoría para ver y gestionar los partidos.
                    </p>
                </div>
            )}

            {/* Contenido principal */}
            {vistaActual === "fixture" ? (
                <DataTable
                    data={partidosPorJornada?.partidos || []}
                    columns={partidosColumns}
                    emptyMessage="No se encontraron partidos para esta jornada."
                    isLoading={isLoading || isRefetch}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Campo de juego - 2/3 del espacio */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-[var(--gray-100)] text-sm mt-1">
                                    {categoriaSeleccionada?.nombre_completo || 'Categoría no seleccionada'}
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => publicarDreamteam({ id_dreamteam, formacion: formacionActual })}
                                    disabled={isPublicando || dreamteam?.publicado}
                                >
                                    {isPublicando ? "Publicando..." : dreamteam?.publicado ? "Publicado" : "Publicar"}
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => vaciarFormacion(id_dreamteam)}
                                    disabled={dreamteam?.publicado || isVaciando}
                                >
                                    {isVaciando ? "Vaciando..." : dreamteam?.publicado ? "Vaciar formación" : "Vaciar formación"}
                                </Button>
                            </div>
                        </div>
                        {isLoadingDreamteam ? (
                            <DreamTeamSkeleton />
                        ) : (
                            <DreamTeamField
                                jornada={jornadaActual}
                                dreamteam={dreamteam}
                                refetchDreamteam={refetchDreamteam}
                                onFormacionChange={setFormacionActual}
                            />
                        )}
                    </div>
                    {/* Instrucciones - 1/3 del espacio */}
                    <div className="lg:col-span-1">
                        <InstruccionesDreamTeam />
                    </div>
                </div>
            )}

            <ModalCrearPartido
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                jornada={jornadaActual}
                onSuccess={handlePartidoCreado}
            />

            <ModalActualizarPartido
                isOpen={modals.edit}
                onClose={() => {
                    closeModal('edit');
                    setPartidoAEditar(null);
                }}
                partido={partidoAEditar}
                onSuccess={handlePartidoActualizado}
            />

            <DeleteModal
                isOpen={modals.delete}
                onClose={() => {
                    resetDeleteMutation();
                    closeModal('delete');
                    setPartidoAEliminar(null);
                    setPromiseResolvers(null);
                    toastShownRef.current = false;
                }}
                title="Eliminar Partido"
                message="¿Estás seguro de que deseas eliminar este partido?"
                itemName={partidoAEliminar ?
                    `${partidoAEliminar.equipoLocal.nombre} vs ${partidoAEliminar.equipoVisita.nombre} - Fecha ${partidoAEliminar.jornada}`
                    : ''
                }
                onConfirm={confirmarEliminacion}
                error={deleteError}
            />

            <DescriptionModal
                isOpen={modals.info}
                onClose={() => {
                    closeModal('info');
                    setPartidoDescripcion(null);
                }}
                partido={partidoDescripcion}
            />

            {/* Mostrar errores de carga si existen */}
            {isError && (
                <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                    <p className="text-[var(--red)] text-sm">
                        Error al cargar los partidos. Intenta recargar la página.
                    </p>
                </div>
            )}
        </div>
    );
}