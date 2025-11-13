import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { BaseCard, CardHeader } from './BaseCard';
import Select, { SelectOption } from './ui/Select';
import MVPComponentSkeleton from './skeletons/CardMvpSkeleton';
import { JugadorDestacado, JugadorDestacadoPartido, PartidoCompleto } from '../types/partido';
import { useSeleccionarMVP } from '../hooks/useJugadoresDestacados';

interface MVPComponentProps {
    jugadores: JugadorDestacadoPartido[];
    partido: PartidoCompleto;
    mvpActual?: JugadorDestacado | null;
    onMVPChange: (jugadorId: number) => void;
    permitirEdicion?: boolean;
    loading?: boolean;
    mvpActualId?: number;
}

const MVPComponent: React.FC<MVPComponentProps> = ({
    jugadores,
    partido,
    mvpActualId,
    onMVPChange,
    permitirEdicion = true,
    loading = false
}) => {
    // Estado local para manejar el MVP seleccionado
    const [mvpSeleccionadoId, setMvpSeleccionadoId] = useState<number | undefined>(mvpActualId);

    const { mutateAsync: seleccionarMVP } = useSeleccionarMVP();

    // Reemplaza estos useEffect por este único useEffect:
    useEffect(() => {
        if (mvpActualId && mvpActualId !== mvpSeleccionadoId) {
            setMvpSeleccionadoId(mvpActualId);
        }
    }, [mvpActualId, mvpSeleccionadoId]);

    // Encontrar el jugador seleccionado basado en el estado local
    const jugadorSeleccionado = jugadores?.find(
        j => Number(j.id_jugador) === Number(mvpSeleccionadoId)
    );

    // Preparar las opciones para el Select
    const jugadorOptions: SelectOption[] = jugadores?.map(jugador => ({
        value: jugador.id_jugador,
        label: `${jugador.apellido.toUpperCase()}, ${jugador.nombre}`,
        image: jugador.img_jugador || 'default-user.png'
    })) || [];

    // Manejar el cambio de MVP
    const handleMVPChange = async (jugadorId: string | number) => {
        const nuevoMvpId = Number(jugadorId);
        const jugadorSeleccionado = jugadores?.find(j => Number(j.id_jugador) === nuevoMvpId);

        if (!jugadorSeleccionado) return;

        // Actualizar el estado local inmediatamente para la UI
        setMvpSeleccionadoId(nuevoMvpId);

        // Llamar al callback del padre
        onMVPChange(nuevoMvpId);

        // Hacer la petición al servidor
        try {
            await seleccionarMVP({
                idPartido: Number(partido.id_partido),
                mvpData: {
                    id_categoria_edicion: partido.id_categoria_edicion,
                    id_equipo: jugadorSeleccionado.id_equipo,
                    id_jugador: nuevoMvpId
                }
            });
        } catch (error) {
            console.error('Error al seleccionar MVP:', error);
            // Revertir el cambio en caso de error
            setMvpSeleccionadoId(mvpActualId);
        }
    };

    if (loading) {
        return <MVPComponentSkeleton />;
    }

    return (
        <BaseCard className="mx-auto w-full">
            <CardHeader
                title="MVP - Mejor Jugador"
                icon={<Star className="w-5 h-5 text-yellow-500 fill-current" />}
            />

            <div className="p-6 space-y-6">
                {/* Select del MVP */}
                <div>
                    <label className="block text-sm font-medium text-[#737373] mb-3">
                        Seleccionar mejor jugador del partido:
                    </label>
                    <Select
                        options={jugadorOptions}
                        value={mvpSeleccionadoId || ''}
                        onChange={handleMVPChange}
                        placeholder="Seleccionar jugador..."
                        showImages={true}
                        disabled={!permitirEdicion}
                        bgColor="bg-[#171717]"
                    />
                </div>

                {/* Información del MVP seleccionado */}
                {jugadorSeleccionado && (
                    <div className="flex items-start gap-4 p-4 bg-[#171717] rounded-lg border border-[#262626]">
                        {/* Foto del jugador */}
                        <div className="flex-shrink-0">
                            {jugadorSeleccionado.img_jugador ? (
                                <img
                                    src={jugadorSeleccionado.img_jugador}
                                    alt={`${jugadorSeleccionado.nombre} ${jugadorSeleccionado.apellido}`}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center border-2 border-yellow-500">
                                    <User className="w-8 h-8 text-[#737373]" />
                                </div>
                            )}
                        </div>

                        {/* Información del jugador */}
                        <div className="flex-1 min-w-0">
                            {/* Nombre y apellido */}
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <h3 className="text-white font-semibold text-lg">
                                    {jugadorSeleccionado.apellido.toUpperCase()}, {jugadorSeleccionado.nombre}
                                </h3>
                            </div>

                            {/* Equipo y posición */}
                            <div className="flex items-center gap-2">
                                <p className="text-[#e5e5e5] text-sm font-medium">
                                    {jugadorSeleccionado.nombre_equipo},
                                </p>
                                {jugadorSeleccionado.posicion && (
                                    <p className="text-[#737373] text-sm">
                                        Posicion: {jugadorSeleccionado.posicion}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Estrellas decorativas */}
                        {/* <div className="flex flex-col gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        </div> */}
                    </div>
                )}

                {/* Estado sin selección */}
                {!jugadorSeleccionado && (
                    <div className="text-center py-8 text-[#737373]">
                        <Star className="w-12 h-12 text-[#404040] mx-auto mb-3" />
                        <p>Selecciona el mejor jugador del partido</p>
                    </div>
                )}
            </div>
        </BaseCard>
    );
};

export default MVPComponent;