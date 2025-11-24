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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <select
                value={value || ''}
                onChange={(e) => {
                    const newValue = e.target.value;
                    onChange(newValue === '' ? undefined : newValue);
                }}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

