'use client';

import { useState, useMemo } from 'react';
import { Edit2, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CanchaConPredio } from '@/app/types/predios';
import { usePartidosPorCanchaYFecha } from '@/app/hooks/useCanchas';
import { formatearHora } from '@/app/utils/formated';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface PartidoOcupado {
    id_partido: number;
    hora: string;
    dia: string | Date;
    jornada?: number;
    id_categoria_edicion?: number;
    categoriaEdicion?: {
        id_categoria_edicion?: number;
        edicion?: {
            id_edicion?: number;
        };
    };
    equipoLocal?: {
        nombre: string;
        img?: string | null;
    };
    equipoVisita?: {
        nombre: string;
        img?: string | null;
    };
    estado: string;
    goles_local?: number | null;
    goles_visita?: number | null;
}

interface CardCanchaProps {
    cancha: CanchaConPredio;
    partidosOcupados?: PartidoOcupado[];
    onEdit?: (cancha: CanchaConPredio) => void;
    onDelete?: (cancha: CanchaConPredio) => void;
    isAvailable?: boolean;
    fechaVisualizacion?: string; // Fecha para mostrar ocupación
}


// Función para formatear tipo_futbol a string
const formatearTipoFutbol = (tipoFutbol?: number | null): string => {
    if (!tipoFutbol) return 'Fútbol 11';
    return `Fútbol ${tipoFutbol}`;
};

