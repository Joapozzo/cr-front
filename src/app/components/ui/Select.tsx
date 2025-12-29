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
                
                <div className="relative group z-[90]">
                    <select
                        ref={ref}
                        value={value ?? ''}
                        onChange={handleChange}
                        disabled={disabled}
                        onMouseDown={() => setIsOpen(prev => !prev)} // ✅ Cambiado
                        onBlur={() => setIsOpen(false)}
                        className={clsx(
                            'w-full h-9 px-4 pr-10 rounded-[20px] font-medium transition-all duration-200 appearance-none',
                            'border border-[#2D2F30]',
                            'bg-[#1A1A1A] text-[#fafafa]',
                            'focus:outline-none focus:ring-2 focus:ring-[#2AD174] focus:border-transparent',
                            'hover:border-[#3D3F40]',
                            disabled && 'opacity-50 cursor-not-allowed',
                            error && 'border-[#EF4444] focus:ring-[#EF4444]',
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