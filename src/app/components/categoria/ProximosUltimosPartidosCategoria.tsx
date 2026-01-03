import { PartidoCategoria } from "@/app/types/categoria";
import { formatearFechaCorta, formatearHoraCorta } from "@/app/utils/fechas";

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
                        ultimos.map((resultado) => (
                            <div key={resultado.id_partido} className="pb-4 border-b border-[var(--gray-300)] last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 flex-1">
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
                                        <p className="text-xs text-[var(--gray-100)]">
                                            {resultado.zona.nombre} - Jornada {resultado.jornada}
                                            {resultado.dia && ` - ${formatearFechaCorta(resultado.dia)}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProximosUltimosPartidosCategoria;