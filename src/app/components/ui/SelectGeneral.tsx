'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { URI_IMG } from './utils';

export interface SelectOption {
    value: string | number;
    label: string;
    image?: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    showImages?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const SelectGeneral: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    disabled = false,
    className = "",
    showImages = false,
    size = 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
        if (!disabled) {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Clases según el tamaño
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-4 py-3 text-sm rounded-xl',
        lg: 'px-6 py-4 text-sm rounded-2xl'
    };

    const imageSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div
            ref={selectRef}
            className={`relative ${className}`}
            style={{ width: 'fit-content' }}
        >
            {/* Header seleccionado */}
            <div
                onClick={toggleOpen}
                className={`
                    flex items-center justify-between 
                    bg-[var(--gray-400)] text-white 
                    ${sizeClasses[size]}
                    cursor-pointer transition-all duration-200
                    min-w-[140px]
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2a2a2a]'}
                    ${isOpen ? 'ring-2 ring-[var(--green)]' : ''}
                `}
            >
                <div className="flex items-center gap-2">
                    {showImages && selectedOption?.image && (
                        <img
                            src={URI_IMG + selectedOption.image}
                            alt={selectedOption.label}
                            className={`${imageSizeClasses[size]} rounded-full object-cover`}
                        />
                    )}
                    <span className="font-medium whitespace-nowrap">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>

                <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                />
            </div>

            {/* Lista de opciones */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 z-50 min-w-[200px]">
                    <ul className={`
                        bg-[#1e1e1e] rounded-lg 
                        max-h-[300px] overflow-y-auto
                        shadow-lg border border-[#333]
                        scrollbar-thin scrollbar-thumb-[#555] scrollbar-track-[#2a2a2a]
                    `}>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => !option.disabled && handleSelect(option.value)}
                                className={`
                                    flex items-center gap-2 px-4 py-3
                                    text-sm text-white transition-colors duration-200
                                    ${option.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer hover:bg-[#333]'
                                    }
                                    ${option.value === value ? 'bg-[#333] text-[var(--green)]' : ''}
                                `}
                            >
                                {showImages && option.image && (
                                    <img
                                        src={URI_IMG + option.image}
                                        alt={option.label}
                                        className={`${imageSizeClasses[size]} rounded-full object-cover`}
                                    />
                                )}
                                <span>{option.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectGeneral;