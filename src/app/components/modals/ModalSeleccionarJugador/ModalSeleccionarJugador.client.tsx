'use client';

import { useEffect } from 'react';
import { useJugadoresDestacados } from '@/app/hooks/useJugadoresDestacadosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { JugadorDestacadoDt } from '@/app/types/jugador';
import ModalBuscarJugadorDisponible from '../ModalBuscarJugadorDisponible';
import { useModalAnimation } from './hooks/useModalAnimation';
import { useModalSeleccionarJugador } from './hooks/useModalSeleccionarJugador';
import { useJugadoresFiltrados } from './hooks/useJugadoresFiltrados';
import { ModalSeleccionarJugadorView } from './ModalSeleccionarJugador.view';

interface ModalSeleccionarJugadorClientProps {
    isOpen: boolean;
    onClose: () => void;
    posicion: string;
    posicionesIds: number[];
    onSeleccionar: (jugador: JugadorDestacadoDt) => Promise<void>;
    jornada: number;
    isPending: boolean;
}

/**
 * Container component que maneja toda la lógica y estado
 * NO renderiza directamente, delega a ModalSeleccionarJugadorView
 */
export const ModalSeleccionarJugadorClient = ({
    isOpen,
    onClose,
    posicion,
    posicionesIds,
    onSeleccionar,
    jornada,
    isPending,
}: ModalSeleccionarJugadorClientProps) => {
    const { categoriaSeleccionada } = useCategoriaStore();

    // Animación
    const { isVisible, isAnimating } = useModalAnimation({ isOpen });

    // Estado y lógica del modal
    const {
        searchTerm,
        filtroOrden,
        jugadorSeleccionado,
        mostrarModalBusqueda,
        handleSeleccionarJugador,
        handleSearchChange,
        handleOrdenChange,
        handleConfirmar,
        handleBuscarManual,
        handleCloseModalBusqueda,
    } = useModalSeleccionarJugador({
        onSeleccionar,
        onClose,
    });

    // Decisión: filtro backend vs frontend
    // Si hay múltiples posiciones, traemos SIN filtro y filtramos localmente
    // Si hay una sola posición, filtramos en el backend
    const usarFiltroBackend = posicionesIds.length === 1;
    const idPosicionBackend = usarFiltroBackend ? posicionesIds[0] : undefined;

    // Fetch de jugadores
    const {
        data: jugadores = [],
        isLoading,
        isError,
        error,
        refetch: refetchJugadores,
    } = useJugadoresDestacados({
        id_categoria_edicion: categoriaSeleccionada?.id_categoria_edicion || 0,
        jornada: jornada,
        id_posicion: idPosicionBackend,
        enabled: isOpen && !!categoriaSeleccionada && posicionesIds.length > 0,
    });

    // Refetch cuando se abre el modal
    useEffect(() => {
        if (isOpen && categoriaSeleccionada && posicionesIds.length > 0) {
            refetchJugadores();
        }
    }, [isOpen, categoriaSeleccionada, posicionesIds, refetchJugadores]);

    // Filtrado y ordenamiento
    const { jugadoresFiltrados, total } = useJugadoresFiltrados({
        jugadores,
        posicionesIds,
        searchTerm,
        filtroOrden,
        usarFiltroBackend,
    });

    // Obtener jugador seleccionado completo
    const jugadorSeleccionadoCompleto = jugadoresFiltrados.find(
        (j) => j.id_jugador === jugadorSeleccionado
    );

    // Handler para confirmar
    const handleConfirmarWrapper = () => {
        handleConfirmar(jugadorSeleccionadoCompleto);
    };

    // Si el modal de búsqueda está abierto, renderizarlo
    if (mostrarModalBusqueda) {
        return (
            <ModalBuscarJugadorDisponible
                isOpen={mostrarModalBusqueda}
                onClose={handleCloseModalBusqueda}
                posicion={posicion}
                posicionesIds={posicionesIds}
                onSeleccionar={onSeleccionar}
                jornada={jornada}
                isPending={isPending}
            />
        );
    }

    // No renderizar si no es visible
    if (!isVisible) {
        return null;
    }

    return (
        <ModalSeleccionarJugadorView
            isOpen={isOpen}
            isAnimating={isAnimating}
            posicion={posicion}
            jornada={jornada}
            categoriaNombre={categoriaSeleccionada?.nombre_completo}
            searchTerm={searchTerm}
            filtroOrden={filtroOrden}
            onSearchChange={handleSearchChange}
            onOrdenChange={handleOrdenChange}
            jugadores={jugadoresFiltrados}
            jugadorSeleccionado={jugadorSeleccionadoCompleto}
            onSelectJugador={handleSeleccionarJugador}
            loading={isLoading}
            error={isError ? error?.message : undefined}
            totalJugadores={total}
            onConfirm={handleConfirmarWrapper}
            onClose={onClose}
            onBuscarManual={handleBuscarManual}
            isPending={isPending}
        />
    );
};