const CardCancha: React.FC<CardCanchaProps> = ({
    cancha,
    partidosOcupados = [],
    onEdit,
    onDelete,
    isAvailable = true,
    fechaVisualizacion
}) => {
    const tipoFutbol = formatearTipoFutbol(cancha.tipo_futbol);
    const [showMenu, setShowMenu] = useState(false);
    
    // Obtener partidos de la cancha para la fecha seleccionada
    const fechaParaQuery = fechaVisualizacion || new Date().toISOString().split('T')[0];
    const { data: partidosData = [], isLoading: cargandoPartidos } = usePartidosPorCanchaYFecha(
        cancha.id_cancha,
        fechaParaQuery,
        false // No incluir pasados por defecto
    );

    // Combinar partidos pasados como props con los obtenidos del hook
    const partidosFinales = useMemo(() => {
        let partidos: PartidoOcupado[] = [];
        
        if (partidosData.length > 0) {
            partidos = partidosData.map(p => ({
                id_partido: p.id_partido,
                hora: p.hora || '',
                dia: p.dia || new Date(),
                jornada: p.jornada,
                id_categoria_edicion: p.id_categoria_edicion || p.categoriaEdicion?.id_categoria_edicion,
                categoriaEdicion: p.categoriaEdicion,
                equipoLocal: p.equipoLocal ? {
                    nombre: p.equipoLocal.nombre,
                    img: p.equipoLocal.img
                } : undefined,
                equipoVisita: p.equipoVisita ? {
                    nombre: p.equipoVisita.nombre,
                    img: p.equipoVisita.img
                } : undefined,
                estado: p.estado,
                goles_local: p.goles_local,
                goles_visita: p.goles_visita
            }));
        } else if (partidosOcupados.length > 0) {
            partidos = partidosOcupados;
        }
        
        // Ordenar por hora de menor a mayor (de arriba hacia abajo)
        partidos.sort((a, b) => {
            const horaA = a.hora || '00:00';
            const horaB = b.hora || '00:00';
            return horaA.localeCompare(horaB);
        });
        
        // Limitar a máximo 5 partidos para mostrar
        return partidos.slice(0, 5);
    }, [partidosData, partidosOcupados]);

    // Solo considerar ocupada si tiene 5 o más partidos
    const isOcupada = partidosFinales.length >= 5;

    // Determinar color de borde según disponibilidad
    const getBorderColor = () => {
        if (!isAvailable) return 'border-red-500/50 hover:border-red-500';
        if (isOcupada) return 'border-red-500/50 hover:border-red-500';
        if (partidosFinales.length === 0) return 'border-[var(--gray-300)] hover:border-[var(--gray-200)]';
        return 'border-green-500/50 hover:border-green-500';
    };

    const getHeaderBg = () => {
        if (!isAvailable) return 'bg-red-500/10';
        if (isOcupada) return 'bg-red-500/10';
        if (partidosFinales.length === 0) return 'bg-[var(--gray-300)]/10';
        return 'bg-green-500/10';
    };

    const getCanchaColor = () => {
        if (!isAvailable || isOcupada) return '#ef4444';
        if (partidosFinales.length === 0) return '#6b7280'; // Gris
        return '#4ade80'; // Verde
    };

    return (
        <div className={`relative bg-[var(--gray-400)] border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${getBorderColor()}`}>
            {/* Header de la cancha */}
            <div className={`p-4 border-b border-[var(--gray-300)] ${getHeaderBg()}`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-[var(--white)]">
                                {cancha.nombre}
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--gray-300)] text-[var(--gray-100)]">
                                {tipoFutbol}
                            </span>
                            {!isAvailable && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                                    Inactiva
                                </span>
                            )}
                            {isOcupada && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                                    Ocupada
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-[var(--gray-100)]">
                            {cancha.predio?.nombre || 'Sin predio'}
                        </p>
                    </div>
                    {/* Menu de acciones */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-[var(--gray-100)]" />
                        </button>
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-40 bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg shadow-xl z-20">
                                    {onEdit && (
                                        <button
                                            onClick={() => {
                                                onEdit(cancha);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-[var(--white)] hover:bg-[var(--gray-300)] flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => {
                                                onDelete(cancha);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[var(--gray-300)] flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* SVG de cancha de fútbol */}
            <div className="relative h-48 overflow-hidden bg-transparent">
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 320 250"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Solo líneas del campo - sin background */}
                    {/* Líneas del campo */}
                    <g stroke={getCanchaColor()} strokeWidth="2.5" fill="none">
                        {/* Perímetro */}
                        <rect x="10" y="10" width="300" height="230" rx="2" />

                        {/* Línea central */}
                        <line x1="10" y1="125" x2="310" y2="125" />

                        {/* Círculo central */}
                        <circle cx="160" cy="125" r="30" />
                        <circle cx="160" cy="125" r="2" fill="currentColor" />

                        {/* Área grande superior */}
                        <rect x="110" y="10" width="100" height="35" />

                        {/* Área chica superior */}
                        <rect x="135" y="10" width="50" height="18" />

                        {/* Área grande inferior */}
                        <rect x="110" y="205" width="100" height="35" />

                        {/* Área chica inferior */}
                        <rect x="135" y="222" width="50" height="18" />

                        {/* Semicírculo área superior (apuntando hacia abajo) */}
                        <path d="M 135 45 A 12 12 0 0 0 185 45" />

                        {/* Semicírculo área inferior */}
                        <path d="M 135 205 A 12 12 0 0 1 185 205" />

                        {/* Punto de penal superior */}
                        <circle cx="160" cy="28" r="1.5" fill="currentColor" />

                        {/* Punto de penal inferior */}
                        <circle cx="160" cy="222" r="1.5" fill="currentColor" />

                        {/* Corners */}
                        <path d="M 10 235 A 5 5 0 0 1 15 240" />
                        <path d="M 305 240 A 5 5 0 0 1 310 235" />
                        <path d="M 10 15 A 5 5 0 0 0 15 10" />
                        <path d="M 305 10 A 5 5 0 0 0 310 15" />
                    </g>
                </svg>

                {/* Partidos - Mostrar encima de la cancha en esquina superior izquierda */}
                {!cargandoPartidos && partidosFinales.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                        {partidosFinales.map((partido) => {
                            // Construir URL del fixture
                            const id_edicion = partido.categoriaEdicion?.edicion?.id_edicion;
                            const id_categoria_edicion = partido.id_categoria_edicion || partido.categoriaEdicion?.id_categoria_edicion;
                            const jornada = partido.jornada;
                            
                            // Solo crear link si tenemos los datos necesarios
                            const fixtureUrl = id_edicion && id_categoria_edicion && jornada
                                ? `/adm/ediciones/${id_edicion}/${id_categoria_edicion}/fixture?jornada=${jornada}`
                                : null;

                            const partidoContent = (
                                <div
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                                        fixtureUrl 
                                            ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 hover:border-green-500 cursor-pointer' 
                                            : 'bg-[var(--black-900)]/90 backdrop-blur-sm border-[var(--gray-300)]/30'
                                    }`}
                                >
                                    {/* Escudo Local */}
                                    <EscudoEquipo
                                        src={partido.equipoLocal?.img}
                                        alt={partido.equipoLocal?.nombre || 'Equipo Local'}
                                        size={20}
                                        className="flex-shrink-0"
                                    />
                                    
                                    {/* Hora */}
                                    <span className="text-xs font-medium text-[var(--white)] min-w-[40px] text-center">
                                        {formatearHora(partido.hora) || '--:--'}
                                    </span>
                                    
                                    {/* Escudo Visitante */}
                                    <EscudoEquipo
                                        src={partido.equipoVisita?.img}
                                        alt={partido.equipoVisita?.nombre || 'Equipo Visitante'}
                                        size={20}
                                        className="flex-shrink-0"
                                    />
                                </div>
                            );

                            return fixtureUrl ? (
                                <Link key={partido.id_partido} href={fixtureUrl}>
                                    {partidoContent}
                                </Link>
                            ) : (
                                <div key={partido.id_partido}>
                                    {partidoContent}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Indicador de estado con contador */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    !isAvailable || isOcupada
                        ? 'bg-red-500/80 text-white'
                        : partidosFinales.length === 0
                            ? 'bg-[var(--gray-400)]/80 text-[var(--gray-100)]'
                            : 'bg-green-500/80 text-white'
                }`}>
                    {!isAvailable ? 'Inactiva' : partidosFinales.length === 0 ? 'Disponible' : `${partidosFinales.length}/5 ${isOcupada ? 'Ocupada' : 'Disponible'}`}
                </div>

                {/* Loading state - Mostrar en la esquina si está cargando */}
                {cargandoPartidos && (
                    <div className="absolute top-2 left-2 z-20">
                        <div className="bg-[var(--black-900)]/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-[var(--gray-300)]/30">
                            <Loader2 className="w-4 h-4 animate-spin text-[var(--green)]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardCancha;

