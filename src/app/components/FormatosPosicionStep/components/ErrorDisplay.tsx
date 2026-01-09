/**
 * Componente reutilizable para mostrar errores
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    errores: Record<string, string>;
    className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errores, className = '' }) => {
    if (Object.keys(errores).length === 0) {
        return null;
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {Object.entries(errores).map(([campo, mensaje]) => (
                <div
                    key={campo}
                    className="flex items-center gap-2 text-xs text-[var(--color-danger)]"
                >
                    <AlertCircle className="w-3 h-3" />
                    <span>{mensaje}</span>
                </div>
            ))}
        </div>
    );
};

