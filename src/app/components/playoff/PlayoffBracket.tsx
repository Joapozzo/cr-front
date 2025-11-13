import { Zona } from "@/app/types/zonas";
import Conector from "./Conector";
import FaseColumna from "./FaseCol";
import { PartidoZona } from "@/app/types/partido";

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

    return (
        <div className="overflow-x-auto">
            <div className="inline-flex items-start gap-0 min-w-max p-4">
                {fasesOrdenadas.length > 0 ? (
                    fasesOrdenadas.map((fase, index) => (
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
                    ))
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