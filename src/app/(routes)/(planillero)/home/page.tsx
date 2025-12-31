"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { UserPageWrapper } from "@/app/components/layouts/UserPageWrapper";
import { usePlayerStore } from "@/app/stores/playerStore";
import {
  LazyUnirseEquipoCard,
  LazyPartidosEquipoCard,
  LazyTablaPosicionesHome,
  LazySancionesHome,
  LazyNoticiasHome,
} from "@/app/components/home/LazyHomeComponents";

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
                <LazyUnirseEquipoCard show={equipos.length <= 0} />
                <LazyPartidosEquipoCard show={equipos.length > 0} />
                <LazyTablaPosicionesHome linkTablaCompleta="/estadisticas" />
                <LazySancionesHome />
                <LazyNoticiasHome linkNoticiasCompleta="/noticias" />
            </div>
        </UserPageWrapper>
    );
}
