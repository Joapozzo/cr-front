'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { usePlayerStore } from '@/app/stores/playerStore';
import Image from 'next/image';
import { useMemo } from 'react';

export default function EquipoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { jugador, equipos } = usePlayerStore();

    const edicionesDisponibles = useMemo(() => {
        if (!equipos || equipos.length === 0) {
            return [];
        }

        // Crear un Map para obtener ediciones únicas (por id_edicion)
        const edicionesMap = new Map();

        equipos.forEach(team => {
            if (!edicionesMap.has(team.id_edicion)) {
                edicionesMap.set(team.id_edicion, {
                    id_edicion: team.id_edicion,
                    nombre_torneo: team.nombre_torneo,
                    temporada: team.temporada
                });
            }
        });

        // Convertir a array y ordenar por temporada descendente
        return Array.from(edicionesMap.values())
            .sort((a, b) => b.temporada - a.temporada);
    }, [equipos]);

    const edicionActual = edicionesDisponibles[0];

    const isActiveTab = (id_edicion: number) => {
        if (pathname === '/miequipo') {
            return id_edicion === edicionActual?.id_edicion;
        }
        return pathname === `/miequipo/${id_edicion}`;
    };
    const equipoInfo = equipos[0];

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            {/* Header con breadcrumb */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] py-4">
                <div className="flex items-center space-x-2 max-w-[1400px] mx-auto px-10">
                    <Link
                        href="/"
                        className="flex items-center text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Inicio
                    </Link>
                    <span className="text-[var(--gray-100)]">/</span>
                    <span className="text-[var(--white)]">Mi Equipo</span>
                </div>
            </div>

            {/* Información del equipo */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] py-6">
                <div className="flex items-center space-x-4 max-w-[1400px] mx-auto px-10">
                    {/* Logo del equipo */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-300)] flex items-center justify-center border-2 border-[var(--green)]">
                            {equipoInfo?.img_equipo ? (
                                <Image
                                    src={equipoInfo.img_equipo}
                                    alt={equipoInfo.nombre_equipo}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Shield className="w-8 h-8 text-[var(--gray-100)]" />
                            )}
                        </div>
                    </div>

                    {/* Información del equipo */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg md:text-xl font-bold text-[var(--white)] truncate">
                            {equipoInfo?.nombre_equipo || 'Mi Equipo'}
                        </h1>
                        <p className="text-sm text-[var(--gray-100)] truncate">
                            {jugador?.nombre} {jugador?.apellido}
                        </p>
                        {edicionesDisponibles.length > 0 && (
                            <p className="text-xs text-[var(--green)] mt-1">
                                {edicionesDisponibles.length} {edicionesDisponibles.length === 1 ? 'torneo' : 'torneos'} participado{edicionesDisponibles.length === 1 ? '' : 's'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Navegación por años - Responsive */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] sticky top-0 z-10">
                {edicionesDisponibles.length > 0 ? (
                    <>
                        {/* Mobile: Scroll horizontal */}
                        <nav className="flex md:hidden overflow-x-auto scrollbar-hide px-10">
                            {edicionesDisponibles.map((edicion) => (
                                <Link
                                    key={edicion.id_edicion}
                                    href={edicion.id_edicion === edicionActual?.id_edicion ? '/mi-equipo' : `/mi-equipo/${edicion.id_edicion}`}
                                    className={`
                flex-shrink-0 py-3 px-6 flex items-center justify-center
                transition-colors border-b-2 text-sm font-semibold
                ${isActiveTab(edicion.id_edicion)
                                            ? 'border-[var(--green)] text-[var(--green)]'
                                            : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                        }
            `}
                                >
                                    {edicion.nombre_torneo} {edicion.temporada}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop: Distribución uniforme */}
                        <nav className="hidden md:flex">
                            {edicionesDisponibles.map((edicion) => (
                                <Link
                                    key={edicion.id_edicion}
                                    href={edicion.id_edicion === edicionActual?.id_edicion ? '/mi-equipo' : `/mi-equipo/${edicion.id_edicion}`}
                                    className={`
                flex-1 py-4 flex items-center justify-center
                transition-colors border-b-2 text-base font-semibold
                ${isActiveTab(edicion.id_edicion)
                                            ? 'border-[var(--green)] text-[var(--green)]'
                                            : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                        }
            `}
                                >
                                    {edicion.nombre_torneo} {edicion.temporada}
                                </Link>
                            ))}
                        </nav>
                    </>
                ) : (
                    <div className="py-4 text-center text-[var(--gray-100)] text-sm">
                        No hay torneos disponibles
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 max-w-[1400px] mx-auto">
                {children}
            </div>

            {/* Estilos para ocultar scrollbar */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}