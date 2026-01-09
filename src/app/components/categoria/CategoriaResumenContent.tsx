import ResumenCategoria from "@/app/components/categoria/ResumenCategoria";
import ProximosUltimosPartidosCategoria from "@/app/components/categoria/ProximosUltimosPartidosCategoria";
import { EstadisticasCategoriaEdicion, PartidoCategoria } from "@/app/types/categoria";
import { useParams } from "next/navigation";

interface CategoriaResumenContentProps {
    estadisticas: EstadisticasCategoriaEdicion;
    proximosPartidos: PartidoCategoria[];
    ultimosPartidos: PartidoCategoria[];
}

export const CategoriaResumenContent = ({
    estadisticas,
    proximosPartidos,
    ultimosPartidos,
}: CategoriaResumenContentProps) => {
    const { id: idEdicion, id_categoria } = useParams();

    return (
        <>
            {/* Estadísticas Cards */}
            <ResumenCategoria estadisticas={estadisticas} edicionId={Number(idEdicion)} idCategoria={Number(id_categoria)} />

            {/* Próximos Partidos y Últimos Resultados */}
            <ProximosUltimosPartidosCategoria
                proximosPartidos={proximosPartidos}
                ultimosPartidos={ultimosPartidos}
            />
        </>
    );
};

