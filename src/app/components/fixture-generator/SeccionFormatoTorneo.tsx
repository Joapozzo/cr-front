'use client';

import RadioButton from '../ui/RadioButton';

interface SeccionFormatoTorneoProps {
    formatoTorneo: 'ida' | 'ida-vuelta';
    onFormatoChange: (formato: 'ida' | 'ida-vuelta') => void;
}

export default function SeccionFormatoTorneo({
    formatoTorneo,
    onFormatoChange
}: SeccionFormatoTorneoProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--white)] mb-2">
                Formato del torneo
            </label>
            <div className="flex gap-4">
                <RadioButton
                    name="formato"
                    value="ida"
                    checked={formatoTorneo === 'ida'}
                    onChange={() => onFormatoChange('ida')}
                    label="Ida solamente"
                />
                <RadioButton
                    name="formato"
                    value="ida-vuelta"
                    checked={formatoTorneo === 'ida-vuelta'}
                    onChange={() => onFormatoChange('ida-vuelta')}
                    label="Ida y vuelta"
                />
            </div>
        </div>
    );
}

