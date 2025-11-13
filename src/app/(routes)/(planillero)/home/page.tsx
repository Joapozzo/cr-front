import { PartidosEquipoCard, mockPartidos } from "@/app/components/home/PartidosEquipoCard";
import { TablaPosicionesHome, mockTablasPosiciones } from "@/app/components/home/TablaPosicionesHome";
import { SancionesHome, mockSanciones } from "@/app/components/home/SancionesHome";
import { NoticiasHome, mockNoticias } from "@/app/components/home/NoticiasHome";
import { UserPageWrapper } from "@/app/components/layouts/UserPageWrapper";

export default function Home() {
    // TODO: Reemplazar mock data con datos reales de hooks
    // const { partidos, loading } = usePartidosJugador();
    // const { tablasPosiciones, loading: loadingPosiciones } = useTablasJugador();
    // const { sanciones, loading: loadingSanciones } = useSancionesActivas();
    // const { data: noticiasData, isLoading: loadingNoticias } = useNoticiasRecientes(4);
    // const { misEquipos } = usePlayerStore();
    // const misEquiposIds = misEquipos.map(e => e.id);

    // Mock: IDs de equipos del usuario (1 y 3 en este ejemplo)
    const misEquiposIds = [1, 3];

    return (
        <UserPageWrapper>
            <div className="w-full space-y-6">
                {/* Mostrar solo si no tiene equipos */}
                {/* <UnirseEquipoCard /> */}

                {/* Partidos de mis equipos */}
                <PartidosEquipoCard
                    partidos={mockPartidos}
                    misEquiposIds={misEquiposIds}
                />

                {/* Tabla de Posiciones - Una tabla por cada equipo del usuario */}
                <TablaPosicionesHome
                    tablas={mockTablasPosiciones}
                    linkTablaCompleta="/posiciones"
                />

                {/* Sanciones Activas */}
                <SancionesHome
                    sanciones={mockSanciones}
                    linkSancionesCompleta="/sanciones"
                />

                {/* Noticias */}
                <NoticiasHome
                    noticias={mockNoticias}
                    linkNoticiasCompleta="/noticias"
                />

                {/* ========================================
                    EJEMPLOS DE ESTADOS: 
                    - Descomentar para ver loading o vacío 
                   ======================================== */}

                {/* Loading states - Muestra skeleton de tabla */}
                {/* <TablaPosicionesHome loading={true} /> */}
                {/* <SancionesHome loading={true} /> */}

                {/* Estados vacíos */}
                {/* <PartidosEquipoCard partidos={[]} misEquiposIds={misEquiposIds} /> */}
                {/* <TablaPosicionesHome tablas={[]} /> */}
                {/* <SancionesHome sanciones={[]} /> */}
                {/* <NoticiasHome noticias={[]} /> */}
            </div>
        </UserPageWrapper>
    );
}
