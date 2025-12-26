import { Zona } from "@/app/types/zonas";
import Conector from "./Conector";
import FaseColumna from "./FaseCol";
import { PartidoZona } from "@/app/types/partido";
import Campeon from "../Campeon";

interface PlayoffBracketProps {
    zonas: Zona[];
}

const PlayoffBracket = ({ zonas }: PlayoffBracketProps) => {
    // Agrupar por número de fase
    const fasesAgrupadas = zonas.reduce((acc, zona) => {
        const fase = zona.numero_fase ?? 0;
        if (!acc[fase]) {
            acc[fase] = {
                partidos: [],
                nombre: zona.nombre || `Fase ${fase}`,
            };
        }
        if (zona.partidos) {
            acc[fase].partidos.push(...zona.partidos);
        }
        return acc;
    }, {} as Record<number, { partidos: PartidoZona[]; nombre: string }>);

    const fasesOrdenadas = Object.entries(fasesAgrupadas)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([numFase, data]) => ({
            numero: Number(numFase),
            partidos: data.partidos,
            nombre: data.nombre,
        }));

    // Buscar el campeón en la última fase o en cualquier zona
    const ultimaFase = fasesOrdenadas.length > 0 ? fasesOrdenadas[fasesOrdenadas.length - 1] : null;
    const zonaConCampeon = zonas.find(z => z.equipoCampeon && z.equipoCampeon.id_equipo);
    const equipoCampeon = zonaConCampeon?.equipoCampeon;

    return (
        <div className="overflow-x-auto">
            <div className="inline-flex items-start gap-0 min-w-max p-4">
                {fasesOrdenadas.length > 0 ? (
                    <>
                        {fasesOrdenadas.map((fase, index) => (
                            <div key={fase.numero} className="flex items-center">
                                {index > 0 && (
                                    <Conector altura={200 * Math.pow(2, index)} />
                                )}
                                <FaseColumna
                                    titulo={fase.nombre}
                                    numeroFase={fase.numero}
                                    partidos={fase.partidos}
                                />
                            </div>
                        ))}
                        {/* Mostrar campeón al final si existe */}
                        {equipoCampeon && (
                            <>
                                <Conector altura={200 * Math.pow(2, fasesOrdenadas.length)} />
                                <div className="flex flex-col items-center">
                                    <div className="text-center mb-4 sticky top-0 bg-[var(--yellow)]/20 py-2 px-4 rounded-lg border border-[var(--yellow)]/30">
                                        <h4 className="text-[var(--white)] font-semibold">
                                            Campeón
                                        </h4>
                                    </div>
                                    <div className="bg-[var(--gray-400)] rounded-lg border-2 border-[var(--yellow)] p-6 min-w-[280px]">
                                        <Campeon
                                            equipo={equipoCampeon}
                                            size="md"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-8">
                        <p className="text-[var(--gray-200)] text-center italic">
                            No hay partidos de playoff disponibles
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayoffBracket;