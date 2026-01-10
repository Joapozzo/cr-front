/**
 * Sección del formulario para tiempos de juego
 * Componente presentacional sin lógica de negocio
 */
import { Input } from '@/app/components/ui/Input';
import Select, { SelectOption } from '@/app/components/ui/Select';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface SeccionTiemposProps {
    tipoFutbol: number;
    duracionTiempo: number;
    duracionEntretiempo: number;
    onChange: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
}

const tipoFutbolOptions: SelectOption[] = [
    { value: 5, label: 'Fútbol 5' },
    { value: 7, label: 'Fútbol 7' },
    { value: 11, label: 'Fútbol 11' },
];

export default function SeccionTiempos({
    tipoFutbol,
    duracionTiempo,
    duracionEntretiempo,
    onChange,
}: SeccionTiemposProps) {
    return (
        <>
            {/* Tipo de fútbol */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[var(--white)] mb-1">
                    TIPO DE FÚTBOL
                </label>
                <Select
                    options={tipoFutbolOptions}
                    value={tipoFutbol}
                    onChange={(value) => onChange("tipo_futbol", value as number)}
                    placeholder="Seleccionar tipo"
                />
            </div>

            {/* Duración Tiempo */}
            <Input
                label="DURACIÓN DE CADA TIEMPO (minutos)"
                value={duracionTiempo}
                onChange={(e) => onChange('duracion_tiempo', Number(e.target.value))}
                placeholder="Minutos por tiempo"
                type="number"
            />

            {/* Duración Entretiempo */}
            <Input
                label="DURACIÓN DEL ENTRETIEMPO (minutos)"
                value={duracionEntretiempo}
                onChange={(e) => onChange('duracion_entretiempo', Number(e.target.value))}
                placeholder="Minutos de entretiempo"
                type="number"
            />
        </>
    );
}

