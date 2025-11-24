/**
 * Card de jugador para el grid de legajos
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { JugadorBusqueda } from '@/app/types/legajos';

interface JugadorCardProps {
    jugador: JugadorBusqueda;
}

export const JugadorCard: React.FC<JugadorCardProps> = ({ jugador }) => {
    const estadoColor = jugador.estado === 'A' 
        ? 'bg-[var(--green)] text-[var(--white)]'
        : 'bg-[var(--gray-300)] text-[var(--gray-100)]';

    return (
        <Link
            href={`/adm/legajos/jugadores/${jugador.id_jugador}`}
            className="group block"
        >
            <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4 hover:shadow-md transition-shadow hover:border-[var(--primary)]">
                <div className="flex items-start gap-4">
                    {/* Foto del jugador */}
                    <div className="flex-shrink-0">
                        {jugador.img ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-300)]">
                                <Image
                                    src={jugador.img}
                                    alt={`${jugador.nombre} ${jugador.apellido}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
                                <User className="h-8 w-8 text-[var(--gray-100)]" />
                            </div>
                        )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--white)] truncate">
                            {jugador.nombre_completo}
                        </h3>
                        
                        <div className="mt-1 space-y-1">
                            {jugador.dni && (
                                <p className="text-sm text-[var(--gray-100)]">
                                    DNI: {jugador.dni}
                                </p>
                            )}
                            
                            {jugador.posicion && (
                                <p className="text-sm text-[var(--gray-100)]">
                                    {jugador.posicion.nombre}
                                </p>
                            )}

                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoColor}`}>
                                {jugador.estado === 'A' ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        {jugador.equipos_actuales.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-[var(--gray-100)]">
                                    {jugador.equipos_actuales.length === 1
                                        ? jugador.equipos_actuales[0].nombre
                                        : `${jugador.equipos_actuales.length} equipos`
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botón ver legajo */}
                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-5 w-5 text-[var(--gray-100)] group-hover:text-[var(--primary)]" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

