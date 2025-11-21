'use client';

import Switch from '../ui/Switch';

interface SeccionFechaLibreProps {
    permitirFechaLibre: boolean;
    fechaLibreHabilitada: boolean;
    incluirInterzonales: boolean;
    onToggleFechaLibre: (checked: boolean) => void;
}

export default function SeccionFechaLibre({
    permitirFechaLibre,
    fechaLibreHabilitada,
    incluirInterzonales,
    onToggleFechaLibre
}: SeccionFechaLibreProps) {
    return (
        <div>
            <label className="flex items-center mb-3">
                <Switch
                    checked={permitirFechaLibre}
                    onChange={onToggleFechaLibre}
                    disabled={!fechaLibreHabilitada}
                />
                <span className={`ml-2 text-sm font-medium ${fechaLibreHabilitada ? 'text-[var(--white)]' : 'text-[var(--gray-100)]'}`}>
                    Permitir fecha libre
                </span>
            </label>
            {!fechaLibreHabilitada && (
                <p className="text-xs text-[var(--gray-100)] mt-1">
                    Esta opción solo está disponible cuando hay equipos impares
                </p>
            )}
            {fechaLibreHabilitada && permitirFechaLibre && (
                <div className="mt-2 p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                    <p className="text-sm text-[var(--white)]">
                        {incluirInterzonales
                            ? 'Se asignará fecha libre rotativamente entre todas las zonas seleccionadas'
                            : 'Se asignará fecha libre rotativamente en las zonas con equipos impares'}
                    </p>
                </div>
            )}
        </div>
    );
}

