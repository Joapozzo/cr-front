'use client';

import { EquipoCard } from './EquipoCard';
import { EquipoCardSkeleton } from './EquipoCardSkeleton';
import { Pagination } from '../shared/Pagination';
import { EmptyState } from '../shared/EmptyState';
import { EquipoBusqueda, PaginacionMetadata } from '@/app/types/legajos';

interface EquipoGridProps {
    equipos?: EquipoBusqueda[];
    pagination?: PaginacionMetadata;
    isLoading?: boolean;
    onPageChange?: (page: number) => void;
}

export const EquipoGrid: React.FC<EquipoGridProps> = ({
    equipos = [],
    pagination,
    isLoading = false,
    onPageChange,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                    <EquipoCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (equipos.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipos.map((equipo) => (
                    <EquipoCard key={equipo.id_equipo} equipo={equipo} />
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

