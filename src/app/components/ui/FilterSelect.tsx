'use client';

import Select from './Select';

interface FilterSelectOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string | number) => void;
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
    placeholder: _placeholder,
    className = '',
    width = 'w-48'
}: FilterSelectProps) {
    return (
        <div className={width}>
            <Select
                value={value}
                onChange={(val) => onChange(typeof val === 'string' ? val : String(val))}
                options={options}
                className={`h-9 ${className}`}
            />
        </div>
    );
}

