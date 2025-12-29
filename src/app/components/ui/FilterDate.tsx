'use client';

import { X } from 'lucide-react';
// import { Button } from './Button';
import { formatDateToLocalString, createLocalDate } from '@/app/utils/dateHelpers';

interface FilterDateProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    showClear?: boolean;
    className?: string;
}

/**
 * Input de fecha estilizado para filtros
 * Mantiene consistencia con otros componentes de filtro
 */
export function FilterDate({ 
    value, 
    onChange, 
    placeholder = 'Filtrar por fecha',
    showClear = true,
    className = '' 
}: FilterDateProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value ? createLocalDate(e.target.value) : undefined);
    };

    const handleClear = () => {
        onChange(undefined);
    };

    return (
        <div className={`relative flex items-center gap-1 ${className}`}>
            <input
                type="date"
                value={value ? formatDateToLocalString(value) : ''}
                onChange={handleChange}
                placeholder={placeholder}
                className="h-9 px-4 py-2 bg-[#1A1A1A] border border-[#2D2F30] rounded-[20px] text-[#fafafa] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2AD174] focus:border-transparent transition-all duration-200 hover:border-[#3D3F40]"
            />
            {showClear && value && (
                <button
                    type="button"
                    onClick={handleClear}
                    title="Quitar filtro de fecha"
                    className="h-9 w-9 p-0 flex items-center justify-center rounded-[20px] bg-transparent border border-[#2D2F30] text-[#65656B] hover:bg-[#2D2F30] hover:text-white transition-all duration-200"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

