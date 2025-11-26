/**
 * Componente de select para filtros
 */
'use client';

interface FilterSelectOption {
    value: string | number;
    label: string;
}

interface FilterSelectProps {
    label: string;
    value: string | number | undefined;
    onChange: (value: string | number | undefined) => void;
    options: FilterSelectOption[];
    placeholder?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Todos',
}) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--white)]">
                {label}
            </label>
            <select
                value={value || ''}
                onChange={(e) => {
                    const newValue = e.target.value;
                    onChange(newValue === '' ? undefined : newValue);
                }}
                className="block w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-transparent"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

