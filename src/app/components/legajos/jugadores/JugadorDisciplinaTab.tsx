'use client';

import { HistorialDisciplinarioJugador } from '@/app/types/legajos';
import { Shield, AlertTriangle, Ban } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface JugadorDisciplinaTabProps {
    disciplina: HistorialDisciplinarioJugador | undefined;
    isLoading: boolean;
    categoriaSeleccionada?: number | undefined;
}

// Helper para obtener el nombre de la categoría
const obtenerNombreCategoria = (
    resumen: { id_categoria_edicion: number; nombre_categoria?: string | null },
    disciplina: HistorialDisciplinarioJugador
): string => {
    // Si el backend ya proporciona el nombre, usarlo directamente
    if (resumen.nombre_categoria) {
        return resumen.nombre_categoria;
    }
    
    // Fallback: buscar en amonestaciones o expulsiones
    const todasLasReferencias = [
        ...disciplina.amonestaciones.map(a => a.partido?.categoria_edicion).filter(Boolean),
        ...disciplina.expulsiones.map(e => e.partido?.categoria_edicion).filter(Boolean)
    ];
    
    const categoriaEdicion = todasLasReferencias.find(
        (cat) => cat?.id_categoria_edicion === resumen.id_categoria_edicion
    );
    
    if (categoriaEdicion) {
        const { categoria, edicion } = categoriaEdicion;
        const partesNombre: string[] = [];
        
        if (categoria.division) {
            partesNombre.push(categoria.division);
        }
        
        if (categoria.nombre) {
            if (partesNombre.length > 0) {
                partesNombre.push(`- ${categoria.nombre}`);
            } else {
                partesNombre.push(categoria.nombre);
            }
        }
        
        const nombreCategoria = partesNombre.join(' ');
        
        if (nombreCategoria) {
            return edicion.nombre 
                ? `${nombreCategoria} (${edicion.nombre})`
                : nombreCategoria;
        }
    }
    
    // Último fallback
    return `Categoría #${resumen.id_categoria_edicion}`;
};

export const JugadorDisciplinaTab = ({
    disciplina,
    isLoading,
}: JugadorDisciplinaTabProps) => {
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

    if (!disciplina) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay información disciplinaria disponible</p>
        );
    }

    return (
        <div className="space-y-6">
            {/* Resumen por categoría */}
            {disciplina.resumen_por_categoria.length > 0 && (
                <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Resumen por categoría</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {disciplina.resumen_por_categoria.map((resumen, idx) => (
                            <div key={idx} className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                                <p className="text-xs text-[var(--gray-100)] mb-3">{obtenerNombreCategoria(resumen, disciplina)}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--gray-100)]">Amarillas:</span>
                                        <span className="text-[var(--white)] font-semibold">{resumen.total_amarillas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--gray-100)]">Rojas:</span>
                                        <span className="text-[var(--color-secondary)] font-semibold">{resumen.total_rojas}</span>
                                    </div>
                                    {resumen.sanciones_vigentes > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[var(--gray-100)]">Sanciones Vigentes:</span>
                                            <span className="text-[var(--color-secondary)] font-semibold">{resumen.sanciones_vigentes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Amonestaciones */}
            {disciplina.amonestaciones.length > 0 && (
                <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-[var(--yellow)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Amonestaciones ({disciplina.amonestaciones.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {disciplina.amonestaciones.map((amonestacion) => (
                            <div
                                key={amonestacion.id_amonestacion}
                                className="bg-[var(--gray-400)] rounded-lg border border-[var(--yellow)]/30 p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {amonestacion.partido && (
                                            <>
                                                <p className="text-[var(--white)] font-semibold mb-1">
                                                    Jornada {amonestacion.partido.jornada}
                                                </p>
                                                <p className="text-sm text-[var(--gray-100)] mb-2">
                                                    {amonestacion.partido.equipos.local} vs {amonestacion.partido.equipos.visita}
                                                </p>
                                                {amonestacion.partido.categoria_edicion && (
                                                    <p className="text-xs text-[var(--gray-100)]">
                                                        {amonestacion.partido.categoria_edicion.categoria.nombre} - {amonestacion.partido.categoria_edicion.edicion.nombre}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {amonestacion.minuto && (
                                            <p className="text-sm text-[var(--white)] font-semibold">
                                                Min {amonestacion.minuto}&apos;
                                            </p>
                                        )}
                                        {amonestacion.fecha && (
                                            <p className="text-xs text-[var(--gray-100)]">
                                                {new Date(amonestacion.fecha).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expulsiones */}
            {disciplina.expulsiones.length > 0 && (
                <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Ban className="w-5 h-5 text-[var(--color-secondary)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Expulsiones ({disciplina.expulsiones.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {disciplina.expulsiones.map((expulsion) => (
                            <div
                                key={expulsion.id_expulsion}
                                className="bg-[var(--gray-400)] rounded-lg border border-[var(--color-secondary)]/30 p-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        {expulsion.partido && (
                                            <>
                                                <p className="text-[var(--white)] font-semibold mb-1">
                                                    Jornada {expulsion.partido.jornada}
                                                </p>
                                                <p className="text-sm text-[var(--gray-100)] mb-2">
                                                    {expulsion.partido.equipos.local} vs {expulsion.partido.equipos.visita}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {expulsion.minuto && (
                                            <p className="text-sm text-[var(--white)] font-semibold">
                                                Min {expulsion.minuto}&apos;
                                            </p>
                                        )}
                                        {expulsion.fecha && (
                                            <p className="text-xs text-[var(--gray-100)]">
                                                {new Date(expulsion.fecha).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {expulsion.motivo && (
                                    <div className="mt-3 pt-3 border-t border-[var(--gray-300)]">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Motivo:</p>
                                        <p className="text-[var(--white)]">{expulsion.motivo}</p>
                                    </div>
                                )}
                                {expulsion.fechas_sancion.total > 0 && (
                                    <div className="mt-3 pt-3 border-t border-[var(--gray-300)]">
                                        <p className="text-sm text-[var(--gray-100)]">
                                            Sanción: {expulsion.fechas_sancion.total} fechas
                                            {expulsion.fechas_sancion.restantes > 0 && (
                                                <span className="text-[var(--color-secondary)] ml-2">
                                                    ({expulsion.fechas_sancion.restantes} restantes)
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {disciplina.amonestaciones.length === 0 && disciplina.expulsiones.length === 0 && (
                <p className="text-[var(--gray-100)] text-center py-8">No hay registros disciplinarios</p>
            )}
        </div>
    );
};

