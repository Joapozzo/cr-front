'use client';

import { Edit3, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface Equipo {
    id_equipo: number;
    nombre: string;
    descripcion?: string | null;
    img?: string | null;
}

interface EquipoHeaderProps {
    equipo: Equipo;
    apercibimientos: number;
    onEditEquipo: () => void;
    onApercibimientos: () => void;
}

export default function EquipoHeader({
    equipo,
    apercibimientos,
    onEditEquipo,
    onApercibimientos
}: EquipoHeaderProps) {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <EscudoEquipo
                        src={equipo.img}
                        alt={equipo.nombre}
                        width={64}
                        height={64}
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--white)]">
                            {equipo.nombre}
                        </h1>
                        {equipo.descripcion && (
                            <p className="text-[var(--gray-100)] text-sm mt-1">
                                {equipo.descripcion}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="success"
                        onClick={onApercibimientos}
                        className="flex items-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Apercibimientos ({apercibimientos || 0})
                    </Button>
                    <Button
                        variant="success"
                        onClick={onEditEquipo}
                        className="flex items-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Editar equipo
                    </Button>
                </div>
            </div>
        </div>
    );
}

