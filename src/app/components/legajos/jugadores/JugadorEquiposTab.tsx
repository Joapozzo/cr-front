'use client';

import { HistorialEquiposJugador } from '@/app/types/legajos';
import { Trophy, Users, Calendar } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface JugadorEquiposTabProps {
    equipos: HistorialEquiposJugador[] | undefined;
    isLoading: boolean;
}

export const JugadorEquiposTab = ({ equipos, isLoading }: JugadorEquiposTabProps) => {
    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={6} />
                    <Skeleton height={200} borderRadius={6} />
                </div>
            </SkeletonTheme>
        );
    }

    if (!equipos || equipos.length === 0) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay equipos registrados</p>
        );
    }

    return (
        <div className="space-y-6">
            {equipos.map((edicion, idx) => (
                <div key={idx} className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-bold text-[var(--white)]">
                            {edicion.edicion.nombre} - Temporada {edicion.temporada}
                        </h3>
                    </div>
                    {edicion.categorias.map((categoria, catIdx) => (
                        <div key={catIdx} className="mb-4 last:mb-0">
                            <h4 className="text-md font-semibold text-[var(--white)] mb-3">
                                {categoria.categoria.nombre || 'Categoría'} {categoria.categoria.division && `- ${categoria.categoria.division}`}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoria.planteles.map((plantel, plantelIdx) => (
                                    <div
                                        key={plantelIdx}
                                        className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4 hover:border-[var(--color-primary)] transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <EscudoEquipo
                                                src={plantel.equipo.img}
                                                alt={plantel.equipo.nombre}
                                                size={64}
                                                className="rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h5 className="text-[var(--white)] font-semibold mb-2">{plantel.equipo.nombre}</h5>
                                                <div className="flex flex-wrap gap-3 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            plantel.tipo === 'eventual' 
                                                                ? 'bg-[var(--yellow)]/20 text-[var(--yellow)] border border-[var(--yellow)]/30'
                                                                : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                                                        }`}>
                                                            {plantel.tipo === 'eventual' ? 'Eventual' : 'Titular'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            plantel.estado === 'activo'
                                                                ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                                                                : 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                                                        }`}>
                                                            {plantel.estado === 'activo' ? 'Activo' : 'Baja'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[var(--gray-100)]">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{plantel.partidos_jugados} partidos</span>
                                                    </div>
                                                </div>
                                                {plantel.fecha_adicion && (
                                                    <p className="text-xs text-[var(--gray-100)] mt-2">
                                                        Adicionado: {new Date(plantel.fecha_adicion).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

