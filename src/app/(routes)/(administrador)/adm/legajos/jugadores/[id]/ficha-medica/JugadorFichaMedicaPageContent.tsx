'use client';

import { FileCheck } from 'lucide-react';
import { useAuthStore } from '@/app/stores/authStore';
import { useJugadorId } from './hooks/useJugadorId';
import { useFichaMedicaActions } from './hooks/useFichaMedicaActions';
import { SkeletonLoader } from './components/SkeletonLoader';
import { BadgeEstado } from './components/BadgeEstado';
import { FichaMedicaDetalle } from './components/FichaMedicaDetalle';
import { EmptyState } from './components/EmptyState';
import { AccionesAdmin } from './components/AccionesAdmin';
import { ModalesFichaMedica } from './components/ModalesFichaMedica';

export default function JugadorFichaMedicaPageContent() {
    const idJugador = useJugadorId();
    const usuario = useAuthStore((state) => state.usuario);
    const isAdmin = usuario?.id_rol === 1;

    const {
        fichaMedica: fichaMedicaRaw,
        isLoading,
        isSubiendo,
        isCambiandoEstado,
        showSubirModal,
        showCambiarEstadoModal,
        estadoSeleccionado,
        handleSubirFicha,
        handleCambiarEstado,
        handleDescargar,
        openSubirModal,
        closeSubirModal,
        openCambiarEstadoModal,
        closeCambiarEstadoModal,
        handleEstadoChange,
    } = useFichaMedicaActions({ idJugador: idJugador ?? 0 });

    // Normalizar undefined a null para compatibilidad con tipos
    const fichaMedica = fichaMedicaRaw ?? null;

    if (!idJugador) {
        return null;
    }

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-semibold text-[var(--white)]">Ficha médica</h2>
                </div>
                {isAdmin && (
                    <AccionesAdmin
                        fichaMedica={fichaMedica}
                        isSubiendo={isSubiendo}
                        isCambiandoEstado={isCambiandoEstado}
                        onDescargar={handleDescargar}
                        onSubir={openSubirModal}
                        onCambiarEstado={openCambiarEstadoModal}
                    />
                )}
            </div>

            {/* Contenido */}
            <div className="bg-[var(--gray-500)] rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[var(--gray-100)] font-medium">Estado:</span>
                    <BadgeEstado fichaMedica={fichaMedica} />
                </div>

                {fichaMedica ? (
                    <FichaMedicaDetalle fichaMedica={fichaMedica} />
                ) : (
                    <EmptyState
                        message="No hay ficha médica registrada para este jugador"
                        hint={isAdmin ? 'Use el botón "Subir PDF" para agregar una ficha médica' : undefined}
                    />
                )}
            </div>

            {/* Modales */}
            <ModalesFichaMedica
                showSubirModal={showSubirModal}
                showCambiarEstadoModal={showCambiarEstadoModal}
                estadoSeleccionado={estadoSeleccionado}
                fichaMedica={fichaMedica}
                isSubiendo={isSubiendo}
                isCambiandoEstado={isCambiandoEstado}
                onCloseSubir={closeSubirModal}
                onCloseCambiarEstado={closeCambiarEstadoModal}
                onSubirFicha={handleSubirFicha}
                onCambiarEstado={handleCambiarEstado}
                onEstadoChange={handleEstadoChange}
            />
        </div>
    );
}
