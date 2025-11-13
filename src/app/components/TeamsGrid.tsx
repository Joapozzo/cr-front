import GoleadorCard from "./GoleadorCard";
import MejorValoradoCard from "./MejorValoradoCard";
import PosicionTablaCard from "./PosicionesTablaCard";

interface TeamStatsGridProps {
    id_edicion: number;
}

export const TeamStatsGrid = ({id_edicion}: TeamStatsGridProps) => {
    // mandamos la data con id edicion a cada componente
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            <GoleadorCard />
            <MejorValoradoCard />
            <PosicionTablaCard />
        </div>
    );
};