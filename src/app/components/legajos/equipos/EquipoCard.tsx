'use client';

import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { EquipoBusqueda } from '@/app/types/legajos';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface EquipoCardProps {
    equipo: EquipoBusqueda;
}

export const EquipoCard: React.FC<EquipoCardProps> = ({ equipo }) => {
    return (
        <Link
            href={`/adm/legajos/equipos/${equipo.id_equipo}`}
            className="group block"
        >
            <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4 hover:shadow-md transition-shadow hover:border-[var(--color-primary)] min-h-[130px]">
                <div className="flex items-start gap-4">
                    {/* Logo del equipo */}
                    <div className="flex-shrink-0">
                        <EscudoEquipo
                            src={equipo.img}
                            alt={equipo.nombre}
                            size={64}
                            className="rounded-lg"
                        />
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--white)] truncate">
                            {equipo.nombre}
                        </h3>
                        
                        <div className="mt-2 space-y-2">
                            {equipo.categorias.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {equipo.categorias.slice(0, 2).map((cat, idx) => {
                                        const color = cat.color;
                                        const bgColor = color || 'var(--color-primary)';
                                        
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-[var(--white)]"
                                                style={{
                                                    backgroundColor: bgColor
                                                }}
                                            >
                                                {cat.categoria.nombre || cat.edicion.nombre}
                                            </span>
                                        );
                                    })}
                                    {equipo.categorias.length > 2 && (
                                        <span className="text-xs text-[var(--gray-100)]">
                                            +{equipo.categorias.length - 2}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-[var(--gray-100)]">
                                <Users className="h-4 w-4" />
                                <span>{equipo.total_jugadores} jugador{equipo.total_jugadores !== 1 ? 'es' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botón ver legajo */}
                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-5 w-5 text-[var(--gray-100)] group-hover:text-[var(--color-primary)]" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

