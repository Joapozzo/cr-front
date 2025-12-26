"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { PartidosEquipoCard } from "@/app/components/home/PartidosEquipoCard";
import { TablaPosicionesHome } from "@/app/components/home/TablaPosicionesHome";
import { SancionesHome } from "@/app/components/home/SancionesHome";
import { NoticiasHome } from "@/app/components/home/NoticiasHome";
import { UserPageWrapper } from "@/app/components/layouts/UserPageWrapper";
import { usePlayerStore } from "@/app/stores/playerStore";
import { UnirseEquipoCard } from "@/app/components/home/UnirseEquipoCard";

export default function Home() {
    const { equipos } = usePlayerStore();

    useEffect(() => {
        const registroCompleto = sessionStorage.getItem('registro_completo');
        const usuarioNombre = sessionStorage.getItem('usuario_nombre');

        if (registroCompleto === 'true') {
            // Limpiar el flag
            sessionStorage.removeItem('registro_completo');
            sessionStorage.removeItem('usuario_nombre');

            // Mostrar toast de bienvenida
            const nombre = usuarioNombre || 'Usuario';
            toast.success(
                `¡Bienvenido a Copa Relámpago, ${nombre}! 🎉`,
                {
                    duration: 5000,
                    icon: '👋',
                    style: {
                        background: 'var(--gray-400)',
                        color: 'white',
                        border: '1px solid var(--green)',
                    },
                }
            );
        }
    }, []);
    
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
                    linkTablaCompleta="/estadisticas/posiciones"
                />

                {/* Sanciones Activas */}
                <SancionesHome
                    linkSancionesCompleta="/estadisticas/sanciones"
                />

                {/* Noticias */}
                <NoticiasHome
                    linkNoticiasCompleta="/noticias"
                />
            </div>
        </UserPageWrapper>
    );
}
