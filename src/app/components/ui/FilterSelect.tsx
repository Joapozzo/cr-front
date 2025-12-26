'use client';

import Select from './Select';

interface FilterSelectOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterSelectOption[];
    placeholder?: string;
    className?: string;
    width?: string;
}

/**
 * Select estilizado para filtros
 * Mantiene altura y estilos consistentes con otros filtros (h-9)
 */
export function FilterSelect({ 
    value, 
    onChange, 
    options, 
    placeholder,
    className = '',
    width = 'w-48'
}: FilterSelectProps) {
    return (
        <div className={width}>
            <Select
                value={value}
                onChange={onChange}
                options={options}
                className={`h-9 ${className}`}
            />
        </div>
    );
}

