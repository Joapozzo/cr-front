'use client';

import { HistorialCapitanes } from '@/app/types/legajos';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoCapitanesTabProps {
    capitanes: HistorialCapitanes | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
}

export const EquipoCapitanesTab = ({ capitanes, isLoading, categoriaSeleccionada }: EquipoCapitanesTabProps) => {
    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los capitanes</p>
        );
    }

    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <Skeleton height={200} borderRadius={6} />
            </SkeletonTheme>
        );
    }

    if (!capitanes) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar el historial de capitanes</p>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--white)] mb-4">Historial de Capitanes</h2>

            {capitanes.capitanes_actuales.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes Actuales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {capitanes.capitanes_actuales.map((capitan) => (
                            <div key={capitan.id_jugador} className="bg-[var(--gray-300)] rounded-lg p-4">
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

            {capitanes.capitanes_anteriores.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes Anteriores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {capitanes.capitanes_anteriores.map((capitan) => (
                            <div key={capitan.id_jugador} className="bg-[var(--gray-300)] rounded-lg p-4">
                                <p className="text-[var(--white)] font-semibold">
                                    {capitan.nombre} {capitan.apellido}
                                </p>
                                <p className="text-sm text-[var(--gray-100)]">
                                    {new Date(capitan.fecha_inicio).toLocaleDateString()} -{' '}
                                    {capitan.fecha_fin
                                        ? new Date(capitan.fecha_fin).toLocaleDateString()
                                        : 'Presente'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {capitanes.capitanes_actuales.length === 0 && capitanes.capitanes_anteriores.length === 0 && (
                <p className="text-[var(--gray-100)] text-center py-8">No hay capitanes registrados</p>
            )}
        </div>
    );
};

