'use client';

import Switch from '../ui/Switch';
import Select from '../ui/Select';
import RadioButton from '../ui/RadioButton';
import Tooltip from '../ui/Tooltip';

interface ZonaElegible {
    id_zona: number;
    nombre: string;
    cantidad_equipos: number;
}

interface SeccionInterzonalesProps {
    incluirInterzonales: boolean;
    distribucionInterzonales: 'concentrada' | 'distribuida';
    posicionInterzonales?: 'inicio' | 'medio' | 'fin' | number;
    zonasSeleccionadas: number[];
    zonasElegibles: ZonaElegible[];
    totalFechasFixture: number; // Total de fechas calculadas del fixture
    onToggleInterzonales: (checked: boolean) => void;
    onDistribucionChange: (value: 'concentrada' | 'distribuida') => void;
    onPosicionChange: (value: 'inicio' | 'medio' | 'fin' | number) => void;
}

export default function SeccionInterzonales({
    incluirInterzonales,
    distribucionInterzonales,
    posicionInterzonales,
    zonasSeleccionadas,
    zonasElegibles,
    totalFechasFixture,
    onToggleInterzonales,
    onDistribucionChange,
    onPosicionChange
}: SeccionInterzonalesProps) {
    // Obtener nombres de las zonas seleccionadas
    const zonasSeleccionadasInfo = zonasElegibles.filter(z => zonasSeleccionadas.includes(z.id_zona));
    const puedeIncluirInterzonales = zonasSeleccionadas.length >= 2;

    return (
        <div>
            <label className="flex items-center mb-3">
                <Switch
                    checked={incluirInterzonales}
                    onChange={onToggleInterzonales}
                    disabled={!puedeIncluirInterzonales}
                />
                <span className={`ml-2 text-sm font-medium ${puedeIncluirInterzonales ? 'text-[var(--white)]' : 'text-[var(--gray-100)]'}`}>
                    Incluir partidos interzonales
                </span>
            </label>
            {!puedeIncluirInterzonales && (
                <p className="text-xs text-[var(--gray-100)] mt-1 ml-8">
                    Se requieren al menos 2 zonas seleccionadas para generar interzonales
                </p>
            )}
            {incluirInterzonales && puedeIncluirInterzonales && (
                <div className="mt-3 space-y-3">
                    <div className="p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                        <p className="text-xs text-[var(--white)] mb-1">
                            <strong>Zonas seleccionadas para interzonales:</strong>
                        </p>
                        <ul className="text-xs text-[var(--gray-100)] list-disc list-inside">
                            {zonasSeleccionadasInfo.map(z => (
                                <li key={z.id_zona}>{z.nombre} ({z.cantidad_equipos} equipos)</li>
                            ))}
                        </ul>
                        <p className="text-xs text-[var(--gray-100)] mt-2">
                            Se generarán partidos entre todas las zonas seleccionadas
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-sm font-medium text-[var(--white)]">
                                Distribución de interzonales
                            </label>
                            <Tooltip content="Distribuida: 1 o 2 partidos interzonales por fecha, distribuidos equitativamente a lo largo del fixture. Concentrada: TODOS los partidos interzonales se jugarán en una sola fecha específica." />
                        </div>
                        <div className="flex gap-4">
                            <RadioButton
                                name="distribucion"
                                value="distribuida"
                                checked={distribucionInterzonales === 'distribuida'}
                                onChange={() => onDistribucionChange('distribuida')}
                                label="Distribuida"
                            />
                            <RadioButton
                                name="distribucion"
                                value="concentrada"
                                checked={distribucionInterzonales === 'concentrada'}
                                onChange={() => onDistribucionChange('concentrada')}
                                label="Concentrada"
                            />
                        </div>
                        {distribucionInterzonales === 'concentrada' && (
                            <div className="mt-4">
                                <Select
                                    label="Fecha para partidos interzonales"
                                    value={typeof posicionInterzonales === 'number' 
                                        ? posicionInterzonales.toString() 
                                        : (posicionInterzonales || 'inicio')}
                                    onChange={(value) => {
                                        // Si es un número, es una jornada específica
                                        if (!isNaN(Number(value))) {
                                            onPosicionChange(Number(value));
                                        } else {
                                            onPosicionChange(value as 'inicio' | 'medio' | 'fin');
                                        }
                                    }}
                                    options={[
                                        ...Array.from({ length: totalFechasFixture }, (_, i) => ({
                                            value: (i + 1).toString(),
                                            label: `Jornada ${i + 1}`
                                        }))
                                    ]}
                                    className="max-w-[250px]"
                                />
                                <p className="text-xs text-[var(--gray-100)] mt-2">
                                    Total de fechas del fixture: {totalFechasFixture}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

