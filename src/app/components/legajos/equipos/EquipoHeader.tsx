'use client';

import { ArrowLeft, Trophy, Users, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { EquipoInformacionBasica } from '@/app/types/legajos';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface EquipoHeaderProps {
    equipoInfo: EquipoInformacionBasica;
    onBack: () => void;
}

export const EquipoHeader = ({ equipoInfo, onBack }: EquipoHeaderProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-start gap-6">
                    <EscudoEquipo
                        src={equipoInfo.img}
                        alt={equipoInfo.nombre}
                        size={96}
                        className="rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-[var(--white)] mb-2">{equipoInfo.nombre}</h1>
                        {equipoInfo.descripcion && (
                            <p className="text-[var(--gray-100)] mb-4">{equipoInfo.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.categorias_activas} categorías
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.total_jugadores} jugadores
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.total_partidos} partidos
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
