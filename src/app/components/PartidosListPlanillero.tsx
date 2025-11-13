import { FileText } from "lucide-react";
import PartidoItem from "./PartidoItem";
import { Partido } from "../types/partido";

interface PartidosListProps {
    partidos: Partido[];
    isPendientes?: boolean;
    onPartidoClick?: (partidoId: number) => void;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
}

const PartidosList: React.FC<PartidosListProps> = ({
    partidos,
    isPendientes = false,
    onPartidoClick,
    emptyMessage = "No hay partidos disponibles",
    emptyIcon = <FileText className="text-[#525252]" size={32} />
}) => {

    if (partidos.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="mb-3 flex justify-center">
                    {emptyIcon}
                </div>
                <p className="text-[#525252] text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {partidos.map((partido) => (
                <PartidoItem
                    key={partido.id_partido}
                    partido={partido}
                    isPendiente={isPendientes}
                    onClick={onPartidoClick}
                />
            ))}
        </div>
    );
};

export default PartidosList;