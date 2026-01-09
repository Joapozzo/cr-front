import React from 'react';

interface Column<T extends Record<string, unknown> = Record<string, unknown>> {
    key: string;
    label: React.ReactNode;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
    data: T[];
    columns: Column<T>[];
    emptyMessage?: string;
    className?: string;
    onRowClick?: (row: T, index: number) => void;
    isLoading?: boolean;
    getRowClassName?: (row: T, index: number) => string;
    getRowStyle?: (row: T, index: number) => React.CSSProperties;
}

// Componente de Skeleton para las filas de carga
const TableRowSkeleton = <T extends Record<string, unknown>>({ columns }: { columns: Column<T>[] }) => (
    <tr className="animate-pulse">
        {columns.map((column, index) => (
            <td key={index} className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-[var(--gray-300)] rounded w-3/4"></div>
            </td>
        ))}
    </tr>
);

export const DataTable = <T extends Record<string, unknown>>({
    data,
    columns,
    emptyMessage = "No hay datos disponibles",
    className = "",
    onRowClick,
    isLoading = false, // Valor por defecto
    getRowClassName,
    getRowStyle
}: DataTableProps<T>) => {
    
    // Estado de loading
    if (isLoading) {
        return (
            <div className={`bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden ${className}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header */}
                        <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-200)]">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-4 text-left text-sm font-medium text-[var(--gray-200)] uppercase tracking-wider ${
                                            column.className || ''
                                        }`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        
                        {/* Loading Body */}
                        <tbody className="divide-y divide-[var(--gray-300)]">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRowSkeleton key={index} columns={columns} />
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Loading indicator */}
                {/* <div className="p-4 text-center border-t border-[var(--gray-300)]">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[var(--gray-100)] text-sm">Cargando datos...</span>
                    </div>
                </div> */}
            </div>
        );
    }

    // Estado vacío
    if (!data || data.length === 0) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--gray-300)] rounded-full flex items-center justify-center">
                        <svg 
                            className="w-8 h-8 text-[var(--gray-100)]" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2m0 6v2" 
                            />
                        </svg>
                    </div>
                    <p className="text-[var(--gray-100)] text-lg font-medium mb-2">Sin datos</p>
                    <p className="text-[var(--gray-200)] text-sm">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    // Estado con datos
    return (
        <div className={`bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-[var(--gray-400)] border-b border-[var(--gray-200)]">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-sm font-medium text-[var(--gray-200)] uppercase tracking-wider ${
                                        column.className || ''
                                    }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-[var(--gray-300)]">
                        {data.map((row, index) => {
                            const customClassName = getRowClassName ? getRowClassName(row, index) : '';
                            const customStyle = getRowStyle ? getRowStyle(row, index) : {};
                            
                            // Obtener el color del row si está disponible (para hover personalizado)
                            const rowColor = (row as any)?.configuracion?.color;
                            
                            // Helper para convertir hex a rgba
                            const hexToRgba = (hex: string, opacity: number): string => {
                                const cleanHex = hex.replace('#', '');
                                const r = parseInt(cleanHex.substring(0, 2), 16);
                                const g = parseInt(cleanHex.substring(2, 4), 16);
                                const b = parseInt(cleanHex.substring(4, 6), 16);
                                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                            };
                            
                            const hoverStyle = rowColor ? {
                                '--row-hover-color': hexToRgba(rowColor, 0.15),
                            } as React.CSSProperties & { '--row-hover-color': string } : {};
                            
                            return (
                            <tr
                                key={(row as { id?: string | number }).id || index}
                                onClick={() => onRowClick?.(row, index)}
                                className={`transition-colors ${
                                    onRowClick 
                                        ? 'cursor-pointer' 
                                        : ''
                                } ${customClassName} ${rowColor ? 'categoria-row-hover' : 'hover:bg-[var(--gray-300)]'}`}
                                style={{ ...customStyle, ...hoverStyle }}
                            >
                                {columns.map((column) => {
                                    const value = row[column.key];
                                    const cellContent = column.render
                                        ? column.render(value, row, index)
                                        : (value as React.ReactNode);

                                    return (
                                        <td
                                            key={column.key}
                                            onClick={(e) => {
                                                // Prevenir propagación si se hace click en un botón o elemento interactivo
                                                const target = e.target as HTMLElement;
                                                if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
                                                    e.stopPropagation();
                                                }
                                            }}
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                column.className || 'text-[var(--gray-100)]'
                                            }`}
                                        >
                                            {cellContent}
                                        </td>
                                    );
                                })}
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};