/**
 * Sección del formulario para personalización (color)
 * Componente presentacional sin lógica de negocio
 */
import { Input } from '@/app/components/ui/Input';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface SeccionPersonalizacionProps {
    color: string | null | undefined;
    onChange: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
}

export default function SeccionPersonalizacion({
    color,
    onChange,
}: SeccionPersonalizacionProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-[var(--white)] mb-1">
                COLOR PERSONALIZADO
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={color || '#2AD174'}
                    onChange={(e) => onChange('color', e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer border border-[var(--gray-300)] bg-[var(--gray-400)]"
                />
                <Input
                    value={color || ''}
                    onChange={(e) => onChange('color', e.target.value || null)}
                    placeholder="#2AD174"
                    type="text"
                    className="flex-1"
                />
            </div>
            <p className="text-xs text-[var(--gray-100)] mt-1">
                Selecciona un color hexadecimal para personalizar la categoría
            </p>
        </div>
    );
}

