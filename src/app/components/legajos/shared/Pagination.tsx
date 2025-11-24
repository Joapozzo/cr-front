/**
 * Componente de paginación reutilizable
 */
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[var(--gray-300)] bg-[var(--gray-300)] text-[var(--white)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--gray-200)] transition-colors"
                aria-label="Página anterior"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-[var(--gray-100)]"
                        >
                            ...
                        </span>
                    );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            isActive
                                ? 'bg-[var(--primary)] text-[var(--white)] border-[var(--primary)]'
                                : 'border-[var(--gray-300)] bg-[var(--gray-300)] text-[var(--white)] hover:bg-[var(--gray-200)]'
                        }`}
                        aria-label={`Ir a página ${pageNumber}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[var(--gray-300)] bg-[var(--gray-300)] text-[var(--white)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--gray-200)] transition-colors"
                aria-label="Página siguiente"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

