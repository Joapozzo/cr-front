import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import { EstadoPartido, IncidenciaGol, PartidoCompleto } from '@/app/types/partido';
import { formatNombreJugador, formatTime } from '@/app/utils/cardPartido.helper';
import BotoneraPartido from '../ButtonContainer';
import { getEstadoInfo } from '@/app/utils/partido.helper';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { TiempoPartido } from '../common/TiempoPartido';
import { estaEnVivo } from '@/app/utils/tiempoPartido.helper';
import ModalPenales from '../modals/ModalPenales';
import { useRegistroPenales } from '@/app/hooks/useRegistroPenales';
// import { useAuthStore } from '@/app/stores/authStore';
import { Button } from '../ui/Button';
import { PiSoccerBallFill } from 'react-icons/pi';

interface CanchaObject {
    nombre: string;
    id_cancha?: number;
    predio?: {
        nombre: string;
    };
}

interface PartidoHeaderStickyProps {
    partido: PartidoCompleto;
    goles?: IncidenciaGol[];
    esPlanillero?: boolean;
    onEmpezarPartido?: () => void;
    onTerminarPrimerTiempo?: () => void;
    onEmpezarSegundoTiempo?: () => void;
    onTerminarPartido?: () => void;
    onFinalizarPartido?: () => void;
    
    onSuspenderPartido?: () => void;
    isLoading?: boolean;
    cronometro?: {
        fase: 'PT' | 'HT' | 'ST' | 'ET';
        tiempoFormateado: string;
        shouldShowAdicional: boolean;
        tiempoAdicional: number;
    };
    isLoadingButton?: boolean;
}

