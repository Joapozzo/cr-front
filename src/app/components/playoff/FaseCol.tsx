import { PartidoZona } from "@/app/types/partido";
import PartidoLlave from "./PartidoLlave";

interface FaseColumnaProps {
    titulo: string;
    partidos: PartidoZona[];
    numeroFase: number;
    isPlaceholder?: boolean;
}

const FaseColumna = ({ titulo, partidos, numeroFase, isPlaceholder }: FaseColumnaProps) => (
    <div className="flex flex-col items-center">
        <div className="text-center mb-4 sticky top-0 bg-[var(--gray-500)] py-2 px-4 rounded-lg">
            <h4 className="text-[var(--white)] font-semibold">
                {titulo}
            </h4>
            <span className="text-[var(--gray-200)] text-xs">Fase {numeroFase}</span>
        </div>
        <div className="space-y-8">
            {isPlaceholder ? (
                <div className="bg-[var(--gray-400)] rounded-lg border border-dashed border-[var(--gray-300)] p-8 min-w-[280px]">
                    <p className="text-[var(--gray-200)] text-center text-sm italic">
                        Fase no iniciada
                    </p>
                </div>
            ) : partidos.length > 0 ? (
                partidos.map((partido) => (
                    <PartidoLlave key={partido.id_partido} partido={partido} />
                ))
            ) : (       // Sin partidos
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-8 min-w-[280px]">
                    <p className="text-[var(--gray-200)] text-center text-sm italic">
                        Sin partidos
                    </p>
                </div>
            )}
        </div>
    </div>
);


export default FaseColumna;