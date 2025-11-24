/**
 * Grid de jugadores con paginación
 */
'use client';

import { JugadorCard } from './JugadorCard';
import { JugadorCardSkeleton } from './JugadorCardSkeleton';
import { Pagination } from '../shared/Pagination';
import { EmptyState } from '../shared/EmptyState';
import { JugadorBusqueda, PaginacionMetadata } from '@/app/types/legajos';

interface JugadorGridProps {
    jugadores?: JugadorBusqueda[];
    pagination?: PaginacionMetadata;
    isLoading?: boolean;
    onPageChange?: (page: number) => void;
}

export const JugadorGrid: React.FC<JugadorGridProps> = ({
    jugadores = [],
    pagination,
    isLoading = false,
    onPageChange,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                    <JugadorCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (jugadores.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {jugadores.map((jugador) => (
                    <JugadorCard key={jugador.id_jugador} jugador={jugador} />
                ))}
            </div>

            {pagination && pagination.totalPages > 1 && onPageChange && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

