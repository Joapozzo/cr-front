import { Zona } from '../../types/zonas';
import CardVacanteZona from '../vacantes/CardVacanteZona';

interface ZonaExpandedContentProps {
    zona: Zona;
}

export const ZonaExpandedContent = ({ zona }: ZonaExpandedContentProps) => {
    const temporadas = zona.temporadas || [];

    if (zona.tipoZona?.id === 2 && zona.partidos && zona.partidos.length > 0) {
        return (
            <div className="border-t border-[var(--gray-300)] p-2">
                <div className={`grid ${zona.partidos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-1'}`}>
                    {zona.partidos.map((partido, index) => {
                        const faseLetra = String.fromCharCode(64 + zona.numero_fase);

                        return (
                            <div
                                key={partido.id_partido}
                                className="bg-[var(--gray-400)] rounded-lg p-2 relative"
                            >
                                <div className="text-xs text-[var(--gray-100)] font-medium mb-2 text-center">
                                    CRUCE {index + 1}
                                </div>

                                <div className="grid grid-cols-2 gap-3 relative">
                                    <CardVacanteZona
                                        equipo={partido.equipoLocal || null}
                                        vacante={partido.vacante_local}
                                        idZona={zona.id_zona}
                                        idCategoriaEdicion={zona.id_categoria_edicion}
                                        nomenclatura={`${faseLetra}${partido.vacante_local}`}
                                        temporada={{
                                            ...partido.temporadaLocal,
                                            info_vacante: partido.info_vacante_local,
                                        }}
                                        esEliminacionDirecta={true}
                                        numeroFaseActual={zona.numero_fase}
                                        partido={partido}
                                    />

                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                        <div className="bg-[var(--gray-400)] border border-[var(--gray-200)] rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                                            <span className="text-xs font-bold text-[var(--gray-100)]">
                                                VS
                                            </span>
                                        </div>
                                    </div>

                                    <CardVacanteZona
                                        equipo={partido.equipoVisita || null}
                                        vacante={partido.vacante_visita}
                                        idZona={zona.id_zona}
                                        idCategoriaEdicion={zona.id_categoria_edicion}
                                        nomenclatura={`${faseLetra}${partido.vacante_visita}`}
                                        temporada={{
                                            ...partido.temporadaVisita,
                                            info_vacante: partido.info_vacante_visita,
                                        }}
                                        esEliminacionDirecta={true}
                                        numeroFaseActual={zona.numero_fase}
                                        partido={partido}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="border-t border-[var(--gray-300)] p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {temporadas.map((temporada) => {
                    const equipo = temporada.equipo;
                    const vacante = temporada.vacante;
                    return (
                        <CardVacanteZona
                            key={`${zona.id_zona}-${vacante}`}
                            equipo={equipo || null}
                            vacante={vacante}
                            idZona={zona.id_zona}
                            idCategoriaEdicion={zona.id_categoria_edicion}
                            temporada={{
                                ...temporada,
                                info_vacante: temporada.info_vacante,
                            }}
                            esEliminacionDirecta={false}
                        />
                    );
                })}
            </div>
        </div>
    );
};

