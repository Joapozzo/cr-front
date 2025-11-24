/**
 * Componente para mostrar estado vacío
 */
'use client';

import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No se encontraron resultados',
    message = 'Intenta ajustar tus filtros de búsqueda',
    icon,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-[var(--gray-100)] mb-4">
                {icon || <FileQuestion className="h-12 w-12" />}
            </div>
            <h3 className="text-lg font-medium text-[var(--white)] mb-2">
                {title}
            </h3>
            <p className="text-sm text-[var(--gray-100)] text-center max-w-md">
                {message}
            </p>
        </div>
    );
};

