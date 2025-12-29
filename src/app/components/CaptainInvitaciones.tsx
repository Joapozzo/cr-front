"use client";

import { Send, Search, Plus, Clock, User, AlertCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import ConfirmModal from "./modals/ConfirModal";
import toast from "react-hot-toast";
import { useDebounce } from "../hooks/useDebounce";
import { useEnviarInvitacion, useObtenerInvitacionesEnviadas } from "../hooks/useSolicitudesCapitan";
import { Jugador } from "../types/jugador";
import { useBuscarJugadores } from "../hooks/useBuscarJugadores";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";
import { ImagenPublica } from "./common/ImagenPublica";
import { SolicitudRecibida, SolicitudEstado } from "../types/solicitudes";

const SearchInput = memo(({ onSearchChange }: { onSearchChange: (value: string) => void }) => {
    const [localValue, setLocalValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalValue(value);
        onSearchChange(value);
    };

    return (
        <Input
            placeholder="Buscar jugadores por nombre (mín. 2 caracteres)..."
            value={localValue}
            onChange={handleChange}
            icon={<Search className="w-4 h-4" />}
        />
    );
});

SearchInput.displayName = 'SearchInput';

interface InvitacionesCapitanProps {
    id_equipo: number;
    id_categoria_edicion: number;
}

const InvitacionesCapitan: React.FC<InvitacionesCapitanProps> = ({
    id_equipo,
    id_categoria_edicion,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<Jugador | null>(null);
    const [showInvitacionModal, setShowInvitacionModal] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: invitacionesData, isLoading: isInvitacionesLoading } = useObtenerInvitacionesEnviadas(id_equipo, id_categoria_edicion);
    const invitaciones = invitacionesData?.data || [];
    
    // Buscar jugadores disponibles
    const { jugadores: data, isLoading: isSearching } = useBuscarJugadores(
        debouncedSearchTerm,
        { limit: 10 }
    );

    const jugadoresEncontrados = data || [];

    // Enviar invitación
    const { mutate: enviarInvitacion, isPending: isEnviandoInvitacion } = useEnviarInvitacion();

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleInvitar = (jugador: Jugador) => {
        setJugadorSeleccionado(jugador);
        setShowInvitacionModal(true);
    };

    const confirmarInvitacion = (mensaje?: string) => {
        if (!jugadorSeleccionado) return;

        enviarInvitacion({
            id_jugador_invitado: jugadorSeleccionado.id_jugador,
            mensaje_capitan: mensaje
        }, {
            onSuccess: (data) => {
                console.log('✅ Invitación enviada exitosamente. Data recibida:', data);
                setShowInvitacionModal(false);
                setJugadorSeleccionado(null);
                setSearchTerm('');
                // Usar el mensaje del backend - el backend devuelve { message: "..." }
                const mensajeExito = data?.message || 'Invitación enviada exitosamente';
                console.log('📝 Mensaje a mostrar:', mensajeExito);
                toast.success(mensajeExito, {
                    duration: 4000,
                    position: 'top-right',
                });
            },
            onError: (error) => {
                console.error('❌ Error al enviar invitación:', error);
                toast.error(error.message || 'Error al enviar la invitación');
            }
        });
    };

    const getEstadoColor = (estado: SolicitudEstado | string) => {
        const estadoStr = String(estado);
        switch (estadoStr) {
            case 'A':
            case 'aceptada':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'R':
            case 'rechazada':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'C':
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
            default:
                return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        }
    };

    const getEstadoTexto = (estado: SolicitudEstado | string) => {
        const estadoStr = String(estado);
        switch (estadoStr) {
            case 'A':
            case 'aceptada':
                return 'Aceptada';
            case 'R':
            case 'rechazada':
                return 'Rechazada';
            case 'C':
                return 'Cancelada';
            default:
                return 'Pendiente';
        }
    };

    if (isInvitacionesLoading) {
        return <SolicitudesSkeleton />;
    }

    return (
        <>
            <div className="rounded-2xl border border-[var(--gray-300)]">
                {/* Header */}
                <div className="flex items-center gap-2 bg-[var(--black-900)] p-4 rounded-t-2xl">
                    <Send className="text-[var(--green)]" size={16} />
                    <h3 className="text-[var(--white)] font-bold text-sm">Invitar Jugadores</h3>
                </div>

                <div className="space-y-4 p-4">
                    {/* Búsqueda de jugadores */}
                    <div>
                        <div className="flex gap-2 flex-col">
                            <SearchInput onSearchChange={handleSearchChange} />
                            {isSearching && (
                                <span className="text-[var(--gray-100)] text-sm self-center mt-3">
                                    Buscando jugadores...
                                </span>
                            )}
                        </div>

                        {/* Resultados de búsqueda */}
                        {jugadoresEncontrados.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[var(--gray-100)] text-sm mt-3">
                                    Se encontraron {jugadoresEncontrados.length} jugador(es):
                                </p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {jugadoresEncontrados.map((jugador) => {
                                        // Verificar si ya hay una invitación pendiente o aceptada para este jugador
                                        const yaInvitado = invitaciones.some((inv: SolicitudRecibida) => 
                                            inv.id_jugador === jugador.id_jugador && 
                                            (String(inv.estado) === 'E' || String(inv.estado) === 'A')
                                        );

                                        return (
                                            <div
                                                key={jugador.id_jugador}
                                                className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ImagenPublica
                                                        src={jugador.img}
                                                        alt={`${jugador.nombre} ${jugador.apellido}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        width={40}
                                                        height={40}
                                                        fallbackIcon={<User className="text-[var(--gray-100)]" size={20} />}
                                                    />
                                                    <div>
                                                        <p className="text-[var(--white)] font-medium">
                                                            {jugador.nombre} {jugador.apellido}
                                                        </p>
                                                        {jugador.posicion && (
                                                            <p className="text-[var(--gray-100)] text-sm">
                                                                {jugador.posicion.nombre}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleInvitar(jugador)}
                                                    variant="footer"
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    disabled={isEnviandoInvitacion || yaInvitado}
                                                >
                                                    {yaInvitado ? (
                                                        <>
                                                            <Clock size={14} />
                                                            Ya invitado
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={14} />
                                                            Invitar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Mensaje si no hay resultados */}
                        {searchTerm.trim().length >= 2 && jugadoresEncontrados.length === 0 && !isSearching && (
                            <div className="text-center py-4">
                                <AlertCircle className="w-8 h-8 text-[var(--gray-100)] mx-auto mb-2" />
                                <p className="text-[var(--gray-100)] text-sm">
                                    No se encontraron jugadores disponibles con ese nombre
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Invitaciones enviadas */}
                    {invitaciones && invitaciones.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pt-4 border-t border-[var(--gray-300)]">
                                <Clock className="text-[var(--gray-100)]" size={16} />
                                <h4 className="text-[var(--white)] font-semibold">Invitaciones Enviadas</h4>
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {invitaciones.map((invitacion: SolicitudRecibida) => {
                                    const diasPendiente = Math.floor(
                                        (new Date().getTime() - new Date(invitacion.fecha_solicitud).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <div
                                            key={invitacion.id_solicitud}
                                            className="p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <ImagenPublica
                                                    src={invitacion.img_jugador}
                                                    alt={invitacion.nombre_jugador}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    width={32}
                                                    height={32}
                                                    fallbackIcon={<User className="text-[var(--gray-100)]" size={16} />}
                                                />

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="text-[var(--white)] font-medium text-sm">
                                                            {invitacion.nombre_jugador}
                                                        </h5>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getEstadoColor(invitacion.estado)}`}>
                                                            {getEstadoTexto(invitacion.estado)}
                                                        </span>
                                                    </div>

                                                    <p className="text-[var(--gray-100)] text-xs">
                                                        Enviada hace {diasPendiente === 0 ? 'hoy' : `${diasPendiente} día${diasPendiente > 1 ? 's' : ''}`}
                                                    </p>

                                                    {invitacion.respondido_por_username && (
                                                        <p className="text-[var(--gray-100)] text-xs mt-1">
                                                            Respondida por: <span className="text-[var(--white)] font-medium">{invitacion.respondido_por_username}</span>
                                                        </p>
                                                    )}

                                                    {invitacion.agregado_por && String(invitacion.estado) === 'A' && (
                                                        <p className="text-[var(--gray-100)] text-xs mt-1">
                                                            Agregado por: <span className="text-[var(--white)] font-medium">{invitacion.agregado_por}</span>
                                                        </p>
                                                    )}

                                                    {invitacion.mensaje_capitan && (
                                                        <div className="mt-2 p-2 bg-[var(--card-background)] rounded border border-[var(--gray-300)]">
                                                            <p className="text-[var(--gray-100)] text-xs mb-1">Tu mensaje:</p>
                                                            <p className="text-[var(--white)] text-xs italic">
                                                                &quot;{invitacion.mensaje_capitan}&quot;
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

                    {/* Mensaje si no hay invitaciones enviadas */}
                    {(!invitaciones || invitaciones.length === 0) && (
                        <div className="text-center py-8 border-t border-[var(--gray-300)]">
                            <Send className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                            <h4 className="text-[var(--white)] font-semibold text-lg mb-2">
                                Sin invitaciones enviadas
                            </h4>
                            <p className="text-[var(--gray-100)] text-sm">
                                Busca jugadores y envía tu primera invitación
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={showInvitacionModal}
                onClose={() => setShowInvitacionModal(false)}
                onConfirm={confirmarInvitacion}
                title="Enviar Invitación"
                description="¿Estás seguro que quieres enviar una invitación a este jugador?"
                confirmText="Enviar Invitación"
                variant="success"
                icon={<Send className="w-5 h-5" />}
                isLoading={isEnviandoInvitacion}
                showTextarea={true}
                textareaPlaceholder="Escribe un mensaje para el jugador..."
                textareaLabel="Mensaje opcional"
            >
                {jugadorSeleccionado && (
                    <div className="text-left space-y-2">
                        <p className="text-[var(--gray-100)] text-sm">
                            Jugador: <span className="text-[var(--green)] font-medium">
                                {jugadorSeleccionado.nombre} {jugadorSeleccionado.apellido}
                            </span>
                        </p>
                    </div>
                )}
            </ConfirmModal>
        </>
    );
};

export default InvitacionesCapitan;