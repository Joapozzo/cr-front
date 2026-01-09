'use client';

import { User } from 'lucide-react';

interface Estadisticas {
    total_jugadores: number;
    capitanes?: number;
    jugadores_eventuales: number;
    jugadores_sancionados: number;
}

interface EquipoStatsCardsProps {
    estadisticas: Estadisticas;
}

export default function EquipoStatsCards({ estadisticas }: EquipoStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                        <User className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Total jugadores</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {estadisticas.total_jugadores}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                        <User className="w-5 h-5 text-[var(--yellow)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Capitanes</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {estadisticas.capitanes || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--blue)]/20 rounded-lg">
                        <User className="w-5 h-5 text-[var(--blue)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Eventuales</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {estadisticas.jugadores_eventuales}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                        <User className="w-5 h-5 text-[var(--red)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Sancionados</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {estadisticas.jugadores_sancionados}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

