'use client';

import { AlertTriangle } from 'lucide-react';

export const EdicionEstadoAlert = () => {
    return (
        <div className="p-4 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--blue)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-[var(--blue)] mb-1">
                        Edición terminada
                    </h4>
                    <p className="text-xs text-[var(--gray-100)]">
                        Esta edición ha sido terminada. No se pueden realizar cambios en la configuración.
                    </p>
                </div>
            </div>
        </div>
    );
};

