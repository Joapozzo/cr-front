/**
 * Sección del formulario para sistema de puntos
 * Componente presentacional sin lógica de negocio
 */
import Select, { SelectOption } from '@/app/components/ui/Select';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface SeccionPuntosProps {
    puntosVictoria: number;
    puntosEmpate: number;
    puntosDerrota: number;
    onChange: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
}

const puntosOptions: SelectOption[] = [
    { value: 0, label: '0 puntos' },
    { value: 1, label: '1 punto' },
    { value: 2, label: '2 puntos' },
    { value: 3, label: '3 puntos' },
    { value: 4, label: '4 puntos' },
    { value: 5, label: '5 puntos' },
];

export default function SeccionPuntos({
    puntosVictoria,
    puntosEmpate,
    puntosDerrota,
    onChange,
}: SeccionPuntosProps) {
    return (
        <>
            {/* Puntos Victoria */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[var(--white)] mb-1">
                    PUNTOS VICTORIA
                </label>
                <Select
                    options={puntosOptions}
                    value={puntosVictoria}
                    onChange={(value) => onChange("puntos_victoria", value as number)}
                    placeholder="Puntos por victoria"
                />
            </div>

            {/* Puntos Empate */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[var(--white)] mb-1">
                    PUNTOS EMPATE
                </label>
                <Select
                    options={puntosOptions}
                    value={puntosEmpate}
                    onChange={(value) => onChange("puntos_empate", value as number)}
                    placeholder="Puntos por empate"
                />
            </div>

            {/* Puntos Derrota */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[var(--white)] mb-1">
                    PUNTOS DERROTA
                </label>
                <Select
                    options={puntosOptions}
                    value={puntosDerrota}
                    onChange={(value) => onChange("puntos_derrota", value as number)}
                    placeholder="Puntos por derrota"
                />
            </div>
        </>
    );
}

