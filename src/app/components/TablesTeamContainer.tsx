import SquadTable from "./PlantelTable";
import StandingsTable from "./StandingsTable";

interface TeamTablesContainerProps {
    id_categoria_edicion: number;
    id_zona?: number;
    esCapitan: boolean;
    esEdicionActual: boolean;
    id_equipo: number;
}

export default function TeamTablesContainer({
    id_categoria_edicion,
    id_zona,
    esCapitan,
    esEdicionActual,
    id_equipo
}: TeamTablesContainerProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <SquadTable
                    id_categoria_edicion={id_categoria_edicion}
                    id_equipo={id_equipo}
                    esCapitan={esCapitan}
                    esEdicionActual={esEdicionActual}
                />
            </div>

            <div>
                <StandingsTable
                    id_categoria_edicion={id_categoria_edicion}
                    id_zona={id_zona}
                />
            </div>
        </div>
    );
}