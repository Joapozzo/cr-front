'use client';

import { PlantelEquipo } from '@/app/types/legajos';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { User, Calendar, Volleyball } from 'lucide-react';
import { URI_IMG } from '@/app/components/ui/utils';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';

interface EquipoPlantelTabProps {
    plantel: PlantelEquipo | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
}

export const EquipoPlantelTab = ({ plantel, isLoading, categoriaSeleccionada }: EquipoPlantelTabProps) => {
    const router = useRouter();

    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver el plantel</p>
        );
    }

    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={40} borderRadius={6} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} height={100} borderRadius={6} />
                        ))}
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    if (!plantel) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar el plantel</p>
        );
    }

    const handleJugadorClick = (idJugador: number) => {
        router.push(`/adm/legajos/jugadores/${idJugador}`);
    };

    const getEstadoColor = (estado: string, sancionado: boolean) => {
        if (sancionado) return 'border-[var(--color-secondary)]';
        if (estado === 'baja') return 'border-[var(--gray-200)]';
        return 'border-[var(--color-primary)]';
    };

    const getEstadoBadgeColor = (estado: string, sancionado: boolean) => {
        if (sancionado) return 'bg-[var(--color-secondary)] text-[var(--white)]';
        if (estado === 'baja') return 'bg-[var(--gray-200)] text-[var(--white)]';
        return 'bg-[var(--color-primary)] text-[var(--white)]';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--white)]">
                Plantel - {plantel.categoria_edicion.categoria.nombre} - {plantel.categoria_edicion.edicion.nombre}
            </h2>

            {plantel.capitanes.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plantel.capitanes.map((capitan) => (
                            <div
                                key={capitan.id_jugador}
                                onClick={() => handleJugadorClick(capitan.id_jugador)}
                                className="bg-[var(--gray-300)] rounded-lg p-4 cursor-pointer hover:bg-[var(--gray-400)] transition-colors"
                            >
                                <p className="text-[var(--white)] font-semibold">
                                    {capitan.nombre} {capitan.apellido}
                                </p>
                                <p className="text-sm text-[var(--gray-100)]">
                                    Desde: {new Date(capitan.fecha_inicio).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Jugadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plantel.jugadores.map((jugador) => {
                        const esEventual = jugador.tipo === 'eventual';                        
                        return (
                            <div
                                key={jugador.jugador.id_jugador}
                                onClick={() => handleJugadorClick(jugador.jugador.id_jugador)}
                                className={`
                                    bg-[var(--gray-300)] rounded-lg p-4 border-2 transition-all hover:shadow-lg cursor-pointer
                                    ${getEstadoColor(jugador.estado, jugador.sancionado)}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Foto del jugador */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-400)] flex-shrink-0 border-2 border-[var(--gray-200)]">
                                        <ImagenPublica
                                            src={jugador.jugador.img}
                                            alt={`${jugador.jugador.nombre} ${jugador.jugador.apellido}`}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            fallbackIcon={<User className="w-8 h-8 text-[var(--gray-100)]" />}
                                        />
                                    </div>

                                    {/* Información del jugador */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-[var(--white)] font-semibold truncate">
                                                {jugador.jugador.nombre} {jugador.jugador.apellido}
                                            </h4>
                                            {esEventual && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-[var(--yellow)] text-[var(--white)] font-medium flex-shrink-0">
                                                    Eventual
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--gray-100)] truncate">
                                            {jugador?.jugador?.posicion?.nombre}
                                        </p>
                                    </div>

                                    {/* Estadísticas con iconos */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-[var(--gray-100)]" />
                                            <span className="text-sm text-[var(--white)] font-medium">
                                                {jugador.partidos_jugados}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Volleyball className="w-4 h-4 text-[var(--color-primary)]" />
                                            <span className="text-sm text-[var(--color-primary)] font-medium">
                                                {jugador.estadisticas.goles}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="mt-3 flex justify-end">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoBadgeColor(jugador.estado, jugador.sancionado)}`}>
                                        {jugador.sancionado ? 'Sancionado' : jugador.estado === 'activo' ? 'Activo' : 'Baja'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

