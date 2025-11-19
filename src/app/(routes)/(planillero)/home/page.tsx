"use client";

import { PartidosEquipoCard } from "@/app/components/home/PartidosEquipoCard";
import { TablaPosicionesHome } from "@/app/components/home/TablaPosicionesHome";
import { SancionesHome } from "@/app/components/home/SancionesHome";
import { NoticiasHome } from "@/app/components/home/NoticiasHome";
import { UserPageWrapper } from "@/app/components/layouts/UserPageWrapper";
import { usePlayerStore } from "@/app/stores/playerStore";
import { UnirseEquipoCard } from "@/app/components/home/UnirseEquipoCard";

export default function Home() {
    const { equipos } = usePlayerStore();
    
    return (
        <UserPageWrapper>
            <div className="w-full space-y-6">
                {
                    equipos.length <= 0 ? (
                        <UnirseEquipoCard />
                        // <PartidosEquipoCard />
                    ) : (
                        <PartidosEquipoCard />
                    )
                }

                <TablaPosicionesHome
                    linkTablaCompleta="/posiciones"
                />

                {/* Sanciones Activas */}
                <SancionesHome
                    linkSancionesCompleta="/sanciones"
                />

                {/* Noticias */}
                <NoticiasHome
                    linkNoticiasCompleta="/noticias"
                />
            </div>
        </UserPageWrapper>
    );
}
