'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { FormDataValue } from './ModalAdmin';

interface HelperColorPickerProps {
    value?: string | null;
    onChange?: (name: string, value: FormDataValue) => void;
    error?: string;
}

const HelperColorPicker = ({ value, onChange, error }: HelperColorPickerProps) => {
    const colorValue = value || '#3B82F6'; // Color por defecto

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        onChange?.('color', newColor || null);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value || null;
        onChange?.('color', newColor);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--white)] mb-2">
                COLOR PERSONALIZADO
                <span className="text-[var(--gray-100)] text-xs ml-2">(Opcional)</span>
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={colorValue}
                    onChange={handleColorChange}
                    className="w-16 h-10 rounded-lg cursor-pointer border border-[var(--gray-300)] bg-[var(--gray-400)]"
                />
                <Input
                    value={colorValue}
                    onChange={handleTextChange}
                    placeholder="#3B82F6"
                    type="text"
                    className="flex-1"
                    error={error}
                />
            </div>
            <p className="text-xs text-[var(--gray-100)] mt-1">
                Selecciona un color hexadecimal para personalizar la categoría
            </p>
        </div>
    );
};

export default HelperColorPicker;

