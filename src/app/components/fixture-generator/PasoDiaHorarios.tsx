'use client';

import { DateInput, TimeInput } from '../ui/Input';
import Select from '../ui/Select';
import { GenerarFixtureInput, PreviewFecha } from '@/app/types/fixture-generator';

const DIAS_SEMANA = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

interface Cancha {
    id_cancha: number;
    nombre: string;
    predio?: {
        nombre: string;
    };
    tipo_futbol?: number | null;
}

interface Predio {
    id_predio: number;
    nombre: string;
}

interface PasoDiaHorariosProps {
    formData: Partial<GenerarFixtureInput>;
    previewFechas: PreviewFecha[];
    fechaInicioValida: boolean;
    canchas: Cancha[];
    loadingCanchas: boolean;
    predios: Predio[];
    loadingPredios: boolean;
    idPredioSeleccionado?: number;
    onFormDataChange: (field: keyof GenerarFixtureInput, value: string | number | boolean | undefined) => void;
    onToggleCancha: (id_cancha: number) => void;
    onPredioChange: (id_predio: number) => void;
}

export default function PasoDiaHorarios({
    formData,
    previewFechas,
    fechaInicioValida,
    canchas,
    loadingCanchas,
    predios,
    loadingPredios,
    idPredioSeleccionado,
    onFormDataChange,
    onToggleCancha,
    onPredioChange
}: PasoDiaHorariosProps) {
    return (
        <div className="space-y-6">
            {/* Día de la semana */}
            <div>
                <Select
                    label="Día de juego"
                    value={formData.dia_semana?.toString() || ''}
                    onChange={(value) => onFormDataChange('dia_semana', typeof value === 'string' ? parseInt(value, 10) : value)}
                    options={DIAS_SEMANA.map(d => ({
                        value: d.value.toString(),
                        label: d.label
                    }))}
                />
            </div>

            {/* Fecha de inicio */}
            <div>
                <DateInput
                    label="Fecha de inicio"
                    value={formData.fecha_inicio || ''}
                    onChange={(e) => onFormDataChange('fecha_inicio', e.target.value)}
                    error={!fechaInicioValida && formData.fecha_inicio ? 'La fecha seleccionada no coincide con el día de la semana elegido' : undefined}
                />
            </div>

            {/* Preview de fechas */}
            {previewFechas.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        Preview de próximas fechas
                    </label>
                    <div className="space-y-2">
                        {previewFechas.map((fecha, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]"
                            >
                                <p className="text-sm text-[var(--white)]">
                                    <strong>Fecha {idx + 1}:</strong> {fecha.fecha} - {fecha.diaSemana}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Predio */}
            <div>
                <Select
                    label="Seleccionar Predio"
                    value={idPredioSeleccionado?.toString() || ''}
                    onChange={(value) => onPredioChange(typeof value === 'string' ? parseInt(value, 10) : value)}
                    options={predios.map(p => ({
                        value: p.id_predio.toString(),
                        label: p.nombre
                    }))}
                    placeholder="Seleccione un predio"
                />
            </div>

            {/* Canchas */}
            {idPredioSeleccionado && (
                <div>
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        Seleccionar Canchas
                    </label>
                    {loadingCanchas ? (
                        <p className="text-[var(--gray-100)]">Cargando canchas...</p>
                    ) : canchas.length === 0 ? (
                        <p className="text-[var(--red)]">No hay canchas disponibles en este predio</p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {canchas.map((cancha) => (
                                <label
                                    key={cancha.id_cancha}
                                    className="flex items-center p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] cursor-pointer hover:border-[var(--green)] transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.canchas_seleccionadas?.includes(cancha.id_cancha) || false}
                                        onChange={() => onToggleCancha(cancha.id_cancha)}
                                        className="mr-3 w-4 h-4"
                                    />
                                    <div className="flex-1">
                                        <p className="text-[var(--white)] font-medium">
                                            {cancha.nombre}
                                        </p>
                                        <p className="text-xs text-[var(--gray-100)]">
                                            {cancha.predio?.nombre || 'Sin predio'} - Fútbol {cancha.tipo_futbol || 'N/A'}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4">
                <TimeInput
                    label="Hora inicio"
                    value={formData.hora_inicio || ''}
                    onChange={(e) => onFormDataChange('hora_inicio', e.target.value)}
                />
                <TimeInput
                    label="Hora fin"
                    value={formData.hora_fin || ''}
                    onChange={(e) => onFormDataChange('hora_fin', e.target.value)}
                />
            </div>
        </div>
    );
}

