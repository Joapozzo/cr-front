'use client';

import { useState } from 'react';
import { TablaPosiciones } from '@/app/types/legajos';
import PlayoffBracket from '@/app/components/playoff/PlayoffBracket';
import { Zona } from '@/app/types/zonas';
import { Award, Trophy } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoTablaTabProps {
    tabla: TablaPosiciones | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
    idEquipo: number;
}

export const EquipoTablaTab = ({ tabla, isLoading, categoriaSeleccionada, idEquipo }: EquipoTablaTabProps) => {
    const [tabActivo, setTabActivo] = useState<'posiciones' | 'playoff'>('posiciones');

    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver la tabla</p>
        );
    }

    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <Skeleton height={200} borderRadius={6} />
            </SkeletonTheme>
        );
    }

    if (!tabla) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar la tabla</p>
        );
    }

    // Separar zonas de todos contra todos (tipo 1 y 3) y eliminación directa (tipo 2 y 4)
    // 1: todos-contra-todos
    // 2: eliminacion-directa
    // 3: todos-contra-todos-ida-vuelta
    // 4: eliminacion-directa-ida-vuelta
    const zonasTodosContraTodos = tabla.tablas.filter(t => {
        const tipo = t.zona.tipo;
        // Tipo 1 (todos-contra-todos) y tipo 3 (todos-contra-todos-ida-vuelta)
        return tipo === '1' || tipo === '3' || !tipo;
    });

    const zonasEliminacionDirecta = tabla.tablas.filter(t => {
        const tipo = t.zona.tipo;
        // Solo tipo 2 (eliminacion-directa) y tipo 4 (eliminacion-directa-ida-vuelta)
        return tipo === '2' || tipo === '4';
    });

    // Convertir zonas de eliminación directa al formato de PlayoffBracket
    const zonasParaBracket: Zona[] = zonasEliminacionDirecta.map(tablaZona => ({
        id_zona: tablaZona.zona.id_zona,
        nombre: tablaZona.zona.nombre,
        numero_fase: tablaZona.zona.fase || 0,
        id_categoria_edicion: categoriaSeleccionada,
        etapa: {
            id_etapa: 0,
            nombre: tablaZona.zona.nombre || '',
        },
        partidos: [], // Los partidos vendrían del backend si están disponibles
        temporadas: [],
    } as Zona));

    return (
        <div className="space-y-6">
            {/* Tabs: Posiciones vs Playoff */}
            <div className="border-b border-[var(--gray-300)]">
                <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setTabActivo('posiciones')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${tabActivo === 'posiciones'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                            }
                        `}
                    >
                        <Award className="w-4 h-4" />
                        Posiciones
                    </button>
                    <button
                        onClick={() => setTabActivo('playoff')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${tabActivo === 'playoff'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                            }
                        `}
                    >
                        <Trophy className="w-4 h-4" />
                        Playoff
                    </button>
                </nav>
            </div>

            {/* Contenido según tab activo */}
            {tabActivo === 'posiciones' ? (
                <div className="space-y-6">
                    {/* Tablas de todos contra todos */}
                    {zonasTodosContraTodos.length > 0 ? (
                        <>
                            <h2 className="text-xl font-bold text-[var(--white)] mb-4">Tabla de posiciones</h2>
                            {zonasTodosContraTodos.map((tablaZona, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[var(--white)]">
                                        {tablaZona.zona.nombre}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[var(--gray-300)]">
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Pos</th>
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Equipo</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">PJ</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">G</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">E</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">P</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">GF</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">GC</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">DG</th>
                                                    <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tablaZona.tabla.map((equipo, index) => (
                                                    <tr
                                                        key={equipo.equipo.id_equipo}
                                                        className={`border-b border-[var(--gray-300)] ${equipo.equipo.id_equipo === idEquipo
                                                                ? 'bg-[var(--color-primary)]/20'
                                                                : ''
                                                            }`}
                                                    >
                                                        <td className="py-2 px-4 text-[var(--white)] font-semibold">{index + 1}</td>
                                                        <td className="py-2 px-4 text-[var(--white)]">{equipo.equipo.nombre}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.partidos_jugados}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--color-primary)]">{equipo.ganados}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--yellow)]">{equipo.empatados}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--color-secondary)]">{equipo.perdidos}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.goles_favor}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.goles_contra}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.diferencia_goles}</td>
                                                        <td className="py-2 px-4 text-center text-[var(--color-primary)] font-bold">{equipo.puntos}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-[var(--gray-100)] text-center py-8">No hay tablas de posiciones disponibles</p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Bracket de eliminación directa (SOLO PLAYOFF) */}
                    {zonasEliminacionDirecta.length > 0 ? (
                        <>
                            <h2 className="text-xl font-bold text-[var(--white)] mb-4">Playoff - Eliminación Directa</h2>
                            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                                <PlayoffBracket zonas={zonasParaBracket} />
                            </div>
                        </>
                    ) : (
                        <p className="text-[var(--gray-100)] text-center py-8">No hay partidos de playoff disponibles</p>
                    )}
                </div>
            )}
        </div>
    );
};

