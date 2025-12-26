'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { usePlayerStore } from '@/app/stores/playerStore';
import Image from 'next/image';
import { useMemo } from 'react';
import { EquipoProvider, useEquipoSeleccionado } from './EquipoContext';
import { useEquiposUsuario } from '@/app/hooks/useEquiposUsuario';
import SelectGeneral from '@/app/components/ui/SelectGeneral';
import { SelectOption } from '@/app/components/ui/Select';

function EquipoLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { jugador, equipos } = usePlayerStore();
    const { equipoSeleccionado, setEquipoSeleccionado } = useEquipoSeleccionado();
    const { data: equiposUsuario } = useEquiposUsuario();

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
    
    // Usar equipo seleccionado del contexto, o el primero del store como fallback
    const equipoInfo = equipoSeleccionado || equipos?.[0];
    
    // Mapear equipos para el selector
    const equiposParaSelector = useMemo(() => {
        if (!equiposUsuario) return [];
        return equiposUsuario.map(eq => ({
            id_equipo: eq.id_equipo,
            nombre_equipo: eq.nombre_equipo,
            img_equipo: eq.img_equipo,
            id_categoria_edicion: eq.id_categoria_edicion,
            nombre_categoria: eq.nombre_categoria,
            id_edicion: eq.id_edicion,
            nombre_torneo: eq.nombre_torneo,
            temporada: eq.temporada,
            es_capitan: eq.es_capitan
        }));
    }, [equiposUsuario]);

    const formatSelectTeam = (): SelectOption[] => {
        return equiposParaSelector.map((eq) => ({
            value: eq.id_equipo.toString(),
            label: `${eq.nombre_equipo} ${eq.es_capitan ? '👑' : ''} - ${eq.nombre_categoria}`,
            image: eq.img_equipo || undefined,
            disabled: false
        }));
    };

    const handleCambiarEquipo = (nuevoIdEquipo: string | number) => {
        const nuevoEquipo = equiposUsuario?.find(eq => eq.id_equipo === Number(nuevoIdEquipo));
        if (nuevoEquipo) {
            setEquipoSeleccionado(nuevoEquipo);
        }
    };

    // Si no hay equipos, mostrar mensaje
    if (!equipos || equipos.length === 0) {
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
                        <span className="text-[var(--white)]">Mi equipo</span>
                    </div>
                </div>

                {/* Mensaje cuando no hay equipos */}
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center w-full max-w-md">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                                <svg 
                                    className="w-8 h-8 text-[#737373]" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                                    />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-white text-base font-medium">Todavía no tienes ningún equipo asignado</p>
                                <p className="text-[#737373] text-sm">Cuando te asignen a un equipo, aparecerá aquí</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <span className="text-[var(--white)]">Mi equipo</span>
                </div>
            </div>

            {/* Información del equipo */}
            <div className="bg-[var(--card-background)] border-b border-[var(--gray-300)] py-6">
                <div className="flex items-center space-x-4 max-w-[1400px] mx-auto px-10">
                    {/* Logo del equipo */}
                    <div className="relative">
                        {equipoInfo?.img_equipo ? (
                            <div className="w-16 h-16">
                                <Image
                                    src={equipoInfo.img_equipo}
                                    alt={equipoInfo.nombre_equipo}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-300)] flex items-center justify-center border-2 border-[var(--green)]">
                                <Shield className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                        )}
                    </div>

                    {/* Información del equipo */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            {equiposParaSelector.length > 1 ? (
                                <div className="flex-1 min-w-[200px] max-w-[400px]">
                                    <SelectGeneral
                                        options={formatSelectTeam()}
                                        onChange={handleCambiarEquipo}
                                        placeholder="Seleccionar equipo"
                                        showImages={true}
                                        size="md"
                                        value={equipoSeleccionado?.id_equipo.toString()}
                                    />
                                </div>
                            ) : (
                                <h1 className="text-lg md:text-xl font-bold text-[var(--white)] truncate">
                                    {equipoInfo?.nombre_equipo || 'Mi Equipo'}
                                </h1>
                            )}
                            {/* Badge de rol (Capitán/Jugador) */}
                            {equipoInfo && (
                                <>
                                    {equipoInfo.es_capitan ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-yellow-500 text-xs font-medium">Capitán</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--black-800)] border border-[#262626] rounded-lg">
                                            <svg className="w-4 h-4 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-[var(--green)] text-xs font-medium">Jugador</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
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

export default function EquipoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: equiposUsuario } = useEquiposUsuario();
    
    return (
        <EquipoProvider equiposUsuario={equiposUsuario}>
            <EquipoLayoutContent>
                {children}
            </EquipoLayoutContent>
        </EquipoProvider>
    );
}