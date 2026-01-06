"use client";

import { Send, Search, Plus, Clock, AlertCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import ConfirmModal from "./modals/ConfirModal";
import { useBuscarEquiposEdicionDisponibles } from "../hooks/useEquipos";
import { Equipo } from "../types/equipo";
import { useEnviarSolicitudJugador, useObtenerSolicitudesJugador } from "../hooks/useSolicitudes";
import { useObtenerSolicitudesBajaPorJugador } from "../hooks/useSolicitudesBaja";
import { SolicitudEnviada } from "../types/solicitudes";
import toast from "react-hot-toast";
import { useDebounce } from "../hooks/useDebounce";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";
import UserAvatar from "./ui/UserAvatar";

interface SolicitudesProps {
    id_edicion: number | null;
    isLoading?: boolean;
    id_jugador: number;
}

const SearchInput = memo(({ onSearchChange }: { onSearchChange: (value: string) => void }) => {
    const [localValue, setLocalValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalValue(value);
        onSearchChange(value);
    };

    return (
        <Input
            placeholder="Buscar equipos por nombre (mín. 2 caracteres)..."
            value={localValue}
            onChange={handleChange}
            icon={<Search className="w-4 h-4" />}
        />
    );
});

SearchInput.displayName = 'SearchInput';

// Componente para renderizar cada solicitud con manejo de imagen
const SolicitudItemComponent = memo(({
    solicitud,
    diasPendiente,
    getEstadoColor,
    getEstadoTexto
}: {
    solicitud: SolicitudEnviada;
    diasPendiente: number;
    getEstadoColor: (estado: string) => string;
    getEstadoTexto: (estado: string) => string;
}) => {
    return (
        <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)]">
            <div className="flex items-start gap-3">
                {/* Imagen del jugador que envía la solicitud */}
                <UserAvatar
                    img={solicitud.img_jugador}
                    alt={solicitud.nombre_jugador || 'Jugador'}
                    size="sm"
                />

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-[var(--white)] font-medium text-sm">
                            {solicitud.tipo_solicitud === 'B' ? 'Solicitud de Baja' : solicitud.nombre_equipo}
                        </h5>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getEstadoColor(String(solicitud.estado))}`}>
                            {getEstadoTexto(String(solicitud.estado))}
                        </span>
                    </div>

                    {solicitud.tipo_solicitud === 'B' ? (
                        <>
                            <p className="text-[var(--gray-100)] text-sm">
                                Equipo: {solicitud.nombre_equipo}
                            </p>
                            <p className="text-[var(--gray-100)] text-sm">
                                {solicitud.nombre_categoria}
                            </p>
                            {solicitud.motivo && (
                                <div className="mt-2 p-2 bg-[var(--card-background)] rounded border border-[var(--gray-300)]">
                                    <p className="text-[var(--gray-100)] text-xs mb-1">Motivo:</p>
                                    <p className="text-[var(--white)] text-xs italic">
                                        &quot;{solicitud.motivo}&quot;
                                    </p>
                                </div>
                            )}
                            {solicitud.motivo_rechazo && (
                                <div className="mt-2 p-2 bg-[var(--color-secondary-500)]/10 rounded border border-[var(--color-secondary-500)]/30">
                                    <p className="text-[var(--color-secondary-400)] text-xs mb-1">Motivo de rechazo:</p>
                                    <p className="text-[var(--color-secondary-300)] text-xs italic">
                                        &quot;{solicitud.motivo_rechazo}&quot;
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-[var(--gray-100)] text-sm">
                                {solicitud.nombre_categoria}
                            </p>
                            {solicitud.edicion && (
                                <p className="text-[var(--gray-100)] text-xs">
                                    {solicitud.edicion}
                                </p>
                            )}
                            {solicitud.mensaje_jugador && (
                                <div className="mt-2 p-2 bg-[var(--card-background)] rounded border border-[var(--gray-300)]">
                                    <p className="text-[var(--gray-100)] text-xs mb-1">Tu mensaje:</p>
                                    <p className="text-[var(--white)] text-xs italic">
                                        &quot;{solicitud.mensaje_jugador}&quot;
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    <p className="text-[var(--gray-100)] text-xs">
                        Enviada {diasPendiente === 0 ? 'hoy' : `hace ${diasPendiente} día${diasPendiente > 1 ? 's' : ''}`}
                    </p>

                    {solicitud.respondido_por_username && (
                        <p className="text-[var(--gray-100)] text-xs mt-1">
                            Respondida por: <span className="text-[var(--white)] font-medium">{solicitud.respondido_por_username}</span>
                        </p>
                    )}

                    {solicitud.agregado_por && solicitud.estado === 'A' && solicitud.tipo_solicitud !== 'B' && (
                        <p className="text-[var(--gray-100)] text-xs mt-1">
                            Agregado por: <span className="text-[var(--white)] font-medium">{solicitud.agregado_por}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

SolicitudItemComponent.displayName = 'SolicitudItemComponent';

const Solicitudes: React.FC<SolicitudesProps> = ({
    id_edicion,
    id_jugador,
    isLoading = false
}) => {
    // const { jugador } = usePlayerStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
    const [showSolicitudModal, setShowSolicitudModal] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: solicitudes, isLoading: isSolicitudesLoading } = useObtenerSolicitudesJugador(id_jugador);
    const { data: solicitudesBaja, isLoading: isSolicitudesBajaLoading } = useObtenerSolicitudesBajaPorJugador(id_jugador);

    // Combinar solicitudes de equipo y solicitudes de baja
    const solicitudesEquipo: SolicitudEnviada[] = solicitudes?.data?.filter((s: SolicitudEnviada) => s.tipo_solicitud === 'J') || [];

    // Convertir solicitudes de baja al formato SolicitudEnviada
    const solicitudesBajaFormateadas: SolicitudEnviada[] = solicitudesBaja?.data?.map((sb: {
        id_solicitud: number;
        id_jugador: number;
        nombre_jugador: string;
        img_jugador?: string | null;
        id_equipo: number;
        nombre_equipo: string;
        img_equipo?: string | null;
        nombre_categoria: string;
        id_categoria_edicion: number;
        edicion?: string;
        estado: string;
        motivo?: string | null;
        observaciones?: string | null;
        motivo_rechazo?: string | null;
        fecha_solicitud: string;
        fecha_respuesta?: string | null;
        respondido_por?: string | null;
    }) => ({
        id_solicitud: sb.id_solicitud,
        id_jugador: sb.id_jugador,
        nombre_jugador: sb.nombre_jugador,
        img_jugador: sb.img_jugador,
        id_equipo: sb.id_equipo,
        nombre_equipo: sb.nombre_equipo,
        img_equipo: sb.img_equipo,
        nombre_categoria: sb.nombre_categoria,
        id_categoria_edicion: sb.id_categoria_edicion,
        edicion: sb.edicion,
        estado: sb.estado as 'P' | 'A' | 'R',
        tipo_solicitud: 'B' as const,
        motivo: sb.motivo || undefined,
        observaciones: sb.observaciones || undefined,
        motivo_rechazo: sb.motivo_rechazo || null,
        fecha_solicitud: sb.fecha_solicitud,
        fecha_respuesta: sb.fecha_respuesta || null,
        respondido_por_username: sb.respondido_por || null
    })) || [];

    const solicitudesEnviadas: SolicitudEnviada[] = [...solicitudesEquipo, ...solicitudesBajaFormateadas].sort(
        (a, b) => new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime()
    );

    const { mutate: enviarSolicitud, isPending: isEnviandoSolicitud } = useEnviarSolicitudJugador();

    // Solo buscar equipos si tenemos id_edicion válido
    const { data, isLoading: isSearching } = useBuscarEquiposEdicionDisponibles(
        debouncedSearchTerm,
        id_edicion || 0, // Pasar 0 como fallback para deshabilitar la query
        10,
        {
            enabled: !!id_edicion && debouncedSearchTerm.trim().length >= 2
        }
    );

    const equiposEncontrados = data?.equipos || [];

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);


    const handleSolicitar = (equipo: Equipo) => {
        setEquipoSeleccionado(equipo);
        setShowSolicitudModal(true);
    };

    const confirmarSolicitud = (mensaje?: string) => {
        if (!equipoSeleccionado || !id_jugador) return;

        // Obtener id_categoria_edicion del equipo seleccionado
        // Si el equipo tiene múltiples categorías, usar la primera
        const id_categoria_edicion = equipoSeleccionado.categorias && equipoSeleccionado.categorias.length > 0
            ? equipoSeleccionado.categorias[0].id_categoria_edicion
            : null;

        if (!id_categoria_edicion) {
            toast.error('No se pudo determinar la categoría del equipo. Por favor, intenta nuevamente.');
            return;
        }

        enviarSolicitud({
            id_jugador,
            id_equipo: equipoSeleccionado.id_equipo,
            id_categoria_edicion,
            mensaje_jugador: mensaje
        }, {
            onSuccess: (data) => {
                setShowSolicitudModal(false);
                setEquipoSeleccionado(null);
                setSearchTerm('');
                // Usar el mensaje del backend si está disponible, sino uno por defecto
                const mensajeExito = (typeof data === 'object' && data !== null && 'message' in data &&
                    typeof (data as { message?: string }).message === 'string')
                    ? (data as { message: string }).message
                    : 'Solicitud enviada exitosamente';
                toast.success(mensajeExito);
            },
            onError: (error: unknown) => {
                // Extraer el mensaje de error de diferentes formas posibles
                const errorMessage =
                    (error instanceof Error && error.message) ||
                    (typeof error === 'object' && error !== null && 'response' in error &&
                        typeof (error as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                        ? (error as { response: { data: { error: string } } }).response.data.error : null) ||
                    (typeof error === 'object' && error !== null && 'error' in error &&
                        typeof (error as { error?: string }).error === 'string'
                        ? (error as { error: string }).error : null) ||
                    'Error al enviar la solicitud';
                toast.error(errorMessage);
                console.error('Error al enviar solicitud:', error);
            }
        });
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'A':
            case 'aceptada':
                return 'text-[var(--color-primary-400)] bg-[var(--color-primary-500)]/20 border-[var(--color-primary-500)]/30';
            case 'R':
            case 'rechazada':
                return 'text-[var(--color-secondary-400)] bg-[var(--color-secondary-500)]/20 border-[var(--color-secondary-500)]/30';
            default:
                return 'text-[var(--orange-400)] bg-[var(--orange-500)]/20 border-[var(--orange-500)]/30';
        }
    };

    const getEstadoTexto = (estado: string) => {
        switch (estado) {
            case 'A':
            case 'aceptada':
                return 'Aceptada';
            case 'R':
            case 'rechazada':
                return 'Rechazada';
            case 'P':
                return 'Pendiente';
            default:
                return 'Pendiente';
        }
    };

    if (isSolicitudesLoading || isSolicitudesBajaLoading) {
        return <SolicitudesSkeleton />;
    }

    return (
        <>
            <div className="rounded-2xl border border-[var(--gray-300)]">
                {/* Header */}
                <div className="flex items-center gap-2 bg-[var(--black-900)] p-3 sm:p-4 rounded-t-2xl">
                    <Send className="text-[var(--color-primary)]" size={16} />
                    <h3 className="text-[var(--white)] font-bold text-sm">Enviar solicitudes</h3>
                </div>

                <div className="space-y-4 p-3 sm:p-4">
                    {/* Búsqueda de equipos */}
                    <div className="">
                        {!id_edicion ? (
                            <div className="text-center py-8 border border-[var(--gray-300)] rounded-lg bg-[var(--background)]">
                                <AlertCircle className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                                <h4 className="text-[var(--white)] font-semibold text-lg mb-2">
                                    No hay ediciones activas disponibles
                                </h4>
                                <p className="text-[var(--gray-100)] text-sm">
                                    No hay ediciones activas en este momento. Por favor, intenta más tarde.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2 flex-col">
                                    <SearchInput onSearchChange={handleSearchChange} />
                                    {isSearching && (
                                        <span className="text-[var(--gray-100)] text-sm self-center mt-3">
                                            Buscando...
                                        </span>
                                    )}
                                </div>

                                {/* Resultados de búsqueda */}
                                {equiposEncontrados.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[var(--gray-100)] text-sm mt-3">
                                            Se encontraron {equiposEncontrados.length} equipo(s):
                                        </p>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {equiposEncontrados.map((equipo) => (
                                                <div
                                                    key={equipo.id_equipo}
                                                    className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar
                                                            img={equipo.img}
                                                            alt={equipo.nombre}
                                                            size="md"
                                                        />
                                                        <div>
                                                            <p className="text-[var(--white)] font-medium">
                                                                {equipo.nombre}
                                                            </p>
                                                            {equipo.categorias && equipo.categorias.length > 0 && (
                                                                <p className="text-[var(--gray-100)] text-xs mt-0.5">
                                                                    {equipo.categorias[0].nombre_completo}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleSolicitar(equipo)}
                                                        variant="footer"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                        disabled={isLoading}
                                                    >
                                                        <Plus size={14} />
                                                        Solicitar
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mensaje si no hay resultados */}
                                {searchTerm.trim().length >= 2 && equiposEncontrados.length === 0 && !isSearching && (
                                    <div className="text-center py-4">
                                        <AlertCircle className="w-8 h-8 text-[var(--gray-100)] mx-auto mb-2" />
                                        <p className="text-[var(--gray-100)] text-sm">
                                            No se encontraron equipos disponibles con ese nombre
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Solicitudes enviadas - SIN CAMBIOS */}
                    {solicitudesEnviadas.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pt-4 border-t border-[var(--gray-300)]">
                                <Clock className="text-[var(--gray-100)]" size={16} />
                                <h4 className="text-[var(--white)] font-semibold">Solicitudes enviadas</h4>
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {solicitudesEnviadas.map((solicitud: SolicitudEnviada) => {
                                    const diasPendiente = Math.floor(
                                        (new Date().getTime() - new Date(solicitud.fecha_solicitud).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <SolicitudItemComponent
                                            key={solicitud.id_solicitud}
                                            solicitud={solicitud}
                                            diasPendiente={diasPendiente}
                                            getEstadoColor={getEstadoColor}
                                            getEstadoTexto={getEstadoTexto}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Mensaje si no hay solicitudes enviadas - SIN CAMBIOS */}
                    {solicitudesEnviadas.length === 0 && (
                        <div className="text-center py-8 border-t border-[var(--gray-300)]">
                            <Send className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                            <h4 className="text-[var(--white)] font-semibold text-lg mb-2">
                                Sin solicitudes enviadas
                            </h4>
                            <p className="text-[var(--gray-100)] text-sm">
                                Busca equipos y envía tu primera solicitud
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showSolicitudModal}
                onClose={() => setShowSolicitudModal(false)}
                onConfirm={confirmarSolicitud}
                title="Enviar solicitud"
                description="¿Estás seguro que quieres enviar una solicitud a este equipo?"
                confirmText="Enviar solicitud"
                variant="success"
                icon={<Send className="w-5 h-5" />}
                isLoading={isEnviandoSolicitud}
                showTextarea={true}
                textareaPlaceholder="Escribe un mensaje para el capitán del equipo..."
                textareaLabel="Mensaje opcional"
            >
                {equipoSeleccionado && (
                    <div className="text-left space-y-2">
                        <p className="text-[var(--gray-100)] text-sm">
                            Equipo: <span className="text-[var(--color-primary)] font-medium">
                                {equipoSeleccionado.nombre}
                            </span>
                        </p>
                    </div>
                )}
            </ConfirmModal>
        </>
    );
};

export default Solicitudes;