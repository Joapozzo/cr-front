/**
 * Componente de búsqueda reutilizable
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onClear?: () => void;
    debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    onClear,
    debounceMs = 300,
}) => {
    const [localValue, setLocalValue] = useState(value);
    const prevValueRef = React.useRef<string>(value);
    const onChangeRef = React.useRef(onChange);

    // Mantener onChange actualizado
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        // Solo llamar onChange si el valor realmente cambió
        if (localValue !== prevValueRef.current) {
            const timer = setTimeout(() => {
                onChangeRef.current(localValue);
                prevValueRef.current = localValue;
            }, debounceMs);

            return () => clearTimeout(timer);
        }
    }, [localValue, debounceMs]);

    useEffect(() => {
        // Solo actualizar localValue si el prop value cambió externamente
        if (value !== prevValueRef.current) {
            setLocalValue(value);
            prevValueRef.current = value;
        }
    }, [value]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
        onClear?.();
    };

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--gray-100)]" />
            </div>
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--gray-100)] hover:text-[var(--white)]"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

