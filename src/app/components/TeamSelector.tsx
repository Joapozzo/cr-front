'use client';

import Select, { SelectOption } from '@/app/components/ui/Select';

import { Shield } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';

export default function TeamSelector() {
    const { equipos, equipoSeleccionado, setEquipoSeleccionado } = usePlayerStore();

    if (equipos.length === 0) {
        return null;
    }

    if (equipos.length === 1) {
        const team = equipos[0];
        return (
            <div className="w-full mb-6 px-6">
                <div className="bg-[var(--gray-400)] text-white rounded-[20px] px-6 py-4 pointer-events-none">
                    <div className="flex items-center gap-2">
                        {team.img_equipo ? (
                            <img
                                src={team.img_equipo}
                                alt={team.nombre_equipo}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        ) : (
                            <Shield size={30} className="text-[var(--green)]" />
                        )}
                        <div className="flex flex-col">
                            <span className="text-xs text-[var(--green)]">Equipo actual</span>
                            <span className="text-xl font-medium text-[var(--green)]">
                                {team.nombre_equipo}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Si hay múltiples equipos, mostrar select
    const options: SelectOption[] = equipos.map(team => ({
        value: `${team.id_equipo}-${team.id_categoria_edicion}`,
        label: `${team.nombre_equipo} - ${team.nombre_categoria}`,
        image: team.img_equipo || undefined,
    }));

    const selectedValue = equipoSeleccionado
        ? `${equipoSeleccionado.id_equipo}-${equipoSeleccionado.id_categoria_edicion}`
        : undefined;

    const handleChange = (value: string | number) => {
        const [id_equipo, id_categoria_edicion] = String(value).split('-').map(Number);
        const team = equipos.find(
            t => t.id_equipo === id_equipo && t.id_categoria_edicion === id_categoria_edicion
        );
        if (team) {
            setEquipoSeleccionado(team);
        }
    };

    return (
        <div className="w-full mb-6">
            <label className="block text-sm font-medium text-[var(--gray-100)] mb-2">
                Seleccionar equipo
            </label>
            <Select
                options={options}
                value={selectedValue}
                onChange={handleChange}
                placeholder="Seleccionar equipo..."
                showImages={true}
                bgColor="bg-[var(--gray-400)]"
            />
        </div>
    );
}