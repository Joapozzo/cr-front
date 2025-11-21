'use client';

import Switch from '../ui/Switch';
import { Usuario } from '@/app/types/user';

interface SeccionPlanilleroProps {
    autocompletarPlanillero: boolean;
    planilleros: Usuario[];
    onToggleAutocompletar: (checked: boolean) => void;
}

export default function SeccionPlanillero({
    autocompletarPlanillero,
    planilleros,
    onToggleAutocompletar
}: SeccionPlanilleroProps) {
    return (
        <div>
            <label className="flex items-center mb-3">
                <Switch
                    checked={autocompletarPlanillero}
                    onChange={onToggleAutocompletar}
                />
                <span className="ml-2 text-sm font-medium text-[var(--white)]">
                    Autocompletar planillero
                </span>
            </label>
            {autocompletarPlanillero && (
                <div className="mt-2 p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                    <p className="text-xs text-[var(--gray-100)]">
                        Los partidos se repartirán automáticamente entre {planilleros.length} planillero(s) disponible(s)
                    </p>
                </div>
            )}
        </div>
    );
}

