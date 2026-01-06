'use client';

import { useEffect, useState } from 'react';
import { X, Search, Filter, Star, TrendingUp, Loader2, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import JugadorModalDreamTeam from '../JugadorModalDreamTeam';
import { useJugadoresDestacados } from '@/app/hooks/useJugadoresDestacadosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { JugadorDestacado } from '@/app/types/partido';
import { JugadorDestacadoDt } from '@/app/types/jugador';
import ModalBuscarJugadorDisponible from './ModalBuscarJugadorDisponible';

interface ModalSeleccionarJugadorProps {
    isOpen: boolean;
    onClose: () => void;
    posicion: string;
    posicionesIds: number[];
    onSeleccionar: (jugador: JugadorDestacadoDt) => void;
    jornada: number;
    isPending: boolean;
}

const ModalSeleccionarJugador = ({
    isOpen,
    onClose,
    posicion,
    posicionesIds,
    onSeleccionar,
    jornada,
    isPending
}: ModalSeleccionarJugadorProps) => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroOrden, setFiltroOrden] = useState<'goles' | 'asistencias' | 'nombre'>('goles');
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setMostrarModalBusqueda(false); // Resetear el modal de búsqueda cuando se abre este modal
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Hook para traer jugadores destacados
    // Si hay múltiples posiciones, traemos SIN filtro y filtramos localmente
    // Si hay una sola posición, filtramos en el backend
    const usarFiltroPosicion = posicionesIds.length === 1 ? posicionesIds[0] : undefined;

    const {
        data: jugadores = [],
        isLoading,
        isError,
        error,
        refetch: refetchJugadores
    } = useJugadoresDestacados({
        id_categoria_edicion: categoriaSeleccionada?.id_categoria_edicion || 0,
        jornada: jornada,
        id_posicion: usarFiltroPosicion,
        enabled: isOpen && !!categoriaSeleccionada && posicionesIds.length > 0,
    });

    // Refetch cuando se abre el modal
    useEffect(() => {
        if (isOpen && categoriaSeleccionada && posicionesIds.length > 0) {
            refetchJugadores();
        }
    }, [isOpen, categoriaSeleccionada, posicionesIds, refetchJugadores]);

    // Filtrar jugadores por posiciones permitidas (si hay múltiples)
    const jugadoresFiltradosPorPosicion = posicionesIds.length > 1
        ? jugadores.filter(j => j.posicion && posicionesIds.includes(j.posicion.id_posicion))
        : jugadores;

    // Filtrar por búsqueda y ordenar
    const jugadoresFiltrados = jugadoresFiltradosPorPosicion
        .filter(j =>
            j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (filtroOrden === 'goles') {
                return b.estadisticas.goles - a.estadisticas.goles;
            } else if (filtroOrden === 'asistencias') {
                return b.estadisticas.asistencias - a.estadisticas.asistencias;
            } else {
                return a.apellido.localeCompare(b.apellido);
            }
        });

    const handleSeleccionarJugador = (jugador: JugadorDestacado) => {
        setJugadorSeleccionado(jugador.id_jugador);
    };

    const handleConfirmar = async () => {
        const jugador = jugadoresFiltrados.find(j => j.id_jugador === jugadorSeleccionado);
        if (jugador && categoriaSeleccionada) {
            await onSeleccionar(jugador);
            setJugadorSeleccionado(null);
            setSearchTerm('');
            // Cerrar primero el modal
            onClose();
            // Refetch después de cerrar para evitar errores
            refetchJugadores();
        }
    };

    // No renderizar este modal si el modal de búsqueda está abierto
    if (!isVisible || mostrarModalBusqueda) {
        // Pero sí renderizar el modal de búsqueda si está abierto
        if (mostrarModalBusqueda) {
            return (
                <ModalBuscarJugadorDisponible
                    isOpen={mostrarModalBusqueda}
                    onClose={() => {
                        setMostrarModalBusqueda(false);
                        // Cerrar completamente ambos modales
                        onClose();
                    }}
                    posicion={posicion}
                    posicionesIds={posicionesIds}
                    onSeleccionar={onSeleccionar}
                    jornada={jornada}
                    isPending={isPending}
                />
            );
        }
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />
            <div className={`relative bg-[var(--gray-400)] rounded-xl border-2 border-[var(--color-primary)] shadow-2xl w-full max-w-5xl transform transition-all duration-300 ${isAnimating
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
                }`}
                style={{ maxHeight: '100vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--white)]">
                                Seleccionar {posicion} - Jornada {jornada}
                            </h2>
                            <p className="text-[var(--gray-100)] text-sm">
                                {categoriaSeleccionada?.nombre_completo || 'Jugadores destacados de esta jornada'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                        disabled={isPending}
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-[var(--gray-300)] space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-100)]" />
                            <Input
                                type="text"
                                placeholder="Buscar por jugador o equipo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                icon={<Search />}
                            />
                        </div>

                        {/* Ordenar */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-[var(--gray-100)]" />
                            <select
                                value={filtroOrden}
                                onChange={(e) => setFiltroOrden(e.target.value as any)}
                                className="px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            >
                                <option value="goles">Más goles</option>
                                <option value="asistencias">Más asistencias</option>
                                <option value="nombre">Nombre A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats summary */}
                    <div className="flex items-center gap-4 text-sm text-[var(--gray-100)]">
                        <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {jugadoresFiltrados.length} jugadores disponibles
                        </span>
                        {isLoading && (
                            <span className="flex items-center gap-2 text-[var(--color-primary)]">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Actualizando...
                            </span>
                        )}
                    </div>
                </div>

                {/* Content - Grid de jugadores */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {/* Loading state */}
                    {isLoading && jugadores.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
                            <p className="text-[var(--gray-100)]">Cargando jugadores destacados...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {isError && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[var(--color-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-[var(--color-secondary)]" />
                            </div>
                            <p className="text-[var(--color-secondary)] mb-2 font-medium text-lg">
                                Error al cargar los jugadores destacados
                            </p>
                            <p className="text-[var(--gray-100)] text-sm mb-6 max-w-md mx-auto">
                                {error?.message || 'No se pudieron cargar los jugadores. Intenta buscar manualmente.'}
                            </p>
                            <Button
                                variant="success"
                                onClick={() => setMostrarModalBusqueda(true)}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Users className="w-4 h-4" />
                                Buscar jugador manualmente
                            </Button>
                        </div>
                    )}

                    {/* Grid de jugadores */}
                    {!isError && jugadores.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jugadoresFiltrados.map((jugador) => (
                                <JugadorModalDreamTeam
                                    key={jugador.id_jugador}
                                    jugador={jugador}
                                    jugadorSeleccionado={jugadorSeleccionado}
                                    handleSeleccionarJugador={handleSeleccionarJugador as any}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty state - No hay jugadores destacados */}
                    {!isError && jugadores.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                            <p className="text-[var(--gray-100)] mb-2 font-medium text-lg">
                                No hay jugadores destacados disponibles
                            </p>
                            <p className="text-[var(--gray-100)] text-sm mb-6 max-w-md mx-auto">
                                {`No hay ${posicion}s destacados en esta jornada o ya han sido agregados al Dream Team.`}
                            </p>
                            <Button
                                variant="success"
                                onClick={() => setMostrarModalBusqueda(true)}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Users className="w-4 h-4" />
                                Buscar jugador manualmente
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-[var(--gray-300)]">
                    <div className="text-sm text-[var(--gray-100)]">
                        {jugadorSeleccionado && (
                            <span>
                                Jugador seleccionado: <span className="text-[var(--white)] font-medium">
                                    {jugadoresFiltrados.find(j => j.id_jugador === jugadorSeleccionado)?.nombre} {jugadoresFiltrados.find(j => j.id_jugador === jugadorSeleccionado)?.apellido}
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="default" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleConfirmar}
                            disabled={!jugadorSeleccionado || isLoading || isPending}
                            className="flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <Star className="w-4 h-4" />
                                    Agregar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSeleccionarJugador;