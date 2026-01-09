import { PartidoCategoria } from "@/app/types/categoria";
import { formatearFechaCorta, formatearHoraCorta } from "@/app/utils/fechas";
import { estaEnVivo, getTiempoTexto } from "@/app/utils/tiempoPartido.helper";
import { EstadoPartido } from "@/app/types/partido";
import { EscudoEquipo } from "../common/EscudoEquipo";

interface ProximosUltimosPartidosCategoriaProps {
    proximosPartidos: PartidoCategoria[];
    ultimosPartidos: PartidoCategoria[];
}

const ProximosUltimosPartidosCategoria = ({ proximosPartidos, ultimosPartidos }: ProximosUltimosPartidosCategoriaProps) => {
    // Valores por defecto si no se pasan las props
    const proximos = proximosPartidos || [];
    const ultimos = ultimosPartidos || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximos Partidos */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                <div className="p-6 border-b border-[var(--gray-300)]">
                    <h3 className="text-lg font-semibold text-[var(--white)]">Próximos partidos</h3>
                </div>
                <div className="p-6 space-y-4">
                    {proximos.length === 0 ? (
                        <p className="text-[var(--gray-100)] text-center py-4">No hay próximos partidos programados</p>
                    ) : (
                        proximos.map((partido) => (
                            <div key={partido.id_partido} className="pb-4 border-b border-[var(--gray-300)] last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            {/* Escudo equipo local */}
                                            {partido.equipoLocal?.img && (
                                                <EscudoEquipo
                                                    src={partido.equipoLocal.img}
                                                    alt={partido.equipoLocal.nombre}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-none"
                                                />
                                            )}
                                            <p className="text-[var(--white)] font-medium">
                                                {partido.equipoLocal
                                                    ? partido.equipoLocal.nombre
                                                    : `Vacante ${partido.vacante_local}`
                                                }
                                                {' vs '}
                                                {partido.equipoVisita
                                                    ? partido.equipoVisita.nombre
                                                    : `Vacante ${partido.vacante_visita}`
                                                }
                                            </p>
                                            {/* Escudo equipo visita */}
                                            {partido.equipoVisita?.img && (
                                                <EscudoEquipo
                                                    src={partido.equipoVisita.img}
                                                    alt={partido.equipoVisita.nombre}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-none"
                                                />
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--gray-100)]">
                                            {partido.zona.nombre} - Jornada {partido.jornada}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-[var(--gray-100)] ml-4">
                                        {partido.dia ? (
                                            <>
                                                <p>{formatearFechaCorta(partido.dia)}</p>
                                                <p>{formatearHoraCorta(partido.hora)}</p>
                                            </>
                                        ) : (
                                            <p className="text-[var(--gray-100)]">Por definir</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Últimos Resultados */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                <div className="p-6 border-b border-[var(--gray-300)]">
                    <h3 className="text-lg font-semibold text-[var(--white)]">Últimos resultados</h3>
                </div>
                <div className="p-6 space-y-4">
                    {ultimos.length === 0 ? (
                        <p className="text-[var(--gray-100)] text-center py-4">No hay resultados recientes</p>
                    ) : (
                        ultimos.map((resultado) => {
                            const enVivo = estaEnVivo(resultado.estado as EstadoPartido);
                            const tiempoTexto = enVivo ? getTiempoTexto(resultado.estado as EstadoPartido) : null;

                            return (
                                <div key={resultado.id_partido} className="pb-4 border-b border-[var(--gray-300)] last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Escudo equipo local */}
                                                {resultado.equipoLocal?.img && (
                                                    <EscudoEquipo
                                                        src={resultado.equipoLocal.img}
                                                        alt={resultado.equipoLocal.nombre}
                                                        width={20}
                                                        height={20}
                                                        className="rounded-none"
                                                    />
                                                )}
                                                <p className="text-[var(--white)] font-medium">
                                                    {resultado.equipoLocal
                                                        ? resultado.equipoLocal.nombre
                                                        : `Vacante ${resultado.vacante_local}`
                                                    }
                                                    <span className="mx-2 text-[var(--white)]">
                                                        {resultado.goles_local ?? 0} - {resultado.goles_visita ?? 0}
                                                    </span>
                                                    {resultado.equipoVisita
                                                        ? resultado.equipoVisita.nombre
                                                        : `Vacante ${resultado.vacante_visita}`
                                                    }
                                                </p>
                                                {/* Escudo equipo visita */}
                                                {resultado.equipoVisita?.img && (
                                                    <EscudoEquipo
                                                        src={resultado.equipoVisita.img}
                                                        alt={resultado.equipoVisita.nombre}
                                                        width={20}
                                                        height={20}
                                                        className="rounded-none"
                                                    />
                                                )}
                                                {enVivo && (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a1a] rounded-full border border-[var(--color-primary)]/30">
                                                        <div className="relative flex items-center justify-center">
                                                            <div className="absolute w-2 h-2 bg-[var(--color-primary)] rounded-full animate-ping opacity-75" />
                                                            <div className="relative w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                                                        </div>
                                                        <span className="text-[var(--color-primary)] text-[10px] font-semibold uppercase">
                                                            En Vivo
                                                        </span>
                                                        {tiempoTexto && (
                                                            <span className="text-[var(--color-primary)] text-[10px] font-medium">
                                                                {tiempoTexto}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--gray-100)]">
                                                {resultado.zona.nombre} - Jornada {resultado.jornada}
                                                {resultado.dia && ` - ${formatearFechaCorta(resultado.dia)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProximosUltimosPartidosCategoria;