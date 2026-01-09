/**
 * Componente reutilizable para selección de color
 */

import React from 'react';
import { COLORES_PREDEFINIDOS } from '../constants';

interface ColorSelectorProps {
    colorSeleccionado: string;
    onColorChange: (color: string) => void;
    label?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
    colorSeleccionado,
    onColorChange,
    label,
}) => {
    return (
        <div>
            {label && (
                <label className="text-xs text-[var(--gray-100)] mb-2 block">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-3">
                {COLORES_PREDEFINIDOS.map((color) => (
                    <button
                        key={color.hex}
                        type="button"
                        onClick={() => onColorChange(color.hex)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                            colorSeleccionado === color.hex
                                ? 'border-[var(--white)] scale-110'
                                : 'border-[var(--gray-300)] hover:border-[var(--gray-200)]'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.nombre}
                    />
                ))}
            </div>
        </div>
    );
};

