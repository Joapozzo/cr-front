/**
 * Sección del formulario para configuración de mercado de pases
 * Componente presentacional sin lógica de negocio
 */
import { Input } from '@/app/components/ui/Input';
import Switch from '@/app/components/ui/Switch';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface SeccionMercadoProps {
    fechaInicio: string;
    fechaFin: string;
    limiteCambios: number | null | undefined;
    recambio: boolean | null | undefined;
    onChange: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
}

export default function SeccionMercado({
    fechaInicio,
    fechaFin,
    limiteCambios,
    recambio,
    onChange,
}: SeccionMercadoProps) {
    return (
        <>
            {/* Fecha de inicio mercado */}
            <Input
                label="FECHA DE INICIO DEL MERCADO"
                value={fechaInicio || ''}
                onChange={(e) => onChange('fecha_inicio_mercado', e.target.value)}
                placeholder="Fecha de inicio del mercado"
                type="date"
            />

            {/* Fecha de fin mercado */}
            <Input
                label="FECHA DE FIN DEL MERCADO"
                value={fechaFin || ''}
                onChange={(e) => onChange('fecha_fin_mercado', e.target.value)}
                placeholder="Fecha de fin del mercado"
                type="date"
            />

            {/* Límite de cambios */}
            <Input
                label="LÍMITE DE CAMBIOS"
                value={limiteCambios ?? ''}
                onChange={(e) => onChange('limite_cambios', e.target.value ? Number(e.target.value) : null)}
                placeholder="Límite de cambios"
                type="number"
                min="0"
            />

            {/* Recambio */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[var(--white)] mb-1">
                    RECAMBIO
                </label>
                <div className="flex items-center gap-3">
                    <Switch
                        checked={recambio ?? false}
                        onChange={(checked) => onChange('recambio', checked)}
                    />
                    <span className="text-[var(--gray-100)] text-sm">
                        {recambio ? 'Permitido' : 'No permitido'}
                    </span>
                </div>
            </div>
        </>
    );
}

