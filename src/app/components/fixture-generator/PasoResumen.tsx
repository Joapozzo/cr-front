'use client';

import { GenerarFixtureInput } from '@/app/types/fixture-generator';

const DIAS_SEMANA = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

interface PasoResumenProps {
    formData: Partial<GenerarFixtureInput>;
}

export default function PasoResumen({ formData }: PasoResumenProps) {
    return (
        <div className="space-y-4">
            <div className="p-4 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                <h3 className="font-semibold text-[var(--white)] mb-3">Resumen del Fixture</h3>
                <div className="space-y-2 text-sm">
                    <p className="text-[var(--white)]">
                        <strong>Zonas seleccionadas:</strong>{' '}
                        {formData.zonas_seleccionadas?.length || 0}
                    </p>
                    <p className="text-[var(--white)]">
                        <strong>Formato:</strong>{' '}
                        {formData.formato_torneo === 'ida' ? 'Ida solamente' : 'Ida y vuelta'}
                    </p>
                    {formData.incluir_interzonales && (
                        <p className="text-[var(--white)]">
                            <strong>Interzonales:</strong> Sí
                        </p>
                    )}
                    <p className="text-[var(--white)]">
                        <strong>Canchas:</strong> {formData.canchas_seleccionadas?.length || 0}
                    </p>
                    <p className="text-[var(--white)]">
                        <strong>Día de juego:</strong>{' '}
                        {DIAS_SEMANA.find(d => d.value === formData.dia_semana)?.label}
                    </p>
                </div>
            </div>
            <div className="p-4 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                <p className="text-sm text-[var(--gray-100)]">
                    Al confirmar, se generarán todos los partidos del fixture según la configuración seleccionada.
                </p>
            </div>
        </div>
    );
}