const PartidoHeaderSticky: React.FC<PartidoHeaderStickyProps> = ({
    partido,
    goles = [],
    esPlanillero = false,
    onEmpezarPartido,
    onTerminarPrimerTiempo,
    onEmpezarSegundoTiempo,
    onTerminarPartido,
    onFinalizarPartido,
    onSuspenderPartido,
    isLoading,
    cronometro,
    isLoadingButton
}) => {
    const [isModalPenalesOpen, setIsModalPenalesOpen] = useState(false);

    const { registrarPenales, isLoading: isLoadingPenales } = useRegistroPenales({
        idPartido: partido?.id_partido || 0,
        onSuccess: () => {
            setIsModalPenalesOpen(false);
        }
    });

    if (!partido) {
        return null;
    }

    // Validaciones para mostrar botón de penales
    const puedeRegistrarPenales = () => {
        if (!esPlanillero) return false;
        if (!partido || partido.estado !== 'T') return false;
        if (partido.goles_local !== partido.goles_visita) return false;
        if (!partido.zona || !partido.zona.id_tipo_zona) return false;
        const idTipoZona = partido.zona.id_tipo_zona;
        return idTipoZona === 2 || idTipoZona === 4;
    };

    const mostrarBotonPenales = puedeRegistrarPenales();

    const mostrarResultado = !['P', 'A'].includes(partido.estado);

    const golesLocal = goles.filter(g => g.id_equipo === partido.equipoLocal?.id_equipo);
    const golesVisita = goles.filter(g => g.id_equipo === partido.equipoVisita?.id_equipo);

    // Formatear fecha en formato DD/MM/AA
    const formatDateShort = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    // Obtener nombre de cancha de forma segura
    const getNombreCancha = (): string => {
        // Verificar si cancha es un objeto (viene del backend con datos completos)
        if (typeof partido.cancha === 'object' && partido.cancha !== null) {
            // Verificar si tiene propiedad 'nombre'
            if ('nombre' in partido.cancha) {
                const canchaObj = partido.cancha as CanchaObject;
                return canchaObj.nombre || 'Por definir';
            }
            // Si es un objeto pero no tiene 'nombre', intentar acceder a otras propiedades
            const canchaObj = partido.cancha as Record<string, unknown>;
            if (canchaObj.nombre && typeof canchaObj.nombre === 'string') {
                return canchaObj.nombre;
            }
        }
        // Si es string, usarlo directamente
        if (typeof partido.cancha === 'string') {
            return partido.cancha;
        }
        // Si es number, formatearlo
        if (typeof partido.cancha === 'number') {
            return `Cancha ${partido.cancha}`;
        }
        // Verificar si hay datos de cancha en otras propiedades (para planillero)
        const partidoExt = partido as PartidoCompleto & { canchaData?: { nombre?: string; id_cancha?: number } };
        if (partidoExt.canchaData?.nombre) {
            return partidoExt.canchaData.nombre;
        }
        if (partidoExt.canchaData?.id_cancha) {
            return `Cancha ${partidoExt.canchaData.id_cancha}`;
        }
        return 'Por definir';
    };

    return (
        <div className="bg-[var(--black-900)] border-b border-t border-[#262626] overflow-hidden rounded-xl">
            {/* Header - Categoría */}
            <div className="bg-[var(--black-800)] px-6 py-3 border-b border-[#262626] rounded-t-xl">
                <div className="flex items-center justify-center gap-6 text-xs text-[#737373]">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar size={12} />
                        <span>Jornada {partido.jornada}</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                        <Calendar size={12} />
                        <span>{formatDateShort(partido.dia as string)}</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <MapPin size={12} />
                        <span>{getNombreCancha()}</span>
                    </div>
                </div>
            </div>

            {/* Info del partido */}
            <div className="px-6 py-4 space-y-4">
                {/* Línea 1: Tiempo/Estado */}
                <div className="flex justify-center">
                    {(estaEnVivo(partido.estado as EstadoPartido) || (partido.estado === 'T' && esPlanillero)) ? (
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1. bg-[var(--green)] rounded-md animate-pulse">
                                {cronometro && cronometro.fase ? (
                                    <span className="text-white font-medium text-xs">
                                        {cronometro.fase} {cronometro.tiempoFormateado}
                                        {cronometro.shouldShowAdicional && cronometro.tiempoAdicional > 0 && (
                                            <span className="text-red"> +{cronometro.tiempoAdicional}</span>
                                        )}
                                    </span>
                                ) : (
                                    <TiempoPartido
                                        estado={partido.estado as EstadoPartido}
                                        partidoId={partido.id_partido}
                                        showCronometro={false}
                                        size="md"
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getEstadoInfo(partido.estado as EstadoPartido).bg} ${getEstadoInfo(partido.estado as EstadoPartido).color} border border-white/10 backdrop-blur-sm`}>
                                {getEstadoInfo(partido.estado as EstadoPartido).text}
                            </span>
                        </div>
                    )}
                </div>

                {/* Línea 2: Equipos y Resultado */}
                <div className="flex items-center justify-between gap-2 sm:gap-6">
                    {/* Equipo Local */}
                    {partido.equipoLocal?.id_equipo ? (
                        <Link 
                            href={`/equipos/${partido.equipoLocal.id_equipo}`}
                            className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0 hover:opacity-80 transition-opacity"
                        >
                            <span className="text-white font-medium text-sm sm:text-lg text-right break-words">
                                {partido.equipoLocal.nombre}
                            </span>
                            <EscudoEquipo
                                src={partido.equipoLocal.img}
                                alt={partido.equipoLocal.nombre}
                                size={30}
                                className="flex-shrink-0"
                            />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                            <span className="text-white font-medium text-sm sm:text-lg text-right break-words">
                                Local
                            </span>
                            <EscudoEquipo
                                src={undefined}
                                alt="Local"
                                size={30}
                                className="flex-shrink-0"
                            />
                        </div>
                    )}

                    {/* Resultado/Hora */}
                    <div className="flex items-center justify-center min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                        <div className="text-xl sm:text-3xl font-bold text-white">
                            {mostrarResultado ? (
                                <div className="flex items-center gap-1">
                                    {partido.pen_local !== null && partido.pen_local !== undefined && (
                                        <span className="text-[#737373] text-xs sm:text-base">({partido.pen_local})</span>
                                    )}
                                    <span>{partido.goles_local ?? 0}-{partido.goles_visita ?? 0}</span>
                                    {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                                        <span className="text-[#737373] text-xs sm:text-base">({partido.pen_visita})</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-lg sm:text-xl">{formatTime(partido.hora)}</span>
                            )}
                        </div>
                    </div>

                    {/* Equipo Visita */}
                    {partido.equipoVisita?.id_equipo ? (
                        <Link 
                            href={`/equipos/${partido.equipoVisita.id_equipo}`}
                            className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                        >
                            <EscudoEquipo
                                src={partido.equipoVisita.img}
                                alt={partido.equipoVisita.nombre}
                                size={30}
                                className="flex-shrink-0"
                            />
                            <span className="text-white font-medium text-sm sm:text-lg break-words">
                                {partido.equipoVisita.nombre}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <EscudoEquipo
                                src={undefined}
                                alt="Visitante"
                                size={30}
                                className="flex-shrink-0"
                            />
                            <span className="text-white font-medium text-sm sm:text-lg break-words">
                                Visitante
                            </span>
                        </div>
                    )}
                </div>

                {/* Línea 3: Goleadores - Horizontal y compacto */}
                {mostrarResultado && (golesLocal.length > 0 || golesVisita.length > 0) && (
                    <div className="flex items-center justify-center gap-6 pt-2">
                        {/* Goles Local */}
                        <div className="flex flex-wrap gap-2 justify-end flex-1">
                            {golesLocal.map((gol, index) => (
                                <span key={'gol_local_' + index} className="text-xs text-[#d4d4d4]">
                                    {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}&apos;
                                    {gol.penal === 'S' && <span className=""> (P)</span>}
                                    {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                                </span>
                            ))}
                        </div>

                        <PiSoccerBallFill size={16} className="text-[#525252] flex-shrink-0" />

                        {/* Goles Visita */}
                        <div className="flex flex-wrap gap-2 flex-1">
                            {golesVisita.map((gol, index) => (
                                <span key={'gol_visita_' + index} className="text-xs text-[#d4d4d4]">
                                    {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}&apos;
                                    {gol.penal === 'S' && <span className=""> (P)</span>}
                                    {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {esPlanillero && partido.estado !== 'F' && (
                <BotoneraPartido
                    estado={partido.estado as EstadoPartido}
                    isLoading={isLoadingButton}
                    onEmpezarPartido={onEmpezarPartido}
                    onTerminarPrimerTiempo={onTerminarPrimerTiempo}
                    onEmpezarSegundoTiempo={onEmpezarSegundoTiempo}
                    onTerminarPartido={onTerminarPartido}
                    onFinalizarPartido={onFinalizarPartido}
                    onSuspenderPartido={onSuspenderPartido}
                />
            )}

            {/* Botón Registrar Penales - Solo visible si cumple condiciones */}
            {mostrarBotonPenales && (
                <div className="sticky bottom-0 z-50 border-t border-[#262626] px-6 py-4 bg-[var(--black-900)]">
                    <Button
                        onClick={() => setIsModalPenalesOpen(true)}
                        className="w-full py-3"
                        variant="footer"
                    >
                        Registrar Penales
                    </Button>
                </div>
            )}

            {/* Modal de Penales */}
            <ModalPenales
                isOpen={isModalPenalesOpen}
                onClose={() => setIsModalPenalesOpen(false)}
                onConfirm={registrarPenales}
                penLocalActual={partido.pen_local}
                penVisitaActual={partido.pen_visita}
                equipoLocal={partido.equipoLocal?.nombre || 'Local'}
                equipoVisita={partido.equipoVisita?.nombre || 'Visitante'}
                isLoading={isLoadingPenales}
            />
        </div>
    );
};

export default PartidoHeaderSticky;