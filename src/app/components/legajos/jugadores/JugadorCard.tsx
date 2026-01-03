/**
 * Card de jugador para el grid de legajos
 */
'use client';

import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { JugadorBusqueda } from '@/app/types/legajos';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface JugadorCardProps {
    jugador: JugadorBusqueda;
}

export const JugadorCard: React.FC<JugadorCardProps> = ({ jugador }) => {
    const getEstadoColor = () => {
        switch (jugador.estado) {
            case 'A':
                return 'bg-[var(--green)] text-[var(--white)]';
            case 'E':
                return 'bg-[var(--red)] text-[var(--white)]';
            case 'I':
            default:
                return 'bg-[var(--gray-300)] text-[var(--gray-100)]';
        }
    };

    const getEstadoTexto = () => {
        switch (jugador.estado) {
            case 'A':
                return 'Activo';
            case 'E':
                return 'Expulsado';
            case 'I':
            default:
                return 'Inactivo';
        }
    };

    const estaExpulsado = jugador.estado === 'E';

    return (
        <Link
            href={`/adm/legajos/jugadores/${jugador.id_jugador}`}
            className="group block"
        >
            <div className={`bg-[var(--gray-400)] border rounded-lg p-4 hover:shadow-md transition-shadow h-[140px] relative ${
                estaExpulsado 
                    ? 'border-[var(--red)] hover:border-[var(--red)] opacity-90' 
                    : 'border-[var(--gray-300)] hover:border-[var(--green)]'
            }`}>
                {/* Badge de estado en la esquina superior izquierda */}
                <span className={`absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium z-20 ${getEstadoColor()}`}>
                    {getEstadoTexto()}
                </span>

                {/* Escudos de equipos en la esquina superior derecha - sueltos */}
                {jugador.equipos_actuales.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                        {jugador.equipos_actuales.map((equipo, index) => (
                            <div
                                key={equipo.id_equipo}
                                style={{ zIndex: jugador.equipos_actuales.length - index }}
                            >
                                <EscudoEquipo
                                    src={equipo.img}
                                    alt={equipo.nombre}
                                    size={32}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-start gap-4 pr-12 h-full">
                    {/* Foto del jugador */}
                    <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-300)]">
                            <ImagenPublica
                                src={jugador.img}
                                alt={`${jugador.nombre} ${jugador.apellido}`}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-full"
                                fallbackIcon={<User className="h-8 w-8 text-[var(--gray-100)]" />}
                            />
                        </div>
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 h-full">
                        <h3 className={`text-sm font-semibold leading-tight break-words ${estaExpulsado ? 'text-[var(--red)]' : 'text-[var(--white)]'}`}>
                            {jugador.nombre_completo}
                        </h3>
                        
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
                    </div>

                    {/* Botón ver legajo */}
                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-5 w-5 text-[var(--gray-100)] group-hover:text-[var(--green)]" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

