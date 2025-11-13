"use client";

import { Send, Search, Plus, Clock, User, AlertCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import ConfirmModal from "./modals/ConfirModal";
import { useBuscarEquiposEdicionDisponibles } from "../hooks/useEquipos";
import { Equipo } from "../types/equipo";
import { useEnviarSolicitudJugador, useObtenerSolicitudesJugador } from "../hooks/useSolicitudes";
import toast from "react-hot-toast";
import { useDebounce } from "../hooks/useDebounce";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";
// import { usePlayerStore } from "../stores/playerStore";

interface SolicitudesProps {
    id_edicion: number;
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

const Solicitudes: React.FC<SolicitudesProps> = ({
    id_edicion = 10,
    id_jugador,
    isLoading = false
}) => {
    // const { jugador } = usePlayerStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
    const [showSolicitudModal, setShowSolicitudModal] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: solicitudes, isLoading: isSolicitudesLoading } = useObtenerSolicitudesJugador(id_jugador);

    const solicitudesEnviadas = solicitudes?.filter(s => s.tipo_solicitud === 'J') || [];

    const { mutate: enviarSolicitud, isPending: isEnviandoSolicitud } = useEnviarSolicitudJugador();

    const { data, isLoading: isSearching } = useBuscarEquiposEdicionDisponibles(
        debouncedSearchTerm,
        id_edicion,
        10
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

        enviarSolicitud({
            id_jugador,
            id_equipo: equipoSeleccionado.id_equipo,
            id_categoria_edicion: equipoSeleccionado.categorias?.[0]?.id_categoria_edicion || 0,
            mensaje_jugador: mensaje
        }, {
            onSuccess: () => {
                setShowSolicitudModal(false);
                setEquipoSeleccionado(null);
                setSearchTerm('');
                toast.success('Solicitud enviada exitosamente');
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'aceptada':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'rechazada':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        }
    };

    const getEstadoTexto = (estado: string) => {
        switch (estado) {
            case 'aceptada':
                return 'Aceptada';
            case 'rechazada':
                return 'Rechazada';
            default:
                return 'Pendiente';
        }
    };

    if (isSolicitudesLoading) {
        return <SolicitudesSkeleton />;
    }

    return (
        <>
            <div className="rounded-2xl border border-[var(--gray-300)]">
                {/* Header */}
                <div className="flex items-center gap-2 bg-[var(--black-900)] p-4 rounded-t-2xl">
                    <Send className="text-[var(--green)]" size={16} />
                    <h3 className="text-[var(--white)] font-bold text-sm">Enviar Solicitudes</h3>
                </div>

                <div className="space-y-4 p-4">
                    {/* Búsqueda de equipos */}
                    <div className="">
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
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                                    {equipo.img ? (
                                                        <img
                                                            src={equipo.img}
                                                            alt={equipo.nombre}
                                                            className="w-8 h-8 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <User className="text-[var(--gray-100)]" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[var(--white)] font-medium">
                                                        {equipo.nombre}
                                                    </p>
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
                    </div>

                    {/* Solicitudes enviadas - SIN CAMBIOS */}
                    {solicitudesEnviadas.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pt-4 border-t border-[var(--gray-300)]">
                                <Clock className="text-[var(--gray-100)]" size={16} />
                                <h4 className="text-[var(--white)] font-semibold">Solicitudes Enviadas</h4>
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {solicitudesEnviadas.map((solicitud) => {
                                    const diasPendiente = Math.floor(
                                        (new Date().getTime() - new Date(solicitud.fecha_solicitud).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <div
                                            key={solicitud.id_solicitud}
                                            className="p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                                    {solicitud.img_equipo ? (
                                                        <img
                                                            src={solicitud.img_equipo}
                                                            alt={solicitud.nombre_equipo}
                                                            className="w-6 h-6 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <User className="text-[var(--gray-100)]" size={16} />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="text-[var(--white)] font-medium text-sm">
                                                            {solicitud.nombre_equipo}
                                                        </h5>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getEstadoColor(solicitud.estado)}`}>
                                                            {getEstadoTexto(solicitud.estado)}
                                                        </span>
                                                    </div>

                                                    <p className="text-[var(--gray-100)] text-sm">
                                                        {solicitud.nombre_categoria}
                                                    </p>
                                                    <p className="text-[var(--gray-100)] text-xs">
                                                        Enviada hace {diasPendiente === 0 ? 'hoy' : `${diasPendiente} día${diasPendiente > 1 ? 's' : ''}`}
                                                    </p>

                                                    {solicitud.mensaje_jugador && (
                                                        <div className="mt-2 p-2 bg-[var(--card-background)] rounded border border-[var(--gray-300)]">
                                                            <p className="text-[var(--gray-100)] text-xs mb-1">Tu mensaje:</p>
                                                            <p className="text-[var(--white)] text-xs italic">
                                                                "{solicitud.mensaje_jugador}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
                title="Enviar Solicitud"
                description="¿Estás seguro que quieres enviar una solicitud a este equipo?"
                confirmText="Enviar Solicitud"
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
                            Equipo: <span className="text-[var(--green)] font-medium">
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