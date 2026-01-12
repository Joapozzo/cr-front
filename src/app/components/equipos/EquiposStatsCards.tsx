'use client';

import { Shield, Users, FileText, Ban, FileCheck } from 'lucide-react';

interface EquiposStatsCardsProps {
    totalEquipos: number;
    equiposActivos: number;
    equiposInactivos: number;
    totalJugadores: number;
    totalSolicitudes: number;
    jugadoresConFichaValida?: number;
    jugadoresSinFicha?: number;
}

export default function EquiposStatsCards({
    totalEquipos,
    equiposActivos,
    equiposInactivos,
    totalJugadores,
    totalSolicitudes,
    jugadoresConFichaValida,
    jugadoresSinFicha
}: EquiposStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                        <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Total Equipos</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {totalEquipos}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                        <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Activos</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {equiposActivos}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                        <Ban className="w-5 h-5 text-[var(--red)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Expulsados</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {equiposInactivos}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                        <Users className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Total jugadores</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {totalJugadores}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                        <FileText className="w-5 h-5 text-[var(--yellow)]" />
                    </div>
                    <div>
                        <p className="text-[var(--gray-100)] text-sm">Solicitudes</p>
                        <p className="text-[var(--white)] text-xl font-bold">
                            {totalSolicitudes}
                        </p>
                    </div>
                </div>
            </div>

            {jugadoresConFichaValida !== undefined && (
                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                            <FileCheck className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Fichas Válidas</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {jugadoresConFichaValida}
                            </p>
                            {jugadoresSinFicha !== undefined && jugadoresSinFicha > 0 && (
                                <p className="text-[var(--red)] text-xs mt-1">
                                    {jugadoresSinFicha} sin ficha
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

