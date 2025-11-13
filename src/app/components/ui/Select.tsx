// components/ui/Select.tsx

'use client';

import React, { useState, forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface SelectOption {
    value: string | number;
    label: string;
    image?: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    showImages?: boolean;
    bgColor?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ 
        options, 
        value, 
        onChange, 
        placeholder = "Seleccionar...", 
        disabled = false, 
        className = "",
        label,
        error,
        showImages = false,
        bgColor = "bg-[var(--gray-400)]",
        ...props 
    }, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newValue = e.target.value;
            const parsedValue = !isNaN(Number(newValue)) && newValue !== '' 
                ? Number(newValue) 
                : newValue;
            onChange(parsedValue);
            setIsOpen(false);
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        {label}
                    </label>
                )}
                
                <div className="relative group z-[999]">
                    <select
                        ref={ref}
                        value={value ?? ''}
                        onChange={handleChange}
                        disabled={disabled}
                        onMouseDown={() => setIsOpen(prev => !prev)} // ✅ Cambiado
                        onBlur={() => setIsOpen(false)}
                        className={clsx(
                            'w-full px-6 py-4 pr-10 rounded-[20px] font-medium transition-all duration-200 appearance-none',
                            'focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:shadow-lg',
                            bgColor,
                            'text-white hover:bg-[#2a2a2a]',
                            disabled && 'opacity-50 cursor-not-allowed hover:bg-[var(--gray-400)]',
                            error && 'ring-2 ring-[var(--red)] focus:ring-[var(--red)]',
                            'relative cursor-pointer',
                            className
                        )}
                        style={{ 
                            position: 'relative',
                        }}
                        {...props}
                    >
                        <option value="" className="bg-[#1e1e1e] text-white py-3">
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                disabled={option.disabled}
                                className="bg-[#1e1e1e] text-white py-3 hover:bg-[#333] cursor-pointer"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    
                    <div className={clsx(
                        'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300',
                        isOpen && 'rotate-180',
                        disabled && 'opacity-50'
                    )}>
                        <ChevronDown className="w-4 h-4 text-white" />
                    </div>
                </div>

                {error && (
                    <p className="text-[var(--red)] text-xs mt-1.5 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;