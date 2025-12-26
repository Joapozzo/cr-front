'use client';

import { ReactNode } from 'react';

interface FilterBarProps {
    children: ReactNode;
    className?: string;
}

/**
 * Contenedor estandarizado para filtros y controles de tablas
 * Mantiene espaciado y alineación consistente
 */
export function FilterBar({ children, className = '' }: FilterBarProps) {
    return (
        <div className={`flex items-center gap-2 flex-wrap ${className}`}>
            {children}
        </div>
    );
}

