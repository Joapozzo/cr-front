"use client";

import { UserPageWrapper } from "@/app/components/layouts/UserPageWrapper";
import { usePlayerStore } from "@/app/stores/playerStore";
import { useWelcomeToast } from "@/app/hooks/useWelcomeToast";
import {
  LazyUnirseEquipoCard,
  LazyPartidosEquipoCard,
  LazyTablaPosicionesHome,
  LazySancionesHome,
  LazyNoticiasHome,
  LazyDreamTeamHome,
} from "@/app/components/home/LazyHomeComponents";

export default function Home() {
  const { equipos } = usePlayerStore();

  useWelcomeToast();

  return (
    <UserPageWrapper>
      <div className="w-full space-y-6">
        <LazyUnirseEquipoCard show={equipos.length === 0} />
        <LazyPartidosEquipoCard show={equipos.length > 0} />
        <LazyTablaPosicionesHome linkTablaCompleta="/estadisticas" />
        <LazyDreamTeamHome />
        <LazySancionesHome />
        <LazyNoticiasHome linkNoticiasCompleta="/noticias" />
      </div>
    </UserPageWrapper>
  );
}
