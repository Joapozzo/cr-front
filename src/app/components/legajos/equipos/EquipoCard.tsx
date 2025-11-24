/**
 * Card de equipo para el grid de legajos
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { EquipoBusqueda } from '@/app/types/legajos';

interface EquipoCardProps {
    equipo: EquipoBusqueda;
}

export const EquipoCard: React.FC<EquipoCardProps> = ({ equipo }) => {
    return (
        <Link
            href={`/admin/legajos/equipos/${equipo.id_equipo}`}
            className="group block"
        >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-500 dark:hover:border-blue-400">
                <div className="flex items-start gap-4">
                    {/* Logo del equipo */}
                    <div className="flex-shrink-0">
                        {equipo.img ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <Image
                                    src={equipo.img}
                                    alt={equipo.nombre}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {equipo.nombre}
                        </h3>
                        
                        <div className="mt-2 space-y-2">
                            {equipo.categorias.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {equipo.categorias.slice(0, 2).map((cat, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        >
                                            {cat.categoria.nombre || cat.edicion.nombre}
                                        </span>
                                    ))}
                                    {equipo.categorias.length > 2 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            +{equipo.categorias.length - 2}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>{equipo.total_jugadores} jugador{equipo.total_jugadores !== 1 ? 'es' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botón ver legajo */}
                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

